import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SizeChartModal = ({ isOpen, onClose, category }) => {
    // Determine which chart to show based on category
    const chartType = category ? category.toLowerCase() : 'other';

    // Size Data Templates
    const sizeData = {
        men: [
            { size: 'S', chest: 38, brandSize: 'S', shoulder: 16, length: 26, sleeve: 24.5 },
            { size: 'M', chest: 40, brandSize: 'M', shoulder: 17.5, length: 27, sleeve: 25 },
            { size: 'L', chest: 42, brandSize: 'L', shoulder: 18, length: 28, sleeve: 25.5 },
            { size: 'XL', chest: 44, brandSize: 'XL', shoulder: 19, length: 29, sleeve: 26 }
        ],
        women: [
            { size: 'S', bust: 34, brandSize: 'S', waist: 28, hip: 37, length: 24.5 },
            { size: 'M', bust: 36, brandSize: 'M', waist: 30, hip: 39, length: 25 },
            { size: 'L', bust: 38, brandSize: 'L', waist: 32, hip: 41, length: 25.5 },
            { size: 'XL', bust: 40, brandSize: 'XL', waist: 34, hip: 43, length: 26 }
        ],
        kids: [
            { size: 'S (4-5 Yrs)', chest: 24, height: '39-43"', waist: 21 },
            { size: 'M (6-7 Yrs)', chest: 26, height: '44-48"', waist: 22 },
            { size: 'L (8-9 Yrs)', chest: 28, height: '49-53"', waist: 23.5 },
            { size: 'XL (10-12 Yrs)', chest: 30, height: '54-58"', waist: 25 }
        ]
    };

    // Render logic per category
    const renderTable = () => {
        if (chartType === 'men') {
            return (
                <table className="size-chart-table">
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>Chest</th>
                            <th>Brand Size</th>
                            <th>Shoulder</th>
                            <th>Length</th>
                            <th>Sleeve Length</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizeData.men.map((row, idx) => (
                            <tr key={idx}>
                                <td><strong>{row.size}</strong></td>
                                <td>{row.chest}</td>
                                <td>{row.brandSize}</td>
                                <td>{row.shoulder}</td>
                                <td>{row.length}</td>
                                <td>{row.sleeve}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (chartType === 'women') {
            return (
                <table className="size-chart-table">
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>Bust</th>
                            <th>Brand Size</th>
                            <th>Waist</th>
                            <th>Hip</th>
                            <th>Length</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizeData.women.map((row, idx) => (
                            <tr key={idx}>
                                <td><strong>{row.size}</strong></td>
                                <td>{row.bust}</td>
                                <td>{row.brandSize}</td>
                                <td>{row.waist}</td>
                                <td>{row.hip}</td>
                                <td>{row.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (chartType === 'kids') {
            return (
                <table className="size-chart-table">
                    <thead>
                        <tr>
                            <th>Size (Age)</th>
                            <th>Chest</th>
                            <th>Height</th>
                            <th>Waist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizeData.kids.map((row, idx) => (
                            <tr key={idx}>
                                <td><strong>{row.size}</strong></td>
                                <td>{row.chest}</td>
                                <td>{row.height}</td>
                                <td>{row.waist}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            return <p style={{ textAlign: 'center', padding: '2rem' }}>Size chart not available for this category.</p>;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '2rem',
                            width: '100%',
                            maxWidth: '700px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                                Size Chart ({category || 'General'})
                            </h2>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: '#f1f5f9',
                                    color: '#64748b'
                                }}
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Note */}
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            * Measurements are given in inches.
                        </p>

                        {/* Table Container */}
                        <div style={{
                            overflowX: 'auto',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem'
                        }}>
                            <style>
                                {`
                                    .size-chart-table {
                                        width: 100%;
                                        border-collapse: collapse;
                                        text-align: center;
                                        font-size: 0.95rem;
                                    }
                                    .size-chart-table th, .size-chart-table td {
                                        padding: 1rem;
                                        border-bottom: 1px solid #e2e8f0;
                                    }
                                    .size-chart-table th {
                                        background-color: #f8fafc;
                                        font-weight: 600;
                                        color: #1e293b;
                                    }
                                    .size-chart-table tbody tr:last-child td {
                                        border-bottom: none;
                                    }
                                    .size-chart-table tbody tr:hover {
                                        background-color: #f1f5f9;
                                    }
                                `}
                            </style>
                            {renderTable()}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SizeChartModal;
