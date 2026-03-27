import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import API_URL from '../config/api';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);

        if (storedFavorites.length > 0) {
            fetchFavoriteProducts(storedFavorites);
        }
    }, []);

    const fetchFavoriteProducts = async (favoriteIds) => {
        setLoading(true);
        try {
            // Fetch products that are in favorites
            const promises = favoriteIds.map(id =>
                fetch(`${API_URL}/products/${id}`).then(res => res.json())
            );
            const products = await Promise.all(promises);
            setFavoriteProducts(products.filter(product => product._id)); // Filter out any failed requests
        } catch (err) {
            console.error('Error fetching favorite products:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (productId) => {
        const newFavorites = favorites.filter(id => id !== productId);
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setFavoriteProducts(prev => prev.filter(product => product._id !== productId));
    };

    const handleProductClick = (productId) => {
        window.location.href = `/collections/${productId}`;
    };

    const handleImageError = (e) => {
        const parent = e.target.parentElement;
        if (parent) {
            parent.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%);
                    color: #64748B;
                    font-size: 1rem;
                    font-weight: 500;
                    text-align: center;
                    padding: 2rem;
                ">
                    <div>
                        <div style="font-size: 3rem; margin-bottom: 0.5rem;">👔</div>
                        <div>${e.target.alt}</div>
                    </div>
                </div>
            `;
        }
    };

    return (
        <>
            <Navbar />
            <div className="favorites-container">
                {/* Hero Section */}
                <section className="favorites-hero" style={{
                    minHeight: '40vh',
                    width: '100%',
                    background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: '4rem 2rem 3rem',
                }}>
                    <div className="container">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                fontSize: '3.5rem',
                                marginBottom: '1rem',
                                fontWeight: 700,
                                color: 'white',
                                fontFamily: "'Playfair Display', serif"
                            }}
                        >
                            My Favorites
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            style={{
                                fontSize: '1.25rem',
                                maxWidth: '600px',
                                margin: '0 auto',
                                lineHeight: '1.6'
                            }}
                        >
                            Your personally curated collection of loved items
                        </motion.p>
                    </div>
                </section>

                {/* Favorites Grid */}
                <section style={{ padding: '4rem 0', background: 'var(--color-background)' }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ textAlign: 'center', marginBottom: '3rem' }}
                        >
                            <h2 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem',
                                fontFamily: "'Playfair Display', serif",
                                color: 'var(--color-primary)'
                            }}>
                                {favoriteProducts.length > 0 ? `Your Favorites (${favoriteProducts.length})` : 'No Favorites Yet'}
                            </h2>
                            <p style={{
                                color: 'var(--color-text-light)',
                                fontSize: '1.125rem',
                                marginBottom: '2rem'
                            }}>
                                {favoriteProducts.length > 0
                                    ? 'Items you\'ve saved for later'
                                    : 'Start adding items to your favorites to see them here'}
                            </p>

                            {favoriteProducts.length === 0 && (
                                <Button
                                    variant="primary"
                                    onClick={() => window.location.href = '/collections'}
                                    style={{
                                        padding: '1rem 2rem',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Browse Collections
                                </Button>
                            )}
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '2.5rem',
                            maxWidth: '1400px',
                            margin: '0 auto'
                        }}>
                            {loading ? (
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1' }}>Loading your favorites...</p>
                            ) : favoriteProducts.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    gridColumn: '1/-1',
                                    padding: '4rem 2rem'
                                }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤍</div>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--color-primary)',
                                        marginBottom: '1rem',
                                        fontFamily: "'Playfair Display', serif"
                                    }}>
                                        No favorite items yet
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-text-light)',
                                        marginBottom: '2rem'
                                    }}>
                                        Start exploring our collections and add items you love to your favorites!
                                    </p>
                                </div>
                            ) : (
                                favoriteProducts.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        onClick={() => handleProductClick(product._id)}
                                        style={{
                                            background: 'white',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            boxShadow: 'var(--shadow-lg)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {/* Image */}
                                        <div style={{
                                            width: '100%',
                                            height: '300px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            backgroundColor: '#e2e8f0'
                                        }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                                                    display: 'block',
                                                    backgroundColor: '#e2e8f0'
                                                }}
                                                onError={(e) => {
                                                    console.error('Image failed to load:', product.name, product.image);
                                                    handleImageError(e);
                                                }}
                                                onLoad={(e) => {
                                                    e.target.style.opacity = '1';
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (e.target.complete && e.target.naturalHeight !== 0) {
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                color: 'var(--color-primary)',
                                                zIndex: 10
                                            }}>
                                                {product.category}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(product._id);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '1rem',
                                                    left: '1rem',
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    transition: 'all 0.3s ease',
                                                    zIndex: 10,
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'scale(1.1)';
                                                    e.target.style.background = 'rgba(255, 255, 255, 1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                                }}
                                            >
                                                ❤️
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{
                                                fontSize: '1.5rem',
                                                marginBottom: '0.5rem',
                                                fontFamily: "'Playfair Display', serif",
                                                color: 'var(--color-primary)'
                                            }}>
                                                {product.name}
                                            </h3>
                                            <p style={{
                                                color: 'var(--color-text-light)',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.6',
                                                marginBottom: '1rem',
                                                minHeight: '3rem'
                                            }}>
                                                {product.description}
                                            </p>

                                            {/* Features */}
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '0.5rem',
                                                marginBottom: '1rem'
                                            }}>
                                                {product.features && product.features.map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            background: 'var(--color-background)',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--color-text)',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Price and Button */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: '1rem',
                                                paddingTop: '1rem',
                                                borderTop: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
                                                        ₹{product.price}
                                                    </span>
                                                    {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                                        <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                            ₹{product.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProductClick(product._id);
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1.5rem',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Favorites;
