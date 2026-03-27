import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import API_URL from '../config/api';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const isLoggedIn = !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        // Update favorites count from localStorage
        const updateFavoritesCount = () => {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setFavoritesCount(favorites.length);
        };

        updateFavoritesCount();

        // Listen for storage changes (in case favorites are updated in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'favorites') {
                updateFavoritesCount();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events (for same-tab updates)
        window.addEventListener('favoritesUpdated', updateFavoritesCount);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesUpdated', updateFavoritesCount);
        };
    }, []);

    useEffect(() => {
        if (isAdmin) {
            const fetchPendingOrders = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${API_URL}/orders`, {
                        headers: { 'x-auth-token': token }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const pending = data.filter(order => order.status === 'Pending').length;
                        setPendingOrdersCount(pending);
                    }
                } catch (err) {
                    console.error("Failed to fetch pending orders count", err);
                }
            };
            fetchPendingOrders();

            // Allow other components to trigger an update
            const handleOrderUpdate = () => fetchPendingOrders();
            window.addEventListener('orderUpdated', handleOrderUpdate);
            return () => window.removeEventListener('orderUpdated', handleOrderUpdate);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        navigate('/signup');
    };

    const navbarStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        padding: isScrolled ? '1rem 0' : '1.5rem 0',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all 0.3s ease',
    };

    const shouldUseWhiteText = false; // Always use dark text for visibility on light translucent background

    const linkStyle = {
        color: shouldUseWhiteText ? 'var(--color-white)' : 'var(--color-text)',
        fontWeight: 500,
        fontSize: '0.95rem',
        cursor: 'pointer'
    };

    if (isAuthPage) return null;

    return (
        <nav className={isScrolled ? 'navbar-scrolled' : 'navbar-transparent'} style={navbarStyles}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="logo"
                    >
                        <h2 className="navbar-logo-text" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: shouldUseWhiteText ? 'var(--color-white)' : 'var(--color-primary)'
                        }}>
                            Canon Ball Fashions
                        </h2>
                    </motion.div>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

                    {!isAuthPage && (isLoggedIn ? (
                        <>
                            <Link
                                to="/"
                                style={linkStyle}
                                onClick={() => {
                                    if (location.pathname === '/') {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                            >
                                Home
                            </Link>
                            <Link
                                to="/collections"
                                style={linkStyle}
                            >
                                Collections
                            </Link>
                            <Link
                                to="/about"
                                style={linkStyle}
                            >
                                About
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link to="/admin/add-product" style={linkStyle}>
                                        Add Product
                                    </Link>

                                    <Link to="/admin/orders" style={{ ...linkStyle, display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        Orders
                                        {pendingOrdersCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-12px',
                                                background: '#ef4444',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {pendingOrdersCount}
                                            </span>
                                        )}
                                    </Link>

                                </>
                            )}
                            {!isAdmin && (
                                <>
                                    <Link to="/favorites" style={{ ...linkStyle, display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        {favoritesCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-10px',
                                                background: '#ef4444',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {favoritesCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link to="/cart" style={{ ...linkStyle, display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        {cartCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-10px',
                                                background: '#ef4444',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link to="/profile" style={{ ...linkStyle, display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }} title="My Profile">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </Link>
                                </>
                            )}
                            <span onClick={handleLogout} style={linkStyle}>Logout</span>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>Log In</Link>
                            <Link to="/signup" style={linkStyle}>Sign Up</Link>
                        </>
                    ))}

                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        flexDirection: 'column',
                        gap: '0.375rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2rem',
                        height: '2rem'
                    }}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line" style={{
                        display: 'block',
                        width: '1.5rem',
                        height: '2px',
                        backgroundColor: shouldUseWhiteText ? 'var(--color-white)' : 'var(--color-text)',
                        transition: 'all 0.3s ease',
                        transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                    }}></span>
                    <span className="hamburger-line" style={{
                        display: 'block',
                        width: '1.5rem',
                        height: '2px',
                        backgroundColor: shouldUseWhiteText ? 'var(--color-white)' : 'var(--color-text)',
                        transition: 'all 0.3s ease',
                        opacity: isMobileMenuOpen ? 0 : 1
                    }}></span>
                    <span className="hamburger-line" style={{
                        display: 'block',
                        width: '1.5rem',
                        height: '2px',
                        backgroundColor: shouldUseWhiteText ? 'var(--color-white)' : 'var(--color-text)',
                        transition: 'all 0.3s ease',
                        transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
                    }}></span>
                </button>

            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 9998,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '280px',
                            height: '100vh',
                            background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
                            zIndex: 9999,
                            padding: '2rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            overflowY: 'auto'
                        }}
                    >
                        {/* Close Button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--color-white)'
                            }}>
                                Menu
                            </h3>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '2rem',
                                    height: '2rem',
                                    borderRadius: '0.25rem',
                                    transition: 'background-color 0.2s',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                aria-label="Close menu"
                            >
                                <span style={{
                                    position: 'absolute',
                                    width: '1.25rem',
                                    height: '2px',
                                    backgroundColor: 'var(--color-white)',
                                    transform: 'rotate(45deg)',
                                    borderRadius: '1px'
                                }}></span>
                                <span style={{
                                    position: 'absolute',
                                    width: '1.25rem',
                                    height: '2px',
                                    backgroundColor: 'var(--color-white)',
                                    transform: 'rotate(-45deg)',
                                    borderRadius: '1px'
                                }}></span>
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {!isAuthPage && (isLoggedIn ? (
                                <>
                                    <Link
                                        to="/"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            if (location.pathname === '/') {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                        style={{
                                            color: 'var(--color-white)',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s, transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--color-secondary)';
                                            e.target.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-white)';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/collections"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        style={{
                                            color: 'var(--color-white)',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s, transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--color-secondary)';
                                            e.target.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-white)';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        Collections
                                    </Link>
                                    <Link
                                        to="/about"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        style={{
                                            color: 'var(--color-white)',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s, transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--color-secondary)';
                                            e.target.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-white)';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        About
                                    </Link>
                                    {isAdmin && (
                                        <>
                                            <Link
                                                to="/admin/add-product"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                style={{
                                                    color: 'var(--color-white)',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    padding: '0.75rem 0',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s, transform 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = 'var(--color-secondary)';
                                                    e.target.style.transform = 'translateX(5px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = 'var(--color-white)';
                                                    e.target.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                Add Product
                                            </Link>

                                            <Link
                                                to="/admin/orders"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                style={{
                                                    color: 'var(--color-white)',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    padding: '0.75rem 0',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s, transform 0.2s'
                                                }}
                                            >
                                                Orders
                                            </Link>

                                        </>
                                    )}
                                    {!isAdmin && (
                                        <>
                                            <Link
                                                to="/favorites"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                style={{
                                                    color: 'var(--color-white)',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    padding: '0.75rem 0',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s, transform 0.2s',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = 'var(--color-secondary)';
                                                    e.target.style.transform = 'translateX(5px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = 'var(--color-white)';
                                                    e.target.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                Favorites
                                                {favoritesCount > 0 && (
                                                    <span style={{
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {favoritesCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                to="/cart"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                style={{
                                                    color: 'var(--color-white)',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    padding: '0.75rem 0',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s, transform 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                Cart
                                                {cartCount > 0 && (
                                                    <span style={{
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                style={{
                                                    color: 'var(--color-white)',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    padding: '0.75rem 0',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s, transform 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                Profile
                                            </Link>
                                        </>
                                    )}
                                    <span
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        style={{
                                            color: 'var(--color-white)',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s, transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--color-secondary)';
                                            e.target.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-white)';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        Logout
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        style={{
                                            color: 'var(--color-white)',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s, transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--color-secondary)';
                                            e.target.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-white)';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        style={{
                                            color: 'var(--color-white)',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s, transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = 'var(--color-secondary)';
                                            e.target.style.transform = 'translateX(5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = 'var(--color-white)';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
