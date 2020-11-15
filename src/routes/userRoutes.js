var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.post('/workspace',userController.createWorkspace);

module.exports = router;
