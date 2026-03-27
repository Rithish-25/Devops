import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Package,
    Tag,
    IndianRupee,
    Layers,
    Image as ImageIcon,
    Info,
    FileText,
    Check,
    ShoppingBag,
    Box,
    History,
    ShieldCheck,
    MapPin,
    ArrowLeft,
    Plus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import API_URL from '../config/api';

const AdminAddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        stock: '',
        description: '',
        image: '',
        features: '', // Comma separated
        fullDescription: '',
        sizes: '', // Comma separated
        colors: '', // Comma separated
        careInstructions: '',
        material: '',
        origin: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value) error = 'Product name is required';
                else if (value.length < 3) error = 'Minimum 3 characters required';
                break;
            case 'price':
                if (!value) error = 'Discount Price is required';
                else if (Number(value) <= 0) error = 'Price must be greater than 0';
                break;
            case 'originalPrice':
                if (value && Number(value) <= 0) error = 'Original Price must be greater than 0';
                break;
            case 'category':
                if (!value) error = 'Category is required';
                break;
            case 'image':
                if (!value) error = 'Image path is required';
                else if (!value.startsWith('\\images\\') && !value.startsWith('/images/')) error = 'Path must start with \\images\\';
                break;
            case 'stock':
                if (value === '') error = 'Stock is required';
                else if (Number(value) < 0) error = 'Stock cannot be negative';
                break;
            case 'description':
                if (!value) error = 'Description is required';
                else if (value.length < 10) error = 'Minimum 10 characters required';
                break;
            case 'material':
                if (!value) error = 'Material is required';
                break;
            case 'features':
                if (!value) error = 'At least one feature is required';
                break;
            case 'fullDescription':
                if (!value) error = 'Full description is required';
                else if (value.length < 20) error = 'Minimum 20 characters required';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'price' || name === 'originalPrice' || name === 'stock') {
            finalValue = value.replace(/\D/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
        const error = validateField(name, finalValue);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSizeChange = (size) => {
        setFormData(prev => {
            const currentSizes = prev.sizes ? prev.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
            const newSizes = currentSizes.includes(size)
                ? currentSizes.filter(s => s !== size)
                : [...currentSizes, size];
            return { ...prev, sizes: newSizes.join(', ') };
        });
    };

    const handleColorChange = (color) => {
        setFormData(prev => {
            const currentColors = prev.colors ? prev.colors.split(',').map(c => c.trim()).filter(c => c) : [];
            const newColors = currentColors.includes(color)
                ? currentColors.filter(c => c !== color)
                : [...currentColors, color];
            return { ...prev, colors: newColors.join(', ') };
        });
    };

    const materialCareMap = {
        'Cotton': 'Machine wash cold, tumble dry low',
        'Silk': 'Hand wash only, do not wring',
        'Polyester': 'Machine wash warm, quick dry',
        'Linen': 'Hand wash or gentle machine wash, air dry',
        'Wool': 'Dry clean recommended or hand wash cold'
    };

    const handleMaterialChange = (e) => {
        const material = e.target.value;
        const careInstructions = materialCareMap[material] || '';
        setFormData(prev => ({
            ...prev,
            material: material,
            careInstructions: careInstructions
        }));
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const res = await fetch(`${API_URL}/products/${id}`);
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        category: data.category || '',
                        price: data.price ? String(data.price) : '',
                        originalPrice: data.originalPrice ? String(data.originalPrice) : '',
                        stock: data.stock || 0,
                        description: data.description || '',
                        image: data.image || '',
                        features: data.features ? data.features.join(', ') : '',
                        fullDescription: data.fullDescription || '',
                        sizes: data.sizes ? data.sizes.join(', ') : '',
                        colors: data.colors ? data.colors.join(', ') : '',
                        careInstructions: data.careInstructions || '',
                        material: data.material || '',
                        origin: data.origin || ''
                    });
                } catch (err) {
                    console.error("Error fetching product:", err);
                    setMsg('Error loading product details.');
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMsg('Error: Please correct the fields before submitting.');
            return;
        }

        setLoading(true);
        setMsg('');

        // Image URL validation
        const imgRegex = /^\\images\\.+\.(jpg|jpeg|png|webp|avif)$/i;
        if (!imgRegex.test(formData.image)) {
            setMsg('Error: Image URL must be in format \\images\\sample.jpg');
            setLoading(false);
            return;
        }

        // Transform comma separated strings to arrays
        const payload = {
            ...formData,
            features: formData.features.split(',').map(item => item.trim()).filter(item => item),
            sizes: formData.sizes.split(',').map(item => item.trim()).filter(item => item),
            colors: formData.colors.split(',').map(item => item.trim()).filter(item => item)
        };

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `${API_URL}/products/${id}` : `${API_URL}/products`;

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-role': 'admin'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMsg(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
                if (!isEditMode) {
                    setFormData({
                        name: '',
                        category: '',
                        price: '',
                        originalPrice: '',
                        stock: '',
                        description: '',
                        image: '',
                        features: '',
                        fullDescription: '',
                        sizes: '',
                        colors: '',
                        careInstructions: '',
                        material: '',
                        origin: ''
                    });
                }
            } else {
                const errorData = await res.json().catch(() => ({}));
                setMsg(`Error: ${errorData.msg || res.statusText || 'Failed to update'}`);
            }
        } catch (err) {
            console.error(err);
            setMsg('Server error.');
        }
        setLoading(false);
    };

    return (
        <>
            <style>
                {`
                    .glass-card {
                        background: #FFFFFF;
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                        border-radius: 2rem;
                        overflow: hidden;
                    }
                    
                    .admin-input-group {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .admin-input {
                        width: 100%;
                        padding: 0.875rem 1rem 0.875rem 2.75rem;
                        border-radius: 1rem;
                        border: 1.5px solid #e2e8f0;
                        background: #f8fafc;
                        color: #0f172a;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: 'Inter', sans-serif;
                        font-size: 0.95rem;
                    }
                    
                    .admin-input:focus {
                        outline: none;
                        border-color: #0F172A;
                        background: #ffffff;
                        box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
                    }
                    
                    .input-icon {
                        position: absolute;
                        left: 1rem;
                        top: 2.65rem;
                        color: #94a3b8;
                        transition: color 0.2s;
                    }
                    
                    .admin-input-group:focus-within .input-icon {
                        color: #0F172A;
                    }
                    
                    .admin-label {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-weight: 700;
                        font-size: 0.75rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #64748b;
                        margin-left: 0.5rem;
                    }

                    .checkbox-label {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.6rem 1rem;
                        background: #f8fafc;
                        border: 1.5px solid #e2e8f0;
                        border-radius: 1rem;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-weight: 600;
                        font-size: 0.9rem;
                        color: #475569;
                        min-width: 60px;
                        justify-content: center;
                    }

                    .checkbox-label:hover {
                        border-color: #cbd5e1;
                        background: #f1f5f9;
                    }

                    .checkbox-label.active {
                        background: #0F172A;
                        border-color: #0F172A;
                        color: #FFFFFF;
                    }

                    .checkbox-label input {
                        display: none;
                    }
                    
                    .admin-select {
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                        background-position: right 1rem center;
                        background-repeat: no-repeat;
                        background-size: 1.25em 1.25em;
                        padding-right: 3rem;
                    }
                `}
            </style>
            <Navbar />
            <div style={{
                paddingTop: '6rem',
                paddingBottom: '6rem',
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #0F172A 0%, #0F172A 400px, #F1F5F9 400px, #F1F5F9 100%)',
                position: 'relative'
            }}>
                <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(229, 197, 133, 0.1)',
                                borderRadius: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                border: '1px solid rgba(229, 197, 133, 0.2)'
                            }}>
                                <Plus size={32} color="#E5C585" />
                            </div>
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '3rem',
                                marginBottom: '0.75rem',
                                color: '#FFFFFF',
                                textAlign: 'center'
                            }}>
                                {isEditMode ? 'Edit Product' : 'Add New Product'}
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem', textAlign: 'center' }}>
                                {isEditMode ? 'Update existing product details' : 'Create a new addition to the collection'}
                            </p>
                        </div>

                        {msg && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    padding: '1.25rem 2rem',
                                    background: msg.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                    color: msg.includes('Error') ? '#ef4444' : '#22c55e',
                                    borderRadius: '1.5rem',
                                    marginBottom: '2.5rem',
                                    textAlign: 'center',
                                    border: `1px solid ${msg.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}>
                                {msg.includes('Error') ? <Info size={18} /> : <ShieldCheck size={18} />}
                                {msg}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '4rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                {/* Left Side */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '-0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Package size={20} color="#E5C585" /> Basic Information
                                    </h3>

                                    <div className="admin-input-group">
                                        <label className="admin-label">Product Name</label>
                                        <ImageIcon size={18} className="input-icon" />
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="admin-input"
                                            style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                                            placeholder="e.g. Classic Silk Saree"
                                        />
                                        {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.name}</p>}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Category</label>
                                            <Layers size={18} className="input-icon" />
                                            <select
                                                required
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="admin-input admin-select"
                                                style={{ borderColor: errors.category ? '#ef4444' : undefined }}
                                            >
                                                <option value="">Select</option>
                                                <option value="Men">Men</option>
                                                <option value="Women">Women</option>
                                                <option value="Kids">Kids</option>
                                            </select>
                                            {errors.category && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.category}</p>}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'flex-end' }}>
                                        <div className="admin-input-group" style={{ position: 'static' }}>
                                            <label className="admin-label">Original Price (₹)</label>
                                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                                <IndianRupee size={18} className="input-icon" style={{ top: '50%', transform: 'translateY(-50%)' }} />
                                                <input
                                                    name="originalPrice"
                                                    value={formData.originalPrice}
                                                    onChange={handleChange}
                                                    className="admin-input"
                                                    style={{ borderColor: errors.originalPrice ? '#ef4444' : undefined }}
                                                    placeholder="1999"
                                                />
                                            </div>
                                            {errors.originalPrice && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.originalPrice}</p>}
                                        </div>
                                        <div className="admin-input-group" style={{ position: 'static' }}>
                                            <label className="admin-label">Discount Price (Selling Price ₹)</label>
                                            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                                <IndianRupee size={18} className="input-icon" style={{ top: '50%', transform: 'translateY(-50%)' }} />
                                                <input
                                                    required
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    className="admin-input"
                                                    style={{ borderColor: errors.price ? '#ef4444' : undefined }}
                                                    placeholder="999"
                                                />
                                            </div>
                                            {errors.price && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.price}</p>}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Stock</label>
                                            <Box size={18} className="input-icon" />
                                            <input
                                                required
                                                name="stock"
                                                type="number"
                                                min="0"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                className="admin-input"
                                                style={{ borderColor: errors.stock ? '#ef4444' : undefined }}
                                                placeholder="0"
                                            />
                                            {errors.stock && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.stock}</p>}
                                        </div>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Image URL</label>
                                            <ImageIcon size={18} className="input-icon" />
                                            <input
                                                required
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="admin-input"
                                                style={{ borderColor: errors.image ? '#ef4444' : undefined }}
                                                placeholder="\images\sample.jpg"
                                            />
                                            {errors.image && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.image}</p>}
                                        </div>
                                    </div>

                                        <div className="admin-input-group">
                                            <label className="admin-label">Features (comma separated)</label>
                                            <Tag size={18} className="input-icon" />
                                            <input
                                                required
                                                name="features"
                                                value={formData.features}
                                                onChange={handleChange}
                                                className="admin-input"
                                                style={{ borderColor: errors.features ? '#ef4444' : undefined }}
                                                placeholder="Premium Fabric, Handcrafted"
                                            />
                                            {errors.features && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.features}</p>}
                                        </div>
                                    </div>

                                {/* Right Side */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '-0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <FileText size={20} color="#E5C585" /> Specifications
                                    </h3>

                                    <div className="admin-input-group">
                                        <label className="admin-label">Short Description</label>
                                        <FileText size={18} className="input-icon" style={{ top: '2.65rem' }} />
                                        <textarea
                                            required
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="admin-input"
                                            style={{ height: '84px', resize: 'none', paddingLeft: '2.75rem', borderColor: errors.description ? '#ef4444' : undefined }}
                                            placeholder="Brief summary for listings..."
                                        />
                                        {errors.description && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.description}</p>}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Material</label>
                                            <ShoppingBag size={18} className="input-icon" />
                                            <select
                                                name="material"
                                                value={formData.material}
                                                onChange={handleMaterialChange}
                                                className="admin-input admin-select"
                                                style={{ borderColor: errors.material ? '#ef4444' : undefined }}
                                            >
                                                <option value="">Select</option>
                                                {['Cotton', 'Silk', 'Polyester', 'Linen', 'Wool'].map((mat) => (
                                                    <option key={mat} value={mat}>{mat}</option>
                                                ))}
                                            </select>
                                            {errors.material && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.material}</p>}
                                        </div>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Origin</label>
                                            <MapPin size={18} className="input-icon" />
                                            <select
                                                name="origin"
                                                value={formData.origin}
                                                onChange={handleChange}
                                                className="admin-input admin-select"
                                                style={{ borderColor: errors.origin ? '#ef4444' : undefined }}
                                            >
                                                <option value="">Select Origin</option>
                                                <optgroup label="India">
                                                    <option value="India, Tamil Nadu">Tamil Nadu</option>
                                                    <option value="India, Gujarat">Gujarat</option>
                                                    <option value="India, Maharashtra">Maharashtra</option>
                                                    <option value="India, Rajasthan">Rajasthan</option>
                                                    <option value="India, West Bengal">West Bengal</option>
                                                </optgroup>
                                                <optgroup label="America">
                                                    <option value="America, California">California</option>
                                                    <option value="America, New York">New York</option>
                                                    <option value="America, Texas">Texas</option>
                                                    <option value="America, North Carolina">North Carolina</option>
                                                    <option value="America, Georgia">Georgia</option>
                                                </optgroup>
                                                <optgroup label="London">
                                                    <option value="London, East London">East London</option>
                                                    <option value="London, West End">West End</option>
                                                    <option value="London, Camden">Camden</option>
                                                    <option value="London, Islington">Islington</option>
                                                    <option value="London, Hackney">Hackney</option>
                                                </optgroup>
                                            </select>
                                            {errors.origin && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.origin}</p>}
                                        </div>
                                    </div>

                                    <div className="admin-input-group">
                                        <label className="admin-label">Care Instructions</label>
                                        <History size={18} className="input-icon" />
                                        <input
                                            name="careInstructions"
                                            value={formData.careInstructions}
                                            readOnly
                                            className="admin-input"
                                            style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#0f172a' }}
                                            placeholder="Auto-populated from material..."
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Sizes</label>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                {['S', 'M', 'L', 'XL'].map((size) => (
                                                    <label key={size} className={`checkbox-label ${formData.sizes.split(',').map(s => s.trim()).includes(size) ? 'active' : ''}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.sizes.split(',').map(s => s.trim()).includes(size)}
                                                            onChange={() => handleSizeChange(size)}
                                                        />
                                                        {size}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="admin-input-group">
                                            <label className="admin-label">Colors</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {['Red', 'Blue', 'Gold', 'Black', 'White'].map((color) => (
                                                    <label key={color} className={`checkbox-label ${formData.colors.split(',').map(c => c.trim()).includes(color) ? 'active' : ''}`} style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', minWidth: '60px' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.colors.split(',').map(c => c.trim()).includes(color)}
                                                            onChange={() => handleColorChange(color)}
                                                        />
                                                        {color}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-input-group" style={{ marginTop: '2.5rem' }}>
                                <label className="admin-label">Full Product Description</label>
                                <FileText size={18} className="input-icon" style={{ top: '2.65rem' }} />
                                <textarea
                                    required
                                    name="fullDescription"
                                    value={formData.fullDescription}
                                    onChange={handleChange}
                                    className="admin-input"
                                    style={{ height: '140px', resize: 'none', paddingLeft: '2.75rem', borderColor: errors.fullDescription ? '#ef4444' : undefined }}
                                    placeholder="Detailed product information for customers..."
                                />
                                {errors.fullDescription && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', marginLeft: '0.5rem' }}>{errors.fullDescription}</p>}
                            </div>

                            <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    style={{
                                        flex: 1,
                                        padding: '1.125rem',
                                        background: '#fff',
                                        border: '1.5px solid #e2e8f0',
                                        borderRadius: '1.25rem',
                                        color: '#475569',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    <ArrowLeft size={18} /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || Object.values(errors).some(e => e) || !formData.name || !formData.price}
                                    style={{
                                        flex: 2,
                                        padding: '1.125rem',
                                        background: (loading || Object.values(errors).some(e => e) || !formData.name || !formData.price) ? '#94a3b8' : '#0F172A',
                                        border: 'none',
                                        borderRadius: '1.25rem',
                                        color: '#FFFFFF',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        cursor: (loading || Object.values(errors).some(e => e) || !formData.name || !formData.price) ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!e.currentTarget.disabled) {
                                            e.currentTarget.style.background = '#1e293b';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!e.currentTarget.disabled) {
                                            e.currentTarget.style.background = '#0F172A';
                                            e.currentTarget.style.transform = 'none';
                                        }
                                    }}
                                >
                                    {loading ? (isEditMode ? <History size={20} className="animate-spin" /> : <Plus size={20} />) : (isEditMode ? <Check size={20} /> : <Plus size={20} />)}
                                    {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
            <footer style={{ padding: '3rem', textAlign: 'center', background: '#F1F5F9', color: '#94a3b8', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Canon Ball Fashions Admin. All rights reserved.
            </footer>
        </>
    );
};

export default AdminAddProduct;
