import React, { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Sync stock weights on mount to ensure user doesn't see stale stock
    useEffect(() => {
        const syncStock = async () => {
            if (cart.length === 0) return;

            try {
                const updatedCart = await Promise.all(cart.map(async (item) => {
                    try {
                        const res = await fetch(`${API_URL}/products/${item._id}`);
                        if (!res.ok) return item;
                        const liveProduct = await res.json();
                        return { ...item, stock: liveProduct.stock };
                    } catch {
                        return item;
                    }
                }));

                // Compare to avoid state update loops
                const cartStockMap = cart.map(i => i.stock).join(',');
                const updatedStockMap = updatedCart.map(i => i.stock).join(',');

                if (cartStockMap !== updatedStockMap) {
                    setCart(updatedCart);
                }
            } catch (err) {
                console.error("Cart stock sync failed:", err);
            }
        };

        syncStock();
    }, []); // Only once on mount

    const addToCart = (product, size = null) => {
        setCart(prevCart => {
            // Check if item exists with same ID AND same size
            const existingItem = prevCart.find(item =>
                item._id === product._id && item.selectedSize === size
            );

            if (existingItem) {
                return prevCart.map(item =>
                    (item._id === product._id && item.selectedSize === size)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, selectedSize: size, quantity: 1 }];
        });
    };

    const removeFromCart = (productId, size = null) => {
        setCart(prevCart => prevCart.filter(item =>
            !(item._id === productId && item.selectedSize === size)
        ));
    };

    const updateQuantity = (productId, newQuantity, size = null) => {
        if (newQuantity < 1) {
            removeFromCart(productId, size);
            return;
        }
        setCart(prevCart => prevCart.map(item =>
            (item._id === productId && item.selectedSize === size)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => {
        // Parse price: remove '₹' or commas if present
        const priceString = String(item.price).replace(/[^0-9.]/g, '');
        const price = parseFloat(priceString) || 0;
        return total + (price * item.quantity);
    }, 0);

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
