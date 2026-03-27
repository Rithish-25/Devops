import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const SuccessModal = ({ isOpen, message, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(5px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        style={{
                            background: 'white',
                            padding: '2.5rem',
                            borderRadius: '1.5rem',
                            textAlign: 'center',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            maxWidth: '90%',
                            width: '400px',
                            position: 'relative'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            style={{
                                width: '80px',
                                height: '80px',
                                background: '#10B981', // Success Green
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: 'white',
                                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            <Check size={40} strokeWidth={3} />
                        </motion.div>

                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1F2937',
                                marginBottom: '0.5rem',
                                fontFamily: "'Playfair Display', serif"
                            }}
                        >
                            Success!
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                color: '#6B7280',
                                marginBottom: '2rem',
                                fontSize: '1.1rem'
                            }}
                        >
                            {message}
                        </motion.p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            style={{
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 2rem',
                                borderRadius: '9999px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
