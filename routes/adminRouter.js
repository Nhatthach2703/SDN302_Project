const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/homeAdmin', { user: req.user || null });
  });

  module.exports = router;