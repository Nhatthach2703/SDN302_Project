const express = require("express");
const router = express.Router();
const authorizeRole = require('../middleware/auth').authorizeRole;

router.get('/', (req, res) => {
    authorizeRole('admin')(req, res, () => {
      res.render('pages/homeAdmin', { user: req.user || null });
    });
  });

module.exports = router;