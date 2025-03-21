const Order = require('../models/orderModel');

const Product = require('../models/productModel');
exports.createOrder = async (req, res) => {
    try {
        const { user, items, total, paymentMethod, shippingMethod, deliveryDate } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item' });
        }

        const newOrder = new Order({
            user,
            items,
            total,
            paymentMethod,
            shippingMethod,
            deliveryDate
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { user: userId } : {};

        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkout = async (req, res) => {
    try {
        let { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).send("Danh sách sản phẩm không hợp lệ.");
        }

        // Loại bỏ khoảng trắng dư thừa
        productIds = productIds.map(id => id.trim());

        // Tìm tất cả sản phẩm theo danh sách ID
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length === 0) {
            return res.status(400).send("Không tìm thấy sản phẩm nào.");
        }

        res.render('users/order', { products, user: req.user || null });
    } catch (error) {
        console.error("Lỗi khi checkout:", error);
        res.status(500).send("Lỗi server, vui lòng thử lại.");
    }
};




exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid order status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
