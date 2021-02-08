var express = require('express');
var router = express.Router();
var userController = require('../controllers/workspaceController');

router.post('/:workspaceId/query',userController.executeQuery);

router.delete('/:workspaceId',userController.removeWorkspace)

module.exports = router;

