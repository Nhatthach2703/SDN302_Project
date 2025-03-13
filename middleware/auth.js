const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const authenticateToken = (requireAuth = false) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;

    if (!token) {
      if (requireAuth) return res.redirect('/auth/login');
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        if (requireAuth) return res.redirect('/auth/login');
        return next();
      }
      req.user = user;
      next();
    } catch (err) {
      res.clearCookie('token');
      if (requireAuth) return res.redirect('/auth/login');
      next();
    }
  };
};


module.exports = authenticateToken;