var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const connectDB = require('./config/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/authRouter');
var adminRouter = require('./routes/adminRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const orderRouter = require('./routes/orderRoute')
const productRouter = require('./routes/productRoutes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const authenticateToken = require('./middleware/auth');
const cartRouter = require('./routes/cartRouter')
require('dotenv').config();

var app = express();

// Static Files & View Engine
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.engine("ejs", require("ejs").renderFile);
app.set('view cache', false);

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize()); // Chỉ cần initialize cho Passport

// Kết nối MongoDB
connectDB();

// Routes
app.use('/', authenticateToken(false), indexRouter);
app.use('/users', authenticateToken(true), usersRouter); // Bảo vệ route
app.use('/auth', authenticateToken(false), authRouter);
app.use('/categories', categoriesRouter); // Bảo vệ route
app.use('/products', productRouter); // Bảo vệ route
app.use('/orders', orderRouter);
app.use('/carts', cartRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});

module.exports = app;