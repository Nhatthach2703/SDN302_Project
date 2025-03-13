const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const showLogin = (req, res) => {
  res.render('auth/login', { error: null, oldInput: {} });
};

const showRegister = (req, res) => {
  res.render('auth/register', { error: null, oldInput: {} });
};

const register = async (req, res) => {
  try {
    const { username, password, rePassword, name, email } = req.body;

    if (!password || !rePassword || !name || !email) {
      return res.render('auth/register', {
        error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        oldInput: req.body,
      });
    }

    if (password !== rePassword) {
      return res.render('auth/register', {
        error: 'Mật khẩu xác nhận không khớp',
        oldInput: req.body,
      });
    }

    const user = new User({ username, password, name, email });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/'); // Chuyển về trang chủ
  } catch (err) {
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyValue)[0];
      return res.render('auth/register', {
        error: `${duplicatedField} đã được sử dụng`,
        oldInput: req.body,
      });
    }
    if (err.errors && err.errors.name?.kind === 'required') {
      return res.render('auth/register', {
        error: 'Tên là bắt buộc',
        oldInput: req.body,
      });
    }
    res.render('auth/register', {
      error: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      oldInput: req.body,
    });
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('auth/login', { error: info.message, oldInput: req.body });
    }
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/'); // Chuyển về trang chủ
  })(req, res, next);
};

const facebookCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/'); // Chuyển về trang chủ
};

const googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/'); // Chuyển về trang chủ
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  facebookCallback,
  googleCallback,
  logout,
};