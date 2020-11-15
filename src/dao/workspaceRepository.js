var { rediscli } = require('./redisDB'),
    { promisify } = require('util');

exports.saveWorkspaceString = (workspaceHash,key,value) => {
    promisify(rediscli.set).bind(rediscli)('workspace:'+ workspaceHash + ':' + key ,value);
}

exports.getWorkspaceValue = (workspaceHash, key) => {
    ///TODO implement
}

exports.getAllWorkspaceKeys = (workspaceHash) => {
    ///TODO impelement
}
