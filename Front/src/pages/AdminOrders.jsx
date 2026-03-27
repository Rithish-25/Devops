import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    CreditCard,
    Smartphone,
    Wallet,
    ChevronDown,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Package,
    IndianRupee,
    Calendar,
    User,
    MapPin
} from 'lucide-react';
import Navbar from '../components/Navbar';
import API_URL from '../config/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.msg || 'Failed to fetch orders');

            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || 'Failed to update status');
            }

            // Refresh orders or update local state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));

        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'rgba(34, 197, 94, 0.15)'; // Green
            case 'Shipped': return 'rgba(59, 130, 246, 0.15)'; // Blue
            case 'In Progress': return 'rgba(234, 179, 8, 0.15)'; // Yellow
            case 'Processing': return 'rgba(234, 179, 8, 0.15)'; // Yellow
            case 'Pending': return 'rgba(249, 115, 22, 0.15)'; // Orange
            case 'Cancelled': return 'rgba(239, 68, 68, 0.15)'; // Red
            default: return 'rgba(148, 163, 184, 0.15)'; // Slate
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'Delivered': return '#15803d'; // Darker Green
            case 'Shipped': return '#1d4ed8'; // Darker Blue
            case 'In Progress': return '#a16207'; // Darker Yellow
            case 'Processing': return '#a16207'; // Darker Yellow
            case 'Pending': return '#c2410c'; // Darker Orange
            case 'Cancelled': return '#b91c1c'; // Darker Red
            default: return '#475569'; // Darker Slate
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#C0A062', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>Loading Orders...</div>
        </div>
    );

    if (error) return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', textAlign: 'center', color: '#fca5a5', background: '#0F172A', minHeight: '100vh' }}>Error: {error}</div>
        </>
    );

    return (
        <>
            <style>
                {`
                    .glass-card {
                        background: rgba(255, 255, 255, 1);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                        border-radius: 2rem;
                        overflow: hidden; /* Enforce clipping for curves */
                    }
                    
                    .admin-table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        color: #1e293b;
                    }

                    .admin-card-header {
                        padding: 1.5rem 2rem;
                        border-bottom: 1px solid #f1f5f9;
                        background: #fff;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 1.5rem;
                        border-radius: 2rem 2rem 0 0; /* Match parent curve */
                    }
                    
                    .admin-table th {
                        text-align: left;
                        padding: 1rem 1.5rem;
                        background: #f8fafc;
                        color: #64748B;
                        font-family: 'Inter', sans-serif;
                        font-weight: 700;
                        font-size: 0.7rem;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        border-bottom: 1px solid #e2e8f0;
                        white-space: nowrap;
                    }
                    
                    .admin-table td {
                        padding: 1.5rem 1.5rem;
                        border-bottom: 1px solid #f1f5f9;
                        vertical-align: middle;
                    }
                    
                    .admin-table tr:hover td {
                        background: #fcfdfe;
                    }

                    .filter-bar {
                        display: flex;
                        background: #F1F5F9;
                        padding: 0.35rem;
                        border-radius: 9999px;
                        gap: 0.25rem;
                        border: 1px solid #E2E8F0;
                    }

                    .filter-btn {
                        padding: 0.4rem 1rem;
                        border-radius: 9999px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        gap: 0.4rem;
                        border: none;
                        background: transparent;
                        color: #64748B;
                    }

                    .filter-btn.active {
                        background: #FFFFFF;
                        color: #0F172A;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.06);
                    }

                    .filter-btn:not(.active):hover {
                        color: #0F172A;
                        background: rgba(255,255,255,0.5);
                    }
                    
                    .status-badge-container {
                        display: inline-flex;
                        align-items: center;
                        position: relative;
                        width: 130px; /* Fixed width for better alignment */
                    }

                    .status-select {
                        appearance: none;
                        width: 100%;
                        background: transparent;
                        border: 1px solid transparent;
                        font-family: inherit;
                        font-size: 0.7rem;
                        font-weight: 700;
                        cursor: pointer;
                        padding: 0.4rem 2rem 0.4rem 0.75rem;
                        border-radius: 9999px;
                        outline: none;
                        transition: all 0.2s;
                        text-transform: uppercase;
                        letter-spacing: 0.02em;
                    }
                    
                    .status-icon {
                        position: absolute;
                        right: 0.75rem;
                        pointer-events: none;
                        color: inherit;
                    }

                    .stat-card {
                        background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        padding: 1.25rem 2rem;
                        border-radius: 1.25rem;
                        backdrop-filter: blur(10px);
                        display: flex;
                        flex-direction: column;
                        gap: 0.25rem;
                        min-width: 240px;
                        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
                    }

                    .payment-tag {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.4rem;
                        padding: 0.2rem 0.5rem;
                        border-radius: 4px;
                        font-size: 0.7rem;
                        font-weight: 700;
                        background: #F8FAF7;
                        color: #64748B;
                        border: 1px solid #E2E8F0;
                        text-transform: uppercase;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar {
                        height: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }
                `}
            </style>
            <Navbar />
            <div style={{
                paddingTop: '6rem',
                paddingBottom: '4rem',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #0F172A 0%, #0F172A 300px, #F1F5F9 300px, #F1F5F9 100%)',
                position: 'relative'
            }}>

                <div className="container" style={{ maxWidth: '1600px', width: '98%', margin: '0 auto', paddingRight: '24px', paddingLeft: '24px', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                            <div>
                                <h1 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '3rem',
                                    marginBottom: '0.5rem',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <Package size={36} color="#E5C585" />
                                    Order Management
                                </h1>
                                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Track and manage your commercial transactions</p>
                            </div>
                            <div className="stat-card">
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Revenue</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <IndianRupee size={24} color="#E5C585" />
                                    <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700' }}>
                                        {orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                    From <span style={{ color: '#E5C585' }}>{orders.length}</span> total orders
                                </div>
                            </div>
                        </div>

                        <div className="glass-card">
                            <div className="admin-card-header">
                                <div className="filter-bar">
                                    {['All', 'COD', 'GPay', 'Card'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setFilter(p)}
                                            className={`filter-btn ${filter === p ? 'active' : ''}`}
                                        >
                                            {p === 'All' && <Filter size={14} />}
                                            {p === 'COD' && <Wallet size={14} />}
                                            {p === 'GPay' && <Smartphone size={14} />}
                                            {p === 'Card' && <CreditCard size={14} />}
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        background: '#F1F5F9',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        color: '#475569'
                                    }}>
                                        {orders.filter(o => filter === 'All' || o.paymentMethod === filter).length}
                                    </span>
                                    <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '500' }}>Total Results</span>
                                </div>
                            </div>
                            <div className="custom-scrollbar">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '130px' }}>Order Info</th>
                                            <th style={{ width: '220px' }}>Customer Info</th>
                                            <th style={{ width: '250px' }}>Details</th>
                                            <th style={{ width: '120px' }}>Total</th>
                                            <th style={{ width: '160px' }}>Timeline</th>
                                            <th>Shipping Address</th>
                                            <th style={{ width: '160px' }}>Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders
                                            .filter(order => filter === 'All' || order.paymentMethod === filter)
                                            .map(order => (
                                                <tr key={order._id}>
                                                    <td style={{ verticalAlign: 'top' }}>
                                                        <div style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>#{order._id.slice(-6).toUpperCase()}</div>
                                                        <div className="payment-tag">
                                                            {order.paymentMethod === 'GPay' ? <Smartphone size={12} /> :
                                                                order.paymentMethod === 'Card' ? <CreditCard size={12} /> :
                                                                    <Wallet size={12} />}
                                                            {order.paymentMethod || 'COD'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#E5C585',
                                                                fontWeight: '700',
                                                                fontSize: '0.8rem'
                                                            }}>
                                                                {(order.user?.name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{order.user?.name || 'Unknown'}</div>
                                                                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <Search size={10} /> {order.user?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span style={{
                                                                    background: '#F1F5F9',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: '700',
                                                                    color: '#0F172A'
                                                                }}>{item.quantity}</span>
                                                                <span>{item.name}</span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                            <IndianRupee size={14} />
                                                            {order.totalAmount?.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                                                <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                                            </div>
                                                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '220px' }}>
                                                        {order.shippingDetails ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                <div style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <User size={10} /> {order.shippingDetails.name}
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                                                    <MapPin size={10} style={{ marginTop: '3px', flexShrink: 0 }} />
                                                                    <span>{order.shippingDetails.address}, {order.shippingDetails.pincode}</span>
                                                                </div>
                                                            </div>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <div className="status-badge-container">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                                className="status-select"
                                                                style={{
                                                                    backgroundColor: getStatusColor(order.status),
                                                                    color: getStatusTextColor(order.status),
                                                                    border: `1px solid ${getStatusTextColor(order.status)}30`,
                                                                }}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="In Progress">Processing</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                            <div className="status-icon" style={{ color: getStatusTextColor(order.status) }}>
                                                                <ChevronDown size={14} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                {orders.filter(o => filter === 'All' || o.paymentMethod === filter).length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '8rem 2rem', background: '#fff' }}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <Package size={64} color="#f1f5f9" style={{ marginBottom: '1.5rem' }} />
                                            <h3 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.5rem' }}>No orders found</h3>
                                            <p style={{ color: '#64748B', fontSize: '1rem' }}>We couldn't find any orders matching "<b>{filter}</b>" payment method.</p>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AdminOrders;
