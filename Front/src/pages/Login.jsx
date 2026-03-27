import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
import { sendOTPEmail } from '../config/emailjs';

import API_URL from '../config/api';

const Login = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [email, setEmail] = useState('');


    const [expectedOtp, setExpectedOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Init from state if redirected from Signup
        if (location.state?.email) {
            setEmail(location.state.email);
            if (location.state.expectedOtp) {
                setExpectedOtp(location.state.expectedOtp);
                setIsOtpSent(true); // OTP assumed sent by Signup page
            }
        } else if (location.search) {
            // Handle ?email=... query param
            const params = new URLSearchParams(location.search);
            const mail = params.get('email');
            if (mail) setEmail(mail);
        }
    }, [location]);

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);




        try {
            // Check if user exists first (optional, but good UX)
            // But we can just send OTP. 



            if (!email) {
                setError('Please enter your email.');
                setLoading(false);
                return;
            }

            const newOtp = generateOtp();
            console.log('DEBUG OTP:', newOtp); // For testing purposes
            setExpectedOtp(newOtp);

            // Send OTP via EmailJS
            await sendOTPEmail(email, 'User', newOtp);

            setIsOtpSent(true);

        } catch (err) {
            console.error(err);
            setError('Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyParams = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp !== expectedOtp) {
            setError('Invalid OTP. Please try again.');
            setLoading(false);
            return;
        }

        // OTP Valid. Login to Backend.
        try {
            // We use the 'passwordless' login by sending just email
            // Backend trusts us because we verified the OTP
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg || 'Login failed.');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.user.role || 'user');
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userEmail', data.user.email);
            setShowSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            navigate('/admin/orders', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    return (
        <>
            <Navbar />
            <SuccessModal
                isOpen={showSuccess}
                message="Successfully logged in!"
                onClose={handleSuccessClose}
            />

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
                        maxWidth: '450px',
                        padding: '3rem',
                        borderRadius: '1.5rem',
                        boxShadow: 'var(--shadow-xl)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 className="auth-title" style={{
                            fontSize: '2rem',
                            marginBottom: '0.5rem',
                            color: 'var(--color-primary)'
                        }}>
                            {isOtpSent ? 'Verify OTP' : 'Login'}
                        </h2>
                        <p className="auth-subtitle" style={{
                            color: 'var(--color-text-light)',
                            fontSize: '1rem'
                        }}>
                            {isOtpSent ? 'Enter the code sent to your email.' : 'Enter your email to receive OTP'}
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
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    border: '1px solid #fecaca'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isOtpSent ? (
                        <form onSubmit={handleSendOtp}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="auth-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    fontSize: '1rem'
                                }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
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
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyParams}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="auth-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    fontSize: '1rem'
                                }}>Enter OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    id="otp"
                                    autoComplete="one-time-code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="6-digit code"
                                    maxLength="6"
                                    className="auth-form-input auth-otp-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none',
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        letterSpacing: '0.5rem',
                                        backgroundColor: 'rgba(255,255,255,0.8)'
                                    }}
                                />
                            </div>

                            <Button variant="primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </Button>
                            <div className="auth-link-text" style={{ textAlign: 'center', fontSize: '0.95rem' }}>
                                <span
                                    onClick={() => {
                                        setIsOtpSent(false);
                                        setOtp('');
                                        setExpectedOtp('');
                                    }}
                                    style={{ color: 'var(--color-text-light)', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Use different email
                                </span>
                            </div>
                        </form>
                    )}

                    {!isOtpSent && (
                        <div className="auth-link-text" style={{ textAlign: 'center', fontSize: '0.95rem' }}>
                            <span style={{ color: 'var(--color-text-light)' }}>Don't have an account? </span>
                            <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</Link>
                            <br />
                            <br />
                            <Link to="/admin/login" style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginTop: '1rem', display: 'inline-block' }}>Login as Admin</Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default Login;
