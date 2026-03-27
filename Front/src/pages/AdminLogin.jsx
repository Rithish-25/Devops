import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
import API_URL from '../config/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple Admin Credentials Check (Frontend)
        if (email === 'admin@gmail.com' && password === 'admin@fashion') {
            try {
                // Perform REAL login to backend to get valid token
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }) // Backend uses passwordless email login
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.msg || 'Backend login failed');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', 'admin'); // Force admin role usage since we verified creds
                setShowSuccess(true);
            } catch (err) {
                console.error(err);
                // Fallback (should not happen if backend is up)
                setError('Backend connection failed. Check server.');
            } finally {
                setLoading(false);
            }
        } else {
            // Failure
            setLoading(false);
            setError('Invalid Admin Credentials');
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/admin/add-product', { replace: true });
    };

    return (
        <>
            <Navbar />
            <SuccessModal
                isOpen={showSuccess}
                message="Admin Logged In Successfully!"
                onClose={handleSuccessClose}
            />

            <div className="auth-section" style={{
                minHeight: '100vh',
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
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
                        maxWidth: '450px',
                        padding: '3rem',
                        borderRadius: '1.5rem',
                        boxShadow: 'var(--shadow-xl)',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '0.5rem',
                            color: 'var(--color-primary)'
                        }}>
                            Admin Login
                        </h2>
                        <p style={{ color: 'var(--color-text-light)' }}>
                            Restricted Access
                        </p>
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
                                    textAlign: 'center',
                                    border: '1px solid #fecaca'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gmail.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0'
                                }}
                            />
                        </div>

                        <Button variant="primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
                            {loading ? 'Verifying...' : 'Login as Admin'}
                        </Button>
                    </form>

                    <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
                        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                            Back to User Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default AdminLogin;
