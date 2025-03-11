const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { 
    type: String, 
    required: [true, 'User ID is required'], 
    unique: true,
    match: [/^[A-Z]{4,6}\d{3}$/, 'User ID must follow pattern: 4-6 uppercase letters followed by 3 digits (e.g., CUST001)']
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    // Note: Nên mã hóa password trong middleware trước khi lưu
  },
  role: { 
    type: String, 
    enum: {
      values: ['customer', 'admin'],
      message: 'Role must be either "customer" or "admin"'
    },
    default: 'customer'
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    lowercase: true,
    trim: true
  },
  phoneNumber: { 
    type: String,
    match: [/^(\+\d{1,3}[- ]?)?\d{9,11}$/, 'Please enter a valid phone number'],
    trim: true
  },
  address: { 
    type: String,
    maxlength: [200, 'Address cannot exceed 200 characters'],
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true // Ngăn không cho sửa đổi ngày tạo
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware để cập nhật updatedAt trước khi save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware để validate thêm nếu cần
userSchema.pre('validate', function(next) {
  // Có thể thêm validation custom ở đây
  next();
});

module.exports = mongoose.model('User', userSchema);