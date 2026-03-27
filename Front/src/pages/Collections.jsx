import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import API_URL from '../config/api';

const Collections = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || '';

    const handleProductClick = (productId) => {
        navigate(`/collections/${productId}`);
    };

    const [costumes, setCostumes] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [selectedCategory, setSelectedCategory] = useState(''); // Removed local state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCostumes, setFilteredCostumes] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Load favorites from localStorage on component mount
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    // Fetch products when selectedCategory changes (from URL)
    useEffect(() => {
        const fetchProducts = async () => {
            setCostumes([]);
            setFilteredCostumes([]);

            if (selectedCategory) {
                setLoading(true);
                try {
                    const res = await fetch(`${API_URL}/products?category=${selectedCategory}`);
                    const data = await res.json();
                    setCostumes(data);
                    setFilteredCostumes(data);
                } catch (err) {
                    console.error('Error fetching products:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Reset if no category selected
                setCostumes([]);
                setFilteredCostumes([]);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSearchParams(category ? { category } : {});
        // State update will trigger via useEffect
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);

        if (searchValue.trim() === '') {
            setFilteredCostumes(costumes);
        } else {
            const filtered = costumes.filter(costume =>
                costume.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                costume.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                costume.features.some(feature => feature.toLowerCase().includes(searchValue.toLowerCase()))
            );
            setFilteredCostumes(filtered);
        }
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];

            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify(newFavorites));

            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('favoritesUpdated'));

            return newFavorites;
        });
    };

    const handleImageError = (e) => {
        // Fallback to a colored placeholder if image fails to load
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
            <div className="collections-container">
                {/* Hero Section */}
                <section className="collections-hero" style={{
                    minHeight: '50vh',
                    width: '100%',
                    background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: '6rem 2rem 4rem',
                }}>
                    <div className="container">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                fontSize: '4rem',
                                marginBottom: '1rem',
                                fontWeight: 700,
                                color: 'white',
                                fontFamily: "'Playfair Display', serif"
                            }}
                        >
                            Our Collections
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            style={{
                                fontSize: '1.25rem',
                                maxWidth: '700px',
                                margin: '0 auto',
                                lineHeight: '1.6'
                            }}
                        >
                            Discover our curated selection of premium costumes and apparel
                        </motion.p>
                    </div>
                </section>

                {/* Collections Grid */}
                <section id="collections" style={{ padding: '5rem 0', background: 'var(--color-background)' }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ textAlign: 'center', marginBottom: '4rem' }}
                        >
                            <h2 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem',
                                fontFamily: "'Playfair Display', serif",
                                color: 'var(--color-primary)'
                            }}>
                                {selectedCategory ? `${selectedCategory}'s Collection` : 'Select a Category'}
                            </h2>
                            <p style={{
                                color: 'var(--color-text-light)',
                                fontSize: '1.125rem',
                                marginBottom: '2rem'
                            }}>
                                {selectedCategory ? 'Handpicked selection of the finest apparel' : 'Please select a category to view our exclusive collection'}
                            </p>

                            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', display: 'inline-block', zIndex: 50 }}>
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        style={{
                                            width: '280px',
                                            padding: '1rem 1.5rem',
                                            fontSize: '1.1rem',
                                            fontFamily: "'Playfair Display', serif",
                                            borderRadius: '50px',
                                            border: `2px solid ${isDropdownOpen ? '#a0aec0' : '#e2e8f0'}`,
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            color: '#1a202c',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span>{selectedCategory ? `${selectedCategory}'s Collection` : '✨ Select Collection'}</span>
                                        <motion.div
                                            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ color: '#718096' }}
                                        >
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </motion.div>
                                    </div>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <>
                                                <div
                                                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '120%',
                                                        left: 0,
                                                        width: '100%',
                                                        backgroundColor: 'white',
                                                        borderRadius: '1.5rem',
                                                        padding: '0.5rem',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                                        border: '1px solid #e2e8f0',
                                                        zIndex: 50,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {['Men', 'Women', 'Kids'].map((item) => (
                                                        <div
                                                            key={item}
                                                            onClick={() => {
                                                                handleCategoryChange({ target: { value: item } });
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            style={{
                                                                padding: '0.75rem 1.5rem',
                                                                cursor: 'pointer',
                                                                borderRadius: '1rem',
                                                                transition: 'all 0.2s',
                                                                color: selectedCategory === item ? 'white' : '#4a5568',
                                                                backgroundColor: selectedCategory === item ? 'var(--color-primary)' : 'transparent',
                                                                fontWeight: selectedCategory === item ? '600' : '500',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (selectedCategory !== item) e.target.style.backgroundColor = '#f7fafc';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (selectedCategory !== item) e.target.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            {item}'s Collection
                                                            {selectedCategory === item && <span>✓</span>}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {selectedCategory && (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            style={{
                                                width: '300px',
                                                padding: '1rem 1.5rem 1rem 3rem',
                                                fontSize: '1rem',
                                                fontFamily: "'Playfair Display', serif",
                                                borderRadius: '50px',
                                                border: '2px solid #e2e8f0',
                                                backgroundColor: 'white',
                                                color: '#1a202c',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#a0aec0'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#718096',
                                            fontSize: '1.2rem'
                                        }}>
                                            🔍
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '2.5rem',
                            maxWidth: '1400px',
                            margin: '0 auto'
                        }}>
                            {loading ?
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1' }}>Loading products...</p> :
                                !selectedCategory ?
                                    <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1', opacity: 0 }}></p> :
                                    filteredCostumes.length === 0 ?
                                        <p style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1' }}>
                                            {searchTerm ? 'No products found matching your search.' : 'No products found in this category.'}
                                        </p> :
                                        filteredCostumes.map((costume, index) => (
                                            <motion.div
                                                key={costume._id}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                                whileHover={{ y: -10, scale: 1.02 }}
                                                onClick={() => handleProductClick(costume._id)}
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
                                                        src={costume.image}
                                                        alt={costume.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s ease, opacity 0.3s ease',
                                                            display: 'block',
                                                            backgroundColor: '#e2e8f0'
                                                        }}
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', costume.name, costume.image);
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
                                                        {costume.category}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavorite(costume._id);
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
                                                        {favorites.includes(costume._id) ? '❤️' : '🤍'}
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div style={{ padding: '1.5rem' }}>
                                                    <h3 style={{
                                                        fontSize: '1.4rem',
                                                        fontWeight: 900,
                                                        fontFamily: "'Playfair Display', serif",
                                                        margin: '0 0 0.25rem 0',
                                                        color: '#000000',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        minHeight: '2.8rem'
                                                    }}>
                                                        {costume.name}
                                                    </h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
                                                            {costume.rating ? costume.rating.toFixed(1) : '0.0'} ({costume.numReviews || 0} reviews)
                                                        </span>
                                                    </div>

                                                    <p style={{
                                                        color: 'var(--color-text-light)',
                                                        fontSize: '0.95rem',
                                                        lineHeight: '1.6',
                                                        marginBottom: '1rem',
                                                        minHeight: '3rem',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {costume.description}
                                                    </p>

                                                    {/* Features */}
                                                    <div style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: '0.5rem',
                                                        marginBottom: '1rem'
                                                    }}>
                                                        {costume.features.map((feature, idx) => (
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

                                                    {/* Price */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginTop: '1rem',
                                                        paddingTop: '1rem',
                                                        borderTop: '1px solid #e2e8f0'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                                                                    ₹{costume.price}
                                                                </span>
                                                                {costume.originalPrice && Number(costume.originalPrice) > Number(costume.price) && (
                                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                                        ₹{costume.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {costume.originalPrice && Number(costume.originalPrice) > Number(costume.price) && (
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                                                                    {Math.round(((Number(costume.originalPrice) - Number(costume.price)) / Number(costume.originalPrice)) * 100)}% OFF
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleProductClick(costume._id);
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
                                        ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section style={{
                    padding: '5rem 0',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ maxWidth: '700px', margin: '0 auto' }}
                        >
                            <h2 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1.5rem',
                                fontFamily: "'Playfair Display', serif",
                                color: 'white'
                            }}>
                                Can't Find What You're Looking For?
                            </h2>
                            <p style={{
                                fontSize: '1.25rem',
                                marginBottom: '2.5rem',
                                lineHeight: '1.7',
                                opacity: 0.95
                            }}>
                                Contact us for custom orders and personalized styling consultations.
                            </p>
                            <Button
                                variant="outline"
                                style={{
                                    background: 'white',
                                    color: 'var(--color-primary)',
                                    border: '2px solid white'
                                }}
                            >
                                Contact Us
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Collections;
