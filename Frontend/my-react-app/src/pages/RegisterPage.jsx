import React, { useState } from 'react';
import { User, Mail, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';
import reg from "/image/reg.jpg"
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        recoveryEmail: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );

        // 👤 Update display name
        await updateProfile(userCredential.user, {
            displayName: formData.name,
        });
        const token = await userCredential.user.getIdToken();

        fetch("http://localhost:5000/api/auth/verify", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).catch(() => {});
        navigate("/onboarding");
    } catch (error) {
        alert(error.message);
    }
};



    return (
        <div className="auth-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-split-card"
            >
                {/* Left Side: Form */}
                <div className="auth-left">
                    <div className="auth-header">
                        <h2>Create your account</h2>
                        <p>Start managing your projects efficiently today.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-group">
                            <User className="auth-icon" size={20} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Professional Name"
                                className="auth-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <Mail className="auth-icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Professional Email"
                                className="auth-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <ShieldCheck className="auth-icon" size={20} />
                            <input
                                type="email"
                                name="recoveryEmail"
                                placeholder="Recovery Email (Optional)"
                                className="auth-input"
                                value={formData.recoveryEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-input-group">
                            <Lock className="auth-icon" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Create Password"
                                className="auth-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn-primary">
                            Create Account
                        </button>
                    </form>

                    <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                        Already have an account? <span style={{ color: '#000000', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/login')}>Sign in</span>
                    </p>
                </div>

                {/* Right Side: Visual */}
                <div className="auth-right">
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        src={reg}
                        alt="Team Collaboration"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
