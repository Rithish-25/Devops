const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ msg: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Error creating Razorpay order");
        }

        res.json(order);
    } catch (err) {
        console.error('Razorpay Order Error:', err.message);
        res.status(500).send('Server error');
    }
});

const Product = require('../models/Product');

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', auth, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData // The original order data to save if verification succeeds
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            
            // Verify and update stock
            const { items } = orderData;
            for (const item of items) {
                const product = await Product.findById(item._id);
                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({ msg: `Insufficient stock for ${item.name}` });
                }
            }

            // Create the actual order
            const newOrder = new Order({
                user: req.user.id,
                items: items.map(item => ({
                    product: item._id,
                    name: item.name,
                    category: item.category,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    price: item.price
                })),
                totalAmount: orderData.totalAmount,
                shippingDetails: orderData.shippingDetails,
                paymentMethod: 'GPay',
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                paid: true,
                status: 'Processing'
            });

            const savedOrder = await newOrder.save();

            // Decrement stock
            for (const item of items) {
                await Product.findByIdAndUpdate(item._id, {
                    $inc: { stock: -item.quantity }
                });
            }
            
            return res.json({ msg: "Payment verified successfully", order: savedOrder });
        } else {
            return res.status(400).json({ msg: "Invalid signature sent!" });
        }
    } catch (err) {
        console.error('Verification Error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
