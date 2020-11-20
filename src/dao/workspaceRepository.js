var { rediscli } = require('./redisDB'),
    { promisify } = require('util');

exports.setQuery = (workspaceHash,key,value) => {
   return promisify(rediscli.set).bind(rediscli)('workspace:'+ workspaceHash + ':' + key ,value);
}

exports.getQuery = (workspaceHash, key) => {
    ///TODO implement
}

exports.getAllWorkspaceKeys = (workspaceHash) => {
    ///TODO impelement
}
