const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controller/authController');

router.post('/register', authController.register);
router.post('/login', passport.authenticate('local', { session: false }), authController.login);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.facebookCallback);
router.get('/success', authController.success);
router.get('/logout', authController.logout);

module.exports = router;