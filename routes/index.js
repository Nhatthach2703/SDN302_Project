var express = require('express');
var router = express.Router();
const inxexController = require('../controllers/indexController');
/* GET home page. */
router.get('/', inxexController.getAllProducts);



module.exports = router;
