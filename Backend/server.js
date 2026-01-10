import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// 1. User Schema Definition
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Admin', 'Member'] },
  position: String,
  teamName: String,
  teamSize: String,
  projectName: String,
  projectId: { type: String }, // New Field for verification
  memberRole: String, // Matches 'jobFunction' or 'memberRole' from frontend
  onboardingComplete: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

// 2. Onboarding Logic Route
// 2. Onboarding Logic Route
app.post('/api/onboarding', async (req, res) => {
  try {
    console.log("--------------------------------------------------");
    console.log("INCOMING ONBOARDING REQUEST:", req.body);

    const {
      email,
      role,
      position,
      teamName,
      teamSize,
      projectName,
      projectId,
      jobFunction
    } = req.body;

    if (!email) {
      console.log("Error: Email missing");
      return res.status(400).json({ message: "Email is required" });
    }

    // Prepare search ID (if exists)
    const searchId = projectId ? projectId.toString().trim() : "";

    // --- Role-Based Verification Logic ---
    if (role === 'Member') {
      console.log(`Verifying Member for Project ID: '${searchId}'`);

      if (!searchId) {
        return res.status(400).json({ message: "Project ID is required for members." });
      }

      // Case Insensitive Search
      const adminOwner = await User.findOne({
        role: 'Admin',
        projectId: { $regex: new RegExp(`^${searchId}$`, 'i') }
      });

      if (!adminOwner) {
        console.log("❌ Admin NOT found for Project ID:", searchId);
        return res.status(404).json({ message: `Project ID "${projectId}" not found. Please verify with your Admin.` });
      }

      console.log("✅ Admin FOUND:", adminOwner.email);
    }

    // --- Data Persistence ---
    const updateData = {
      role,
      position,
      teamName,
      teamSize,
      projectName,
      projectId: searchId || undefined, // Store trimmed ID
      memberRole: jobFunction,
      onboardingComplete: true
    };

    console.log("Updating User with Data:", updateData);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log("Onboarding Success for:", updatedUser.email);

    res.status(200).json({
      message: "Workspace details saved successfully!",
      user: updatedUser
    });

  } catch (error) {
    console.error("🔥 Onboarding Server Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// 3. Project Schema Definition
const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  members: [{ type: String }] // Array of member emails
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);

// 4. Dashboard Sync Route
app.get("/api/dashboard/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // 1. Find Current User
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { projectId: activeProjectId, projectName: activeProjectName, role } = currentUser;

    // 2. Teammates Logic
    // Find users with the same projectId, excluding the current user
    const teammates = await User.find({
      projectId: activeProjectId,
      email: { $ne: email }
    }).select("email role position"); // Select only necessary fields

    // 3. Project History Logic
    // Find projects where user is a member OR admin, excluding the active one
    const history = await Project.find({
      $and: [
        {
          $or: [
            { members: email },
            { adminEmail: email }
          ]
        },
        { projectId: { $ne: activeProjectId } }
      ]
    });

    // 4. Return Data
    res.status(200).json({
      activeProjectName: activeProjectName || "No Functioning Project",
      teammates: teammates.map(t => ({
        name: t.email.split('@')[0], // Simple name derivation or add 'name' field to User schema if exists
        email: t.email,
        role: t.role
      })),
      history: history.map(p => ({
        name: p.projectName,
        id: p.projectId
      }))
    });

  } catch (error) {
    console.error("Dashboard Sync Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 5. Query Schema & Routes
const QuerySchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  text: { type: String, required: true },
  senderEmail: { type: String },
  isResolved: { type: Boolean, default: false }
}, { timestamps: true });

const Query = mongoose.model("Query", QuerySchema);

// Add New Query
app.post("/api/queries", async (req, res) => {
  try {
    const { projectId, text, senderEmail } = req.body;
    const newQuery = new Query({ projectId, text, senderEmail });
    await newQuery.save();
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: "Error saving query" });
  }
});

// Get Queries for Project
app.get("/api/queries/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const queries = await Query.find({ projectId }).sort({ createdAt: 1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries" });
  }
});

// Resolve/Unresolve Query
app.patch("/api/queries/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findById(id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    query.isResolved = !query.isResolved;
    await query.save();
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ message: "Error updating query" });
  }
});

// 6. team member contact
app.get("/api/team/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const teamMembers = await User.find({ projectId });
    res.status(200).json({ teamMembers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in fetching team details" });
  }
})

app.get("/", (req, res) => {
  res.send("Backend running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
