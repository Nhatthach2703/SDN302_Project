const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  console.log('MONGO_URI:', process.env.MONGODB_URI); // Debug dòng này
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;