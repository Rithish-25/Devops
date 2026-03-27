import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    MapPin,
    User,
    Phone,
    CreditCard,
    ArrowLeft,
    Check,
    CheckCircle,
    Smartphone,
    QrCode,
    ShieldCheck,
    Hash,
    Truck,
    Wallet,
    Info
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import API_URL from '../config/api';
import SuccessModal from '../components/SuccessModal';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CheckoutStepper = ({ currentStep }) => {
    const steps = [
        { id: 'cart', label: 'Cart', icon: ShoppingBag },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'payment', label: 'Payment', icon: Wallet },
    ];

    const getStepStatus = (stepId) => {
        const order = ['cart', 'shipping', 'payment', 'gpay', 'card'];
        const currentIndex = order.indexOf(currentStep === 'gpay' || currentStep === 'card' ? 'payment' : currentStep);
        const stepIndex = order.indexOf(stepId);

        if (currentIndex > stepIndex) return 'completed';
        if (currentIndex === stepIndex) return 'active';
        return 'pending';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '4rem', gap: '1rem' }}>
            {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const StepIcon = step.icon;

                return (
                    <React.Fragment key={step.id}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: status === 'active' ? '#0F172A' : status === 'completed' ? '#16a34a' : '#f1f5f9',
                                color: status === 'pending' ? '#94a3b8' : '#fff',
                                transition: 'all 0.3s ease',
                                boxShadow: status === 'active' ? '0 10px 15px -3px rgba(15, 23, 42, 0.2)' : 'none'
                            }}>
                                {status === 'completed' ? <Check size={20} /> : <StepIcon size={20} />}
                            </div>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: status === 'active' ? 700 : 500,
                                color: status === 'active' ? '#0F172A' : '#94a3b8'
                            }}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div style={{
                                width: '60px',
                                height: '2px',
                                background: status === 'completed' ? '#16a34a' : '#e2e8f0',
                                marginBottom: '1.5rem',
                                transition: 'all 0.3s ease'
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [step, setStep] = useState('cart'); // cart, shipping, payment, gpay, card
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        phone: '',
        address: '',
        pincode: ''
    });
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');

    const validateShipping = (name, value) => {
        let error = '';
        if (name === 'name') {
            if (value.length > 0 && value.length < 3) error = 'Name must be at least 3 characters';
            else if (value.length > 0 && !/^[a-zA-Z\s]*$/.test(value)) error = 'Name can only contain letters';
        }
        if (name === 'phone') {
            if (value.length > 0) {
                if (!/^\d{10}$/.test(value)) error = 'Phone must be exactly 10 digits';
                else if (/^(\d)\1{9}$/.test(value)) error = 'Phone number cannot be all same digits';
                else if ('01234567890123456789'.includes(value) || '98765432109876543210'.includes(value)) error = 'Phone number cannot be sequential';
            }
        }
        if (name === 'pincode') {
            if (value.length > 0) {
                if (!/^\d{6}$/.test(value)) error = 'Pincode must be exactly 6 digits';
                else if (/^(\d)\1{5}$/.test(value)) error = 'Pincode cannot be all same digits';
                else if ('01234567890123456'.includes(value) || '98765432109876543'.includes(value)) error = 'Pincode cannot be sequential';
            }
        }
        if (name === 'address') {
            if (value.length > 0 && value.length < 10) error = 'Please enter a more detailed address';
        }
        return error;
    };

    const validateCard = (name, value) => {
        let error = '';
        if (name === 'number') {
            const clean = value.replace(/\s/g, '');
            if (clean.length > 0 && !/^\d{16}$/.test(clean)) error = 'Card number must be 16 digits';
        }
        if (name === 'expiry') {
            if (value.length > 0 && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) error = 'Use MM/YY format';
            else if (value.length === 5) {
                const [m, y] = value.split('/').map(Number);
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear() % 100;
                if (y < currentYear || (y === currentYear && m < currentMonth)) error = 'Card has expired';
            }
        }
        if (name === 'cvv') {
            if (value.length > 0 && !/^\d{3}$/.test(value)) error = 'CVV must be 3 digits';
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
        const error = validateShipping(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleCardInputChange = (e) => {
        let { name, value } = e.target;

        // Auto-formatting for Card Number
        if (name === 'number') {
            value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        }
        // Auto-formatting for Expiry
        if (name === 'expiry') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
            value = value.slice(0, 5);
        }
        if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardDetails(prev => ({ ...prev, [name]: value }));
        const error = validateCard(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleBuyNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to buy');
            navigate('/login');
            return;
        }
        setStep('shipping');
    };

    const submitOrder = async (method) => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: cartTotal,
                    shippingDetails,
                    paymentMethod: method || paymentMethod
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Order failed');
            }

            clearCart();
            setShowSuccess(true);
        } catch (err) {
            alert('Order failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const initiateRazorpayPayment = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);

        try {
            // 1. Create order on backend
            const res = await fetch(`${API_URL}/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ amount: cartTotal })
            });

            const order = await res.json();
            if (!res.ok) throw new Error(order.msg || 'Could not create payment order');

            // 2. Load Razorpay script
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: "CanonBall Fashions",
                description: "Purchase Payment",
                order_id: order.id,
                handler: async function (response) {
                    // 4. Verify payment on backend
                    setLoading(true);
                    try {
                        const verifyRes = await fetch(`${API_URL}/payments/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': token
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: {
                                    items: cart,
                                    totalAmount: cartTotal,
                                    shippingDetails
                                }
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            clearCart();
                            setShowSuccess(true);
                        } else {
                            alert('Payment verification failed: ' + verifyData.msg);
                        }
                    } catch (err) {
                        alert('Verification error: ' + err.message);
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: shippingDetails.name,
                    contact: shippingDetails.phone
                },
                theme: {
                    color: "#0F172A"
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Payment failed: ' + err.message);
            setLoading(false);
        }
    };

    const handlePaymentSelect = (method) => {
        setPaymentMethod(method);
        if (method === 'GPay') {
            initiateRazorpayPayment();
        } else if (method === 'Card') {
            setStep('card');
        } else {
            submitOrder(method);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/');
    };



    return (
        <>
            <Navbar />
            <SuccessModal
                isOpen={showSuccess}
                message="Order placed successfully!"
                onClose={handleSuccessClose}
            />
            <div style={{ padding: '6rem 2rem', minHeight: '100vh', background: 'var(--color-background)' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <CheckoutStepper currentStep={step} />

                        {cart.length === 0 && step === 'cart' ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <ShoppingBag size={64} color="#e5e7eb" style={{ marginBottom: '1.5rem' }} />
                                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                                    Your cart is currently empty.
                                </p>
                                <Link to="/collections">
                                    <Button variant="primary">Start Shopping</Button>
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'start' }}>
                                {/* Cart Items Step */}
                                {step === 'cart' && (
                                    <>
                                        <div style={{ flex: '1 1 500px', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                            {cart.map(item => (
                                                <div key={item._id} style={{
                                                    display: 'flex',
                                                    gap: '1.5rem',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    paddingBottom: '1.5rem',
                                                    marginBottom: '1.5rem',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '1rem' }}
                                                    />
                                                    <div style={{ flex: '1 1 min-content', minWidth: '150px' }}>
                                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.name}</h3>
                                                        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                                            {item.category}
                                                        </p>
                                                        {item.selectedSize && (
                                                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                                                <span style={{ fontWeight: 600 }}>Size:</span> {item.selectedSize}
                                                            </p>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <p style={{ fontWeight: 700, color: '#0F172A' }}>₹{item.price}</p>
                                                            {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                                                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                                    ₹{item.originalPrice}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                                            <button
                                                                onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                                                                style={{ padding: '0.5rem 1rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                                                            >
                                                                -
                                                            </button>
                                                            <span style={{ padding: '0.5rem 1rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{item.quantity}</span>
                                                            <button
                                                                onClick={() => {
                                                                    if (item.quantity < item.stock) {
                                                                        updateQuantity(item._id, item.quantity + 1, item.selectedSize);
                                                                    } else {
                                                                        alert(`Only ${item.stock} items in stock!`);
                                                                    }
                                                                }}
                                                                disabled={item.quantity >= item.stock}
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    background: '#f8fafc',
                                                                    border: 'none',
                                                                    cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                                                                    opacity: item.quantity >= item.stock ? 0.3 : 1,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item._id, item.selectedSize)}
                                                            style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', padding: '0.75rem', borderRadius: '0.75rem' }}
                                                            aria-label="Remove item"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ flex: '1 1 300px', minWidth: '280px', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '100px' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                                                Order Summary
                                            </h3>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                                <span style={{ color: '#64748b' }}>Subtotal</span>
                                                <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <span style={{ color: '#64748b' }}>Shipping</span>
                                                <span style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 600 }}>Free Delivery</span>
                                            </div>
                                            <div style={{ borderTop: '2px dashed #f1f5f9', margin: '1.5rem 0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0F172A' }}>₹{cartTotal.toLocaleString()}</span>
                                            </div>
                                            <Button variant="primary" style={{ width: '100%', padding: '1.125rem', borderRadius: '1rem', marginTop: '1rem' }} onClick={handleBuyNow}>
                                                Proceed to Checkout
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Shipping Details Step */}
                                {step === 'shipping' && (
                                    <div style={{ background: 'white', borderRadius: '2rem', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', width: '100%', margin: '0 auto' }}>
                                        <div style={{ display: 'grid', gap: '2rem' }}>
                                            {/* Name & Phone Grid */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                                <div className="input-field">
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                        <User size={16} color="#94a3b8" /> Full Name
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={shippingDetails.name}
                                                            onChange={handleInputChange}
                                                            placeholder="John Doe"
                                                            style={{
                                                                width: '100%',
                                                                padding: '1rem 1rem 1rem 1rem',
                                                                borderRadius: '1rem',
                                                                border: errors.name ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                                outline: 'none',
                                                                fontSize: '1rem',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                    {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.name}</p>}
                                                </div>
                                                <div className="input-field">
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                        <Phone size={16} color="#94a3b8" /> Phone Number
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={shippingDetails.phone}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter Phone Number"
                                                            style={{
                                                                width: '100%',
                                                                padding: '1rem',
                                                                borderRadius: '1rem',
                                                                border: errors.phone ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                                outline: 'none',
                                                                fontSize: '1rem',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                    {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.phone}</p>}
                                                </div>
                                            </div>

                                            <div className="input-field">
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                    <MapPin size={16} color="#94a3b8" /> Delivery Address
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={shippingDetails.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Flat / House no., Street, Colony"
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        borderRadius: '1rem',
                                                        border: errors.address ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                        minHeight: '120px',
                                                        outline: 'none',
                                                        fontSize: '1rem',
                                                        resize: 'none',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    required
                                                />
                                                {errors.address && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.address}</p>}
                                            </div>

                                            <div className="input-field" style={{ maxWidth: '240px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                    <Hash size={16} color="#94a3b8" /> Pincode
                                                </label>
                                                <input
                                                    type="number"
                                                    name="pincode"
                                                    onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                                                    value={shippingDetails.pincode}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Pincode"
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        borderRadius: '1rem',
                                                        border: errors.pincode ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                        outline: 'none',
                                                        fontSize: '1rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    required
                                                />
                                                {errors.pincode && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.pincode}</p>}
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', width: '100%' }}>
                                                <Button
                                                    variant="secondary"
                                                    style={{
                                                        flex: 1,
                                                        padding: '1.25rem 0.5rem',
                                                        borderRadius: '1rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.25rem',
                                                        fontSize: 'clamp(0.7rem, 2.5vw, 1rem)',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    onClick={() => setStep('cart')}
                                                >
                                                    <ArrowLeft size={16} /> Back to Cart
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    style={{
                                                        flex: 1.5,
                                                        padding: '1.25rem 0.5rem',
                                                        borderRadius: '1rem',
                                                        background: (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.pincode || Object.values(errors).some(e => e)) ? '#94a3b8' : '#0F172A',
                                                        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)',
                                                        fontSize: 'clamp(0.7rem, 2.5vw, 1rem)',
                                                        textAlign: 'center',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    disabled={
                                                        !shippingDetails.name || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.pincode ||
                                                        Object.values(errors).some(e => e)
                                                    }
                                                    onClick={() => setStep('payment')}
                                                >
                                                    Continue to Payment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Method Step */}
                                {step === 'payment' && (
                                    <div style={{ background: 'white', borderRadius: '2rem', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', width: '100%', margin: '0 auto' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '2rem', textAlign: 'center' }}>Choose Payment Method</h3>
                                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                                            <button
                                                onClick={() => handlePaymentSelect('COD')}
                                                style={{
                                                    padding: '1.5rem',
                                                    borderRadius: '1.25rem',
                                                    border: '2px solid #f1f5f9',
                                                    background: '#fff',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                    width: '100%'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0F172A'; e.currentTarget.style.background = '#f8fafc'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fff'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(15, 23, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Truck size={24} color="#0F172A" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>Cash on Delivery</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Pay when you receive the product</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0' }}></div>
                                            </button>

                                            <button
                                                onClick={() => handlePaymentSelect('Card')}
                                                style={{
                                                    padding: '1.5rem',
                                                    borderRadius: '1.25rem',
                                                    border: '2px solid #f1f5f9',
                                                    background: '#fff',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                    width: '100%'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0F172A'; e.currentTarget.style.background = '#f8fafc'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fff'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(15, 23, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CreditCard size={24} color="#0F172A" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>Credit / Debit Card</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Visa, Mastercard, RuPay</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0' }}></div>
                                            </button>

                                            <button
                                                onClick={() => handlePaymentSelect('GPay')}
                                                style={{
                                                    padding: '1.5rem',
                                                    borderRadius: '1.25rem',
                                                    border: '2px solid #f1f5f9',
                                                    background: '#fff',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                    width: '100%'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0F172A'; e.currentTarget.style.background = '#f8fafc'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fff'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(15, 23, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src="/images/gpay.jpg" style={{ height: '24px', borderRadius: '4px' }} alt="GPay" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>GPay / UPI Scanner</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Scan QR to pay automatically</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0' }}></div>
                                            </button>

                                            <Button
                                                variant="secondary"
                                                style={{ marginTop: '1.5rem', borderRadius: '1rem', padding: '1rem' }}
                                                onClick={() => setStep('shipping')}
                                            >
                                                Back to Shipping
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Card Details Step */}
                                {step === 'card' && (
                                    <div style={{ background: 'white', borderRadius: '2rem', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', maxWidth: '500px', margin: '0 auto' }}>
                                        <div style={{ display: 'grid', gap: '2rem' }}>
                                            <div className="input-field">
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                    <CreditCard size={16} color="#94a3b8" /> Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="number"
                                                    value={cardDetails.number}
                                                    onChange={handleCardInputChange}
                                                    placeholder="0000 0000 0000 0000"
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        borderRadius: '1rem',
                                                        border: errors.number ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                        outline: 'none',
                                                        fontSize: '1.1rem',
                                                        letterSpacing: '0.1em'
                                                    }}
                                                    required
                                                />
                                                {errors.number && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.number}</p>}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="input-field">
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                        <Check size={16} color="#94a3b8" /> Expiry
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        value={cardDetails.expiry}
                                                        onChange={handleCardInputChange}
                                                        placeholder="MM/YY"
                                                        style={{
                                                            width: '100%',
                                                            padding: '1rem',
                                                            borderRadius: '1rem',
                                                            border: errors.expiry ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                            outline: 'none'
                                                        }}
                                                        required
                                                    />
                                                    {errors.expiry && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.expiry}</p>}
                                                </div>
                                                <div className="input-field">
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                                        <ShieldCheck size={16} color="#94a3b8" /> CVV
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="cvv"
                                                        value={cardDetails.cvv}
                                                        onChange={handleCardInputChange}
                                                        placeholder="123"
                                                        style={{
                                                            width: '100%',
                                                            padding: '1rem',
                                                            borderRadius: '1rem',
                                                            border: errors.cvv ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                                                            outline: 'none'
                                                        }}
                                                        required
                                                    />
                                                    {errors.cvv && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={12} /> {errors.cvv}</p>}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                                                <Button
                                                    variant="primary"
                                                    style={{
                                                        padding: '1.125rem',
                                                        borderRadius: '1rem',
                                                        background: (loading || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || errors.number || errors.expiry || errors.cvv) ? '#94a3b8' : '#0F172A',
                                                        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
                                                    }}
                                                    onClick={() => submitOrder('Card')}
                                                    disabled={
                                                        loading ||
                                                        !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv ||
                                                        errors.number || errors.expiry || errors.cvv
                                                    }
                                                >
                                                    {loading ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}
                                                </Button>
                                                <Button variant="secondary" style={{ borderRadius: '1rem' }} onClick={() => setStep('payment')}>Back to Methods</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Cart;
