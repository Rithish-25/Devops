import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { sendOTPEmail } from '../config/emailjs';

import API_URL from '../config/api';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Generate random 6-digit OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.name || !formData.email) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            // 1. Register User in Backend
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) {
                // If user exists, redirect to login
                if (data.msg === 'User already exists') {
                    navigate(`/login?email=${encodeURIComponent(formData.email)}`);
                    return;
                }
                throw new Error(data.msg);
            }

            // 2. Generate and Send OTP
            const otp = generateOtp();

            // Send OTP via EmailJS
            await sendOTPEmail(formData.email, formData.name, otp);

            // 3. Redirect to Login with Email and OTP (encoded/hidden state)
            // We pass OTP via state to verify it on the next screen
            navigate('/login', { state: { email: formData.email, expectedOtp: otp } });

        } catch (err) {
            console.error(err);
            setError(err.message || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-section" style={{
                minHeight: '100vh',
                background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <motion.div
                    className="glass-panel auth-panel"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '3rem',
                        borderRadius: '1.5rem',
                        boxShadow: 'var(--shadow-xl)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 className="auth-title" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Create Account</h2>
                        <p className="auth-subtitle" style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>Enter your details to get started.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    background: '#fee2e2',
                                    color: '#ef4444',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    border: '1px solid #fecaca'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSignup}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="auth-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text)', fontSize: '1rem' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="auth-form-input"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    backgroundColor: 'rgba(255,255,255,0.8)'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="auth-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text)', fontSize: '1rem' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                className="auth-form-input"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    backgroundColor: 'rgba(255,255,255,0.8)'
                                }}
                            />
                        </div>

                        <Button variant="primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
                            {loading ? 'Processing...' : 'Signup & Send OTP'}
                        </Button>

                        <div className="auth-link-text" style={{ textAlign: 'center', fontSize: '0.95rem' }}>
                            <span style={{ color: 'var(--color-text-light)' }}>Already have an account? </span>
                            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
                            <br />
                            <Link to="/admin/login" style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginTop: '1rem', display: 'inline-block' }}>Login as Admin</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default Signup;
