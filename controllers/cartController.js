const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price image'); // Thêm 'image'

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.render('users/cart', { cart, user: req.user || null });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price;
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
