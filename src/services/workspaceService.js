var workspaceRepository = require('../dao/workspaceRepository'),
    userService = require('./userService');

exports.createWorkspace = (workspaceHash, key, value) => {
    return workspaceRepository.setQuery(workspaceHash, key, value);
}

exports.executeQuery = async (workspaceId,userId,queryData) => {
    var result;
    switch (queryData.operation) {
        case "set": 
            result = await workspaceRepository.setQuery(workspaceId,queryData.key,queryData.value);
        case "get":
            break;
        case "exists":
            break;
        case "del":
            break;
    }
    userService.decreaseCounter(userId);
    return result;
}