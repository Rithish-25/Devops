import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import API_URL from '../config/api';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const headers = { 'x-auth-token': token };

                // Fetch Profile
                const profileRes = await fetch(`${API_URL}/auth/me`, { headers });
                if (!profileRes.ok) throw new Error('Failed to fetch profile');
                const profileData = await profileRes.json();
                setProfile(profileData);

                // Fetch Orders
                const ordersRes = await fetch(`${API_URL}/orders/user`, { headers });
                if (!ordersRes.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersRes.json();
                setOrders(ordersData);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered': return 'status-badge status-delivered';
            case 'Processing': return 'status-badge status-processing';
            case 'Cancelled': return 'status-badge status-cancelled';
            default: return 'status-badge status-other';
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: '100px', textAlign: 'center', color: 'red' }}>Error: {error}</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="profile-title">My Profile</h1>

                    <div className="profile-grid">
                        {/* Profile Details */}
                        <div className="profile-section-card">
                            <h2 className="section-title">Personal Information</h2>
                            <div className="info-grid">
                                <div>
                                    <label className="info-label">Name</label>
                                    <div className="info-value">{profile?.name}</div>
                                </div>
                                <div>
                                    <label className="info-label">Email</label>
                                    <div className="info-value">{profile?.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="profile-section-card">
                            <h2 className="section-title">Order History</h2>

                            {orders.length === 0 ? (
                                <p style={{ color: 'var(--color-text-light)' }}>No orders found.</p>
                            ) : (
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td className="order-id" data-label="Order ID">#{order._id.slice(-6).toUpperCase()}</td>
                                                    <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td data-label="Items">
                                                        {order.items.map(item => (
                                                            <div key={item._id} style={{ fontSize: '0.9rem' }}>
                                                                {item.quantity}x {item.name}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td data-label="Total" style={{ fontWeight: 600 }}>₹{order.totalAmount}</td>
                                                    <td data-label="Status">
                                                        <span className={getStatusClass(order.status)}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Profile;
