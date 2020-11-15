var  workspaceRepository = require('../dao/workspaceRepository');

exports.createWorkspace = (workspaceHash, key, value) => {
    return workspaceRepository.saveWorkspaceString(workspaceHash, key, value);
}