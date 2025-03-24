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
router.get('/profile/edit', async (req, res) => {
  try {
      // Lấy thông tin user từ database, loại bỏ password
      const userProfile = await userModel.findById(req.user.id).select('-password');
      
      if (!userProfile) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Render file EJS chứa form cập nhật
      res.render('users/update', { userProfile, user: req.user });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


router.post('/profile/edit', async (req, res) => {
  try {
      console.log("Request body:", req.body);
      console.log("User ID:", req.user?.id);

      if (!req.user || !req.user.id) {
          return res.status(401).json({ msg: 'Unauthorized' });
      }

      const { name, email, phone, address } = req.body;

      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;
      if (phone) updatedFields.phone = phone;
      if (address) updatedFields.address = address;

      const updatedUser = await userModel.findByIdAndUpdate(
          req.user.id,
          { $set: updatedFields },
          { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
          return res.status(404).json({ msg: 'User not found' });
      }

      console.log("Updated user:", updatedUser);

      res.redirect('/users/profile');
  } catch (err) {
      console.error("Update error:", err);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
