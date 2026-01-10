import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, Rocket, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null); // 'Admin' or 'Member'
    const [userName, setUserName] = useState('User');

    // Admin Fields
    const [position, setPosition] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamSize, setTeamSize] = useState('');

    // Member Fields
    const [projectName, setProjectName] = useState('');
    const [jobFunction, setJobFunction] = useState('');

    useEffect(() => {
        // Retrieve name from temp storage
        const storedUser = localStorage.getItem('tn_user_temp');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserName(parsed.name || 'User');
        }
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleComplete = () => {
        // Here you would make the API call to update the user profile
        console.log('Onboarding Complete', {
            role,
            position,
            teamName,
            teamSize,
            projectName,
            jobFunction
        });

        // Redirect to Dashboard
        navigate('/dashboard');
    };

    return (
        <div className="onboarding-container">
            {/* Left Side: Form Area */}
            <div className="onboarding-left">

                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                    ></div>
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div>
                            <h2 className="auth-header" style={{ marginBottom: '30px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>First, define your role.</span>
                            </h2>

                            <div className="role-cards">
                                <div
                                    className={`role-card ${role === 'Admin' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('Admin')}
                                >
                                    <Briefcase className="role-icon" size={32} />
                                    <h3 className="role-title">I am an Admin / Owner</h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                                        I'm setting up a new workspace for my team.
                                    </p>
                                </div>

                                <div
                                    className={`role-card ${role === 'Member' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('Member')}
                                >
                                    <User className="role-icon" size={32} />
                                    <h3 className="role-title">I am a Team Member</h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                                        I'm joining an existing project or team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details Flow */}
                    {step === 2 && (
                        <div>
                            <h2 className="auth-header" style={{ marginBottom: '30px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                                    {role === 'Admin' ? 'Setup your Workspace' : 'Join your Project'}
                                </span>
                            </h2>

                            <form className="auth-form">
                                {/* ADMIN FLOW */}
                                {role === 'Admin' && (
                                    <>
                                        <div>
                                            <label className="step-label">Your Position</label>
                                            <div className="auth-input-group">
                                                <select
                                                    className="auth-input"
                                                    style={{ paddingLeft: '16px' }}
                                                    value={position}
                                                    onChange={(e) => setPosition(e.target.value)}
                                                >
                                                    <option value="" disabled>Select your role...</option>
                                                    <option value="Project Manager">Project Manager</option>
                                                    <option value="CEO">CEO / Founder</option>
                                                    <option value="Tech Lead">Tech Lead</option>
                                                    <option value="Operations">Operations Head</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="step-label">Team Name</label>
                                            <div className="auth-input-group">
                                                <Rocket className="auth-icon" size={20} />
                                                <input
                                                    type="text"
                                                    className="auth-input"
                                                    placeholder="Decide your Team Name"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="step-label">Team Size</label>
                                            <div className="pill-group">
                                                {['1-5', '6-20', '21-50', '50+'].map((size) => (
                                                    <div
                                                        key={size}
                                                        className={`pill-selector ${teamSize === size ? 'active' : ''}`}
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
                                            <label className="step-label">Project Name</label>
                                            <div className="auth-input-group">
                                                <Briefcase className="auth-icon" size={20} />
                                                <input
                                                    type="text"
                                                    className="auth-input"
                                                    placeholder="Which project are you joining?"
                                                    value={projectName}
                                                    onChange={(e) => setProjectName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="step-label">Add me in my role in the team</label>
                                            <div className="auth-input-group">
                                                <User className="auth-icon" size={20} />
                                                <input
                                                    type="text"
                                                    className="auth-input"
                                                    placeholder="e.g. UI Designer, Backend Dev"
                                                    value={jobFunction}
                                                    onChange={(e) => setJobFunction(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Disabled/Locked Fields for Context */}
                                        <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                                            <label className="step-label">Team Name (Locked)</label>
                                            <div className="auth-input-group">
                                                <input type="text" className="auth-input" value="Locked for Members" readOnly />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="button"
                                    className="auth-btn-primary"
                                    onClick={handleComplete}
                                    style={{ marginTop: '20px' }}
                                >
                                    Launch My Workspace
                                </button>

                                <button
                                    type="button"
                                    className="tn-btn-ghost"
                                    onClick={() => setStep(1)}
                                    style={{ marginTop: '10px', fontSize: '14px' }}
                                >
                                    Cancel & Go Back
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Right Side: Welcome Message (Azure Blue) */}
            <div className="onboarding-right">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
                        Welcome to ToggleNest, <br /> {userName}! 👋
                    </h1>
                    <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: '1.6' }}>
                        Let's configure your workspace for maximum productivity.
                        {role === 'Admin' ? ' As an admin, you have full control over the team setup.' : ' Join your team and start collaborating instantly.'}
                    </p>

                    <div style={{ marginTop: '60px', display: 'flex', gap: '15px', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={20} /> <span>Real-time collaboration</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={20} /> <span>Smart Kanban boards</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={20} /> <span>Automated workflows</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OnboardingPage;
