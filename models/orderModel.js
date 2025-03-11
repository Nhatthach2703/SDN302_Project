const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: [true, 'Product is required']
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
});

const orderSchema = new Schema({
  orderId: { 
    type: String, 
    required: [true, 'Order ID is required'], 
    unique: true,
    match: [/^ORD\d{3,}$/, 'Order ID must start with "ORD" followed by at least 3 digits (e.g., ORD001)']
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required']
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order must contain at least one item'],
    validate: [array => array.length > 0, 'Order must contain at least one item']
  },
  total: { 
    type: Number, 
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  },
  status: { 
    type: String, 
    enum: {
      values: ['pending', 'shipped', 'delivered', 'cancelled'],
      message: 'Status must be one of: pending, shipped, delivered, cancelled'
    }, 
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now, immutable: true },
  deliveryDate: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.orderDate;
      },
      message: 'Delivery date must be after order date'
    }
  },
  paymentMethod: { 
    type: String, 
    required: [true, 'Payment method is required'],
    enum: {
      values: ['cash', 'card'],
      message: 'Payment method must be either "cash" or "card"'
    }
  },
  shippingMethod: { 
    type: String, 
    required: [true, 'Shipping method is required'],
    enum: {
      values: ['standard', 'express'],
      message: 'Shipping method must be either "standard" or "express"'
    }
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);