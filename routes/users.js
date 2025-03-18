var express = require('express');
const userModel = require('../models/userModel');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', async (req, res) => {
  try {
      const userProfile = await userModel.findById(req.user.id).select('-password'); // Lấy thông tin user bỏ password
      // console.log("User:", req.user);
      res.render('users/profile', { userProfile, user: req.user || null });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
