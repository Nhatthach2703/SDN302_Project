const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryId: { 
    type: String, 
    required: [true, 'Category ID is required'], 
    unique: true,
    match: [/^[A-Z]{3,}$/, 'Category ID must be at least 3 uppercase letters (e.g., PET)']
  },
  name: { 
    type: String, 
    required: [true, 'Category name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    trim: true
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
});

categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', categorySchema);