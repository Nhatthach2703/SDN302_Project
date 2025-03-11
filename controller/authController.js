const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    const user = new User({
      username,
      password,
      name,
      email,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.session.user = { id: user._id, username, email, role: user.role };
    res.json({ token, user: req.session.user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  req.session.user = { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role };
  res.json({ token, user: req.session.user });
};

const facebookCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  req.session.user = { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role };
  res.redirect(`/auth/success?token=${token}`);
};

const success = (req, res) => {
  res.json({ token: req.query.token, user: req.session.user });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
};

module.exports = { register, login, facebookCallback, success, logout };