const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { items, totalAmount, shippingDetails, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'No items in order' });
        }

        if (!shippingDetails || !paymentMethod) {
            return res.status(400).json({ msg: 'Shipping details and payment method are required' });
        }

        // Verify stock for all items before creating order
        for (const item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ msg: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Insufficient stock for ${item.name}. Available: ${product.stock}` });
            }
        }

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
            totalAmount,
            shippingDetails,
            paymentMethod
        });

        const order = await newOrder.save();

        // Decrement stock for each item
        for (const item of items) {
            const qty = Number(item.quantity);
            console.log(`Decrementing stock for ${item.name} (${item._id}) by ${qty}`);
            const updatedProduct = await Product.findByIdAndUpdate(item._id, {
                $inc: { stock: -qty }
            }, { new: true });
            console.log(`New stock for ${item.name}: ${updatedProduct.stock}`);
        }
        res.json(order);
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log('Admin check for orders:', {
            id: req.user.id,
            found: !!user,
            email: user?.email,
            role: user?.role
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.role !== 'admin') {
            console.log('Access denied. Role is:', user.role);
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Get current user's orders
// @route   GET /api/orders/user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name image category');

        res.json(orders);
    } catch (err) {
        console.error('Error fetching user orders:', err.message);
        res.status(500).send('Server error');
    }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // If status is changing TO Cancelled from something else, restore stock
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
        }
        // If status is changing FROM Cancelled to something else, decrement stock again
        else if (order.status === 'Cancelled' && status !== 'Cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
