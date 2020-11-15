var express = require('express');
var router = express.Router();

var loginController = require('../controllers/loginController');

router.post('/register',loginController.register);

router.post('/login',loginController.login);

module.exports = router;
