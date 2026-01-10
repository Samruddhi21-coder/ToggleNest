import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, User, CheckCircle, ArrowRight, Layers, Hash, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import "./Onboarding.css";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Form fields
  const [projectId, setProjectId] = useState("");
  const [position, setPosition] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [projectName, setProjectName] = useState("");
  const [jobFunction, setJobFunction] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------
  // 1️⃣ Auth Listener + Check Onboarding
  // -----------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Check if onboarding is already completed
        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);
        const data = snap.exists() ? snap.data() : null;

        if (data?.onboardingCompleted) {
          navigate("/dashboard"); // Returning user → dashboard
        } else {
          setUserName(firebaseUser.displayName || "User");
          setUserEmail(firebaseUser.email);
        }
      } else {
        navigate("/"); // Not logged in → landing page
      }
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  // -----------------------------
  // 2️⃣ Handle Role Selection
  // -----------------------------
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setTimeout(() => setStep(2), 200);
  };

  // -----------------------------
  // 3️⃣ Finish Onboarding & Navigate
  // -----------------------------
  const handleLaunch = async () => {
    if (!projectId) {
      toast.error("Please enter a Project ID.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Validating Project ID...");

    const onboardingData = {
      email: userEmail,
      role,
      projectId,
      position: role === "Admin" ? position : undefined,
      teamName: role === "Admin" ? teamName : undefined,
      teamSize: role === "Admin" ? teamSize : undefined,
      projectName: role === "Member" ? projectName : undefined,
      jobFunction: role === "Member" ? jobFunction : undefined,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/onboarding",
        onboardingData
      );

      if (response.status === 200) {
        toast.success("Workspace created! Redirecting...", { id: loadingToast });

        // Mark onboarding as completed in Firestore
        if (user) {
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, { onboardingCompleted: true });
        }

        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Onboarding Failed:", error);
      const errMsg =
        error.response?.data?.message || "Connection error: Nest not found";
      toast.error(errMsg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // 4️⃣ Animation Variants
  // -----------------------------
  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <p>Loading...</p>;

    return (
        <div className="ob-page-wrapper">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="ob-container">

                {/* Left Side: Interaction */}
                <div className="ob-left">
                    <div className="ob-step-indicator">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`ob-step-dot ${step >= s ? 'active' : ''}`} />
                        ))}
                    </div>

                    <div style={{ maxWidth: '480px', width: '100%', zIndex: 10 }}>
                        <motion.div
                            key={step}
                            initial="hidden"
                            animate="visible"
                            variants={slideUp}
                        >
                            {/* STEP 1: ROLE SELECTION */}
                            {step === 1 && (
                                <>
                                    <div className="ob-header">
                                        <h1 className="ob-title">First, define your role.</h1>
                                        <p className="ob-subtitle">Select the option that best describes you.</p>
                                    </div>

                                    <div className="ob-role-grid">
                                        <div
                                            className={`ob-role-card ${role === 'Admin' ? 'active' : ''}`}
                                            onClick={() => handleRoleSelect('Admin')}
                                        >
                                            <Briefcase className="ob-role-icon" size={32} />
                                            <h3 className="ob-role-title">Admin / Owner</h3>
                                            <p className="ob-role-desc">I'm setting up a new workspace.</p>
                                        </div>

                                        <div
                                            className={`ob-role-card ${role === 'Member' ? 'active' : ''}`}
                                            onClick={() => handleRoleSelect('Member')}
                                        >
                                            <User className="ob-role-icon" size={32} />
                                            <h3 className="ob-role-title">Team Member</h3>
                                            <p className="ob-role-desc">I'm joining an existing project.</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* STEP 2: DETAILS FORM */}
                            {step === 2 && (
                                <>
                                    <div className="ob-header">
                                        <h1 className="ob-title">
                                            {role === 'Admin' ? 'Setup your Workspace' : 'Join your Project'}
                                        </h1>
                                        <p className="ob-subtitle">Let's get the details right.</p>
                                    </div>

                                    <form className="ob-form" onSubmit={(e) => e.preventDefault()}>

                                        {/* ADMIN FLOW */}
                                        {role === 'Admin' && (
                                            <>
                                                <div>
                                                    <label className="ob-label">Your Position</label>
                                                    <div className="ob-input-group">
                                                        <select
                                                            className="ob-input ob-select"
                                                            value={position}
                                                            onChange={(e) => setPosition(e.target.value)}
                                                        >
                                                            <option value="" disabled>Select option...</option>
                                                            <option value="Project Manager">Project Manager</option>
                                                            <option value="CEO">CEO / Founder</option>
                                                            <option value="Tech Lead">Tech Lead</option>
                                                            <option value="Operations">Operations</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="ob-label">Team Name</label>
                                                    <div className="ob-input-group">
                                                        <Layers className="ob-icon" size={18} />
                                                        <input
                                                            type="text"
                                                            className="ob-input"
                                                            placeholder="Workspace Name"
                                                            value={teamName}
                                                            onChange={(e) => setTeamName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Project ID for Admin */}
                                                <div>
                                                    <label className="ob-label">Create Project ID</label>
                                                    <div className="ob-input-group">
                                                        <Hash className="ob-icon" size={18} />
                                                        <input
                                                            type="text"
                                                            className="ob-input"
                                                            placeholder="Create a unique Project ID for your team"
                                                            value={projectId}
                                                            onChange={(e) => setProjectId(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="ob-label">Team Size</label>
                                                    <div className="ob-pill-group">
                                                        {['1-5', '6-20', '21-50', '50+'].map((size) => (
                                                            <div
                                                                key={size}
                                                                className={`ob-pill ${teamSize === size ? 'active' : ''}`}
                                                                onClick={() => setTeamSize(size)}
                                                            >
                                                                {size}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* MEMBER FLOW */}
                                        {role === 'Member' && (
                                            <>
                                                {/* Project ID for Member - Priority 1 */}
                                                <div>
                                                    <label className="ob-label">Enter Project ID</label>
                                                    <div className="ob-input-group">
                                                        <Lock className="ob-icon" size={18} />
                                                        <input
                                                            type="text"
                                                            className="ob-input"
                                                            placeholder="Enter the Project ID provided by your Admin"
                                                            value={projectId}
                                                            onChange={(e) => setProjectId(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="ob-label">Project Name</label>
                                                    <div className="ob-input-group">
                                                        <Briefcase className="ob-icon" size={18} />
                                                        <input
                                                            type="text"
                                                            className="ob-input"
                                                            placeholder="Project Name (Optional)"
                                                            value={projectName}
                                                            onChange={(e) => setProjectName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="ob-label">Your Role</label>
                                                    <div className="ob-input-group">
                                                        <User className="ob-icon" size={18} />
                                                        <input
                                                            type="text"
                                                            className="ob-input"
                                                            placeholder="e.g. Designer, Developer"
                                                            value={jobFunction}
                                                            onChange={(e) => setJobFunction(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <button
                                                type="button"
                                                className="ob-btn-primary"
                                                onClick={handleLaunch}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Verifying..." : "Launch Workspace"}
                                                {!isLoading && <ArrowRight size={18} />}
                                            </button>

                                            <button
                                                type="button"
                                                className="ob-btn-ghost"
                                                onClick={() => setStep(1)}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Identity & Ghost UI */}
                <div className="ob-right">
                    <div className="ob-ghost-board">
                        <div className="ob-ghost-column">
                            <div className="ob-ghost-col-header"></div>
                            <div className="ob-ghost-card h-24"></div>
                            <div className="ob-ghost-card h-32"></div>
                            <div className="ob-ghost-card h-20"></div>
                        </div>
                        <div className="ob-ghost-column mt-12">
                            <div className="ob-ghost-col-header"></div>
                            <div className="ob-ghost-card h-28"></div>
                            <div className="ob-ghost-card h-24"></div>
                        </div>
                        <div className="ob-ghost-column mt-8">
                            <div className="ob-ghost-col-header"></div>
                            <div className="ob-ghost-card h-40"></div>
                            <div className="ob-ghost-card h-20"></div>
                        </div>
                    </div>

                    <div className="ob-welcome-content">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="ob-welcome-title">
                                Welcome, <br /> {userName}.
                            </h1>
                            <p className="ob-welcome-text">
                                You're moments away from clarity. ToggleNest is designed to help you focus on what truly matters.
                            </p>

                            <div className="ob-feature-list">
                                <div className="ob-feature-item">
                                    <CheckCircle size={20} className="ob-feature-icon" />
                                    <span>Workspace Customization</span>
                                </div>
                                <div className="ob-feature-item">
                                    <CheckCircle size={20} className="ob-feature-icon" />
                                    <span>Real-time Sync</span>
                                </div>
                                <div className="ob-feature-item">
                                    <CheckCircle size={20} className="ob-feature-icon" />
                                    <span>Automated Workflows</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OnboardingPage;
