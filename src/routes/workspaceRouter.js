var express = require('express');
var router = express.Router();
var userController = require('../controllers/workspaceController');

router.post('/:workspaceId/query',userController.executeQuery)

module.exports = router;

