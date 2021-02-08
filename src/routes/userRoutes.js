var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.get('/:username/counter',userController.userQueriesCounter);

router.get('/:username/history',userController.userHistory);

router.get('/:username/workspaces',userController.getWorkspaces);

router.post('/:username/workspaces',userController.createWorkspace);

router.patch('/:username/workspaces',userController.addWorkspace);

module.exports = router;
