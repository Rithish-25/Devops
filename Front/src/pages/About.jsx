import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const About = () => {
    useEffect(() => {
        // Scroll to top when About component mounts with smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <Navbar />
            <div className="about-container">
                {/* Hero Section */}
                <section className="about-hero" style={{
                    minHeight: '60vh',
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
                            About Canon Ball Fashions
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
                            Crafting timeless elegance, one garment at a time.
                        </motion.p>
                    </div>
                </section>

                {/* Our Story Section */}
                <section style={{ padding: '5rem 0', background: 'var(--color-background)' }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}
                        >
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                marginBottom: '2rem',
                                fontFamily: "'Playfair Display', serif",
                                color: 'var(--color-primary)'
                            }}>
                                Our Story
                            </h2>
                            <div style={{ 
                                fontSize: '1.125rem', 
                                lineHeight: '1.8',
                                color: 'var(--color-text)',
                                textAlign: 'left'
                            }}>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Founded with a passion for exceptional craftsmanship and timeless design, Canon Ball Fashions has been at the forefront of premium fashion for over a decade. What started as a small boutique with a vision to redefine elegance has grown into a trusted name synonymous with quality, sophistication, and style.
                                </p>
                                <p style={{ marginBottom: '1.5rem' }}>
                                    Our journey began with a simple belief: that everyone deserves to experience the luxury of well-crafted apparel. We carefully curate each piece in our collection, working with skilled artisans and premium materials to ensure that every garment tells a story of excellence.
                                </p>
                                <p>
                                    Today, Canon Ball Fashions continues to honor our founding principles while embracing innovation and contemporary trends. We remain committed to providing our customers with not just clothing, but an experience that celebrates their unique style and confidence.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section style={{ padding: '5rem 0', background: 'white' }}>
                    <div className="container">
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '3rem',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    padding: '2.5rem',
                                    background: 'var(--color-background)',
                                    borderRadius: '1rem',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'var(--gradient-gold)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    fontSize: '2rem'
                                }}>
                                    🎯
                                </div>
                                <h3 style={{ 
                                    fontSize: '1.75rem', 
                                    marginBottom: '1rem',
                                    fontFamily: "'Playfair Display', serif",
                                    color: 'var(--color-primary)'
                                }}>
                                    Our Mission
                                </h3>
                                <p style={{ 
                                    fontSize: '1rem', 
                                    lineHeight: '1.7',
                                    color: 'var(--color-text)'
                                }}>
                                    To empower individuals to express their unique style through premium, thoughtfully designed apparel that combines timeless elegance with modern sophistication.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    padding: '2.5rem',
                                    background: 'var(--color-background)',
                                    borderRadius: '1rem',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'var(--gradient-gold)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    fontSize: '2rem'
                                }}>
                                    👁️
                                </div>
                                <h3 style={{ 
                                    fontSize: '1.75rem', 
                                    marginBottom: '1rem',
                                    fontFamily: "'Playfair Display', serif",
                                    color: 'var(--color-primary)'
                                }}>
                                    Our Vision
                                </h3>
                                <p style={{ 
                                    fontSize: '1rem', 
                                    lineHeight: '1.7',
                                    color: 'var(--color-text)'
                                }}>
                                    To become the leading destination for premium fashion, where quality craftsmanship meets innovative design, creating a legacy of style that transcends generations.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section style={{ padding: '5rem 0', background: 'var(--color-background)' }}>
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
                                Our Values
                            </h2>
                            <p style={{ 
                                color: 'var(--color-text-light)',
                                fontSize: '1.125rem'
                            }}>
                                The principles that guide everything we do
                            </p>
                        </motion.div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                            gap: '2rem',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {[
                                {
                                    icon: '✨',
                                    title: 'Quality',
                                    description: 'We never compromise on the quality of our materials and craftsmanship.'
                                },
                                {
                                    icon: '🎨',
                                    title: 'Innovation',
                                    description: 'Constantly evolving our designs to stay ahead of fashion trends.'
                                },
                                {
                                    icon: '❤️',
                                    title: 'Customer First',
                                    description: 'Your satisfaction and style journey are at the heart of everything we do.'
                                },
                                {
                                    icon: '🌱',
                                    title: 'Sustainability',
                                    description: 'Committed to ethical practices and sustainable fashion for a better future.'
                                }
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    style={{
                                        background: 'white',
                                        padding: '2rem',
                                        borderRadius: '1rem',
                                        boxShadow: 'var(--shadow-lg)',
                                        textAlign: 'center',
                                        transition: 'transform 0.3s'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '1rem'
                                    }}>
                                        {value.icon}
                                    </div>
                                    <h3 style={{ 
                                        fontSize: '1.5rem', 
                                        marginBottom: '1rem',
                                        fontFamily: "'Playfair Display', serif",
                                        color: 'var(--color-primary)'
                                    }}>
                                        {value.title}
                                    </h3>
                                    <p style={{ 
                                        color: 'var(--color-text-light)',
                                        lineHeight: '1.6'
                                    }}>
                                        {value.description}
                                    </p>
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
                                Join Our Style Journey
                            </h2>
                            <p style={{ 
                                fontSize: '1.25rem', 
                                marginBottom: '2.5rem',
                                lineHeight: '1.7',
                                opacity: 0.95
                            }}>
                                Discover our curated collection and experience the difference that premium craftsmanship makes.
                            </p>
                            <Button 
                                variant="outline" 
                                style={{ 
                                    background: 'white', 
                                    color: 'var(--color-primary)',
                                    border: '2px solid white'
                                }}
                                onClick={() => window.location.href = '/'}
                            >
                                Explore Collection
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default About;
