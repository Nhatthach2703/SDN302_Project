const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    trim: true
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, 'Category is required']
  },
  type: { 
    type: String, 
    enum: {
      values: ['pet', 'accessory'],
      message: 'Type must be either "pet" or "accessory"'
    }, 
    required: [true, 'Product type is required']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: { 
    type: Number, 
    required: [true, 'Stock is required'], 
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  image: { 
    type: String,
    match: [/^https?:\/\/.+$/, 'Image must be a valid URL'],
    trim: true
  },
  description: { 
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  petDetails: {
    type: {
      age: { 
        type: Number,
        min: [0, 'Age cannot be negative']
      },
      weight: { 
        type: Number,
        min: [0, 'Weight cannot be negative']
      },
      character: { 
        type: String,
        maxlength: [200, 'Character description cannot exceed 200 characters'],
        trim: true
      }
    },
    validate: {
      validator: function(v) {
        return this.type !== 'pet' || (v && v.age !== undefined && v.weight !== undefined);
      },
      message: 'Pet details (age and weight) are required for pet products'
    }
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
