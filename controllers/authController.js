const passport = require('passport');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');
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
        error: 'Please fill in all required fields',
        oldInput: req.body,
      });
    }

    if (password !== rePassword) {
      return res.render('auth/register', {
        error: 'Password confirmation does not match',
        oldInput: req.body,
      });
    }

    const user = new User({ username, password, name, email });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyValue)[0];
      return res.render('auth/register', {
        error: `${duplicatedField} is already in use`,
        oldInput: req.body,
      });
    }
    if (err.errors && err.errors.name?.kind === 'required') {
      return res.render('auth/register', {
        error: 'Name is required',
        oldInput: req.body,
      });
    }
    res.render('auth/register', {
      error: 'Server error. Please try again later.',
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
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/');
  })(req, res, next);
};

const facebookCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/');
};

const googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/');
};

const logout = (req, res) =>  {
  res.clearCookie('token');
  res.redirect('/auth/login');
};

const nodemailer = require('nodemailer');

// Hiển thị form quên mật khẩu
const showForgotPasswordForm = (req, res) => {
  res.render('auth/forgot-password', { message: null, error: null });
};

// Xử lý khi gửi yêu cầu quên mật khẩu
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/forgot-password', {
        error: 'Email not found',
        message: null
      });
    }

    // Tạo token reset
    const token = crypto.randomBytes(20).toString('hex');

    // Gán token và thời hạn cho user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    await user.save();

    // Cấu hình nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetURL = `http://${req.headers.host}/auth/reset-password/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetURL}">here</a> to reset your password.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.render('auth/forgot-password', {
      message: 'A password reset link has been sent to your email',
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('auth/forgot-password', {
      error: 'Something went wrong. Please try again later.',
      message: null
    });
  }
};

// Hiển thị form đặt lại mật khẩu
const showResetPasswordForm = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.render('auth/reset-password', { error: 'Token is invalid or expired.', token: null });
    }

    res.render('auth/reset-password', { error: null, token });
  } catch (err) {
    console.error(err);
    res.render('auth/reset-password', { error: 'Something went wrong.', token: null });
  }
};

// Xử lý đặt lại mật khẩu
const handleResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, rePassword } = req.body;

  if (password !== rePassword) {
    return res.render('auth/reset-password', { error: 'Passwords do not match.', token });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.render('auth/reset-password', { error: 'Token is invalid or expired.', token: null });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.render('auth/reset-password', { error: 'Something went wrong.', token: null });
  }
};


module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  facebookCallback,
  googleCallback,
  logout,
  showForgotPasswordForm,
  handleForgotPassword,
  showResetPasswordForm,
  handleResetPassword,
};