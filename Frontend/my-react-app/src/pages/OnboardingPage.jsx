import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, Rocket, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


const OnboardingPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null); // 'Admin' or 'Member'
    const [userName, setUserName] = useState("");

    

    // Admin Fields
    const [position, setPosition] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamSize, setTeamSize] = useState('');

    // Member Fields
    const [projectName, setProjectName] = useState('');
    const [jobFunction, setJobFunction] = useState('');

    useEffect(() => {
        // Retrieve name from temp storage
        const unsub = onAuthStateChanged(auth,(user)=>{
            if (user){
                setUserName(user.displayName || "User");
            }
        });
        return ()=>unsub();
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        // Add a slight delay for visual confirmation before transition
        setTimeout(() => setStep(2), 200);
    };

    const handleComplete = () => {
        console.log('Onboarding Complete', {
            role,
            position,
            teamName,
            teamSize,
            projectName,
            jobFunction
        });
        navigate('/dashboard');
    };

    // Animation Variants
    const slideUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="ob-page-wrapper">
            <div className="ob-container">

                {/* Left Side: Interaction */}
                <div className="ob-left">
                    {/* Minimalist Step Indicator */}
                    <div className="ob-step-indicator">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`ob-step-dot ${step >= s ? 'active' : ''}`}
                            />
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
                                                <div>
                                                    <label className="ob-label">Project Name</label>
                                                    <div className="ob-input-group">
                                                        <Briefcase className="ob-icon" size={18} />
                                                        <input
                                                            type="text"
                                                            className="ob-input"
                                                            placeholder="Project Name"
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
                                                onClick={handleComplete}
                                            >
                                                Launch Workspace
                                                <ArrowRight size={18} />
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

                    {/* Ghost Kanban Board Background */}
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
