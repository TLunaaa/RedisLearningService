var { rediscli } = require('./redisDB'),
    { promisify } = require('util');

exports.setQuery = (workspaceHash,key,value) => {
   return promisify(rediscli.set).bind(rediscli)('workspace:' + workspaceHash + ':' + key ,value);
}

exports.getQuery = (workspaceHash, key) => {
   return promisify(rediscli.get).bind(rediscli)('workspace:' + workspaceHash + ':' + key);
}

exports.existQuery = (workspaceHash,key) => {
    return promisify(rediscli.exists).bind(rediscli)('workspace:' + workspaceHash + ':' + key);
}

exports.delQuery = (workspaceHash,key) => {
    return promisify(rediscli.del).bind(rediscli)('workspace:' + workspaceHash + ':' + key);
}


exports.getAllWorkspaceKeys = (workspaceHash) => {
    ///TODO impelement
}
