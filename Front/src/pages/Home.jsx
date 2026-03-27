import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const Home = () => {
    const navigate = useNavigate();
    // Scroll to top when Home component mounts with smooth animation
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const features = [
        {
            id: 1,
            title: "Premier Cotton",
            text: "Experience the unmatched softness and breathability of our hand-picked premier cotton.",
            image: "/images/cotton.jpg"
        },
        {
            id: 2,
            title: "Luxurious Silk",
            text: "Indulge in the smooth, elegant texture of our finest silk collection.",
            image: "/images/silk.jpg"
        },
        {
            id: 3,
            title: "Versatile Polymer",
            text: "Durable and stylish polymer fabrics designed for modern versatility and comfort.",
            image: "/images/poly.jpg"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="home-container">
                {/* Hero Section */}
                <section className="hero-section" style={{
                    minHeight: '100vh',
                    width: '100%',
                    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: '2rem 0',
                    paddingTop: '6rem'
                }}>
                    <div className="container">
                        <motion.h1
                            className="hero-title"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: 700, color: 'white' }}
                        >
                            Elevate Your Style
                        </motion.h1>
                        <motion.p
                            className="hero-subtitle"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}
                        >
                            Discover the finest collection of premium apparel crafted for the modern individual.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Button
                                variant="primary"
                                style={{ background: 'white', color: 'var(--color-primary)' }}
                                onClick={() => navigate('/collections')}
                            >
                                Shop Collection
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ padding: '5rem 0', background: 'var(--color-background)' }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center', marginBottom: '4rem' }}
                        >
                            <h2 className="features-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Curated Excellence</h2>
                            <p style={{ color: 'var(--color-text-light)' }}>Quality that speaks for itself.</p>
                        </motion.div>

                        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {features.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -10 }}
                                    style={{
                                        background: 'white',
                                        padding: '2rem',
                                        borderRadius: '1rem',
                                        boxShadow: 'var(--shadow-lg)'
                                    }}
                                >
                                    <div style={{
                                        height: '200px',
                                        background: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '0.5rem',
                                        marginBottom: '1.5rem'
                                    }}></div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--color-text-light)' }}>{item.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
