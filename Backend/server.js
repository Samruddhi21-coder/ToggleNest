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
app.post('/api/onboarding', async (req, res) => {
  try {
    const {
      email,
      role,
      position,
      teamName,
      teamSize,
      projectName,
      projectId, // New verification field
      jobFunction
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // --- Role-Based Verification Logic ---
    if (role === 'Member') {
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required for members." });
      }
      // Search for an Admin who owns this Project ID
      const adminOwner = await User.findOne({ role: 'Admin', projectId: projectId });

      if (!adminOwner) {
        return res.status(404).json({ message: "This Project ID does not exist. Please check with your Admin." });
      }
      // If found, we proceed to save the member
    }
    // For Admins, we just save the Project ID they created (could add uniqueness check here later)

    const updateData = {
      role,
      position,
      teamName,
      teamSize,
      projectName,
      projectId,
      memberRole: jobFunction,
      onboardingComplete: true
    };

    // Use findOneAndUpdate with upsert to create or update
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Workspace details saved successfully!",
      user: updatedUser
    });

  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
