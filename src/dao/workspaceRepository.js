var { rediscli } = require('./redisDB'),
    { promisify } = require('util');

exports.createWorkspace = (workspace, user) => {
    promisify(rediscli.set).bind(rediscli)(['workspaces:' + workspace + ':owner',user]);
    promisify(rediscli.rpush).bind(rediscli)(['workspaces:' + workspace + ':users',user]);
}

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

exports.removeWorkspace = (workspaceHash) => {
    console.log(`Removing all data from workspace ${workspaceHash}`);
    removeWorkspaceKeys(workspaceHash);
    promisify(rediscli.del).bind(rediscli)('workspaces:' + workspaceHash + ':owner');
    promisify(rediscli.del).bind(rediscli)('workspaces:' + workspaceHash + ':users');
}

async function removeWorkspaceKeys(workspaceHash) {
    const keys = await promisify(rediscli.keys).bind(rediscli)('workspace:' + workspaceHash + ':*');

    keys.forEach(key => {
        console.log(`Removing ${key}`);
        promisify(rediscli.del).bind(rediscli)(key);
    });
}

exports.findUsersByWorkspaceId = (workspaceHash) => {
    return { 
        owner : promisify(rediscli.get).bind(rediscli)('workspaces:' + workspaceHash + ':owner'),
        users : promisify(rediscli.lrange).bind(rediscli)('workspaces:' + workspaceHash + ':users',0,-1)
    }
}

exports.addWorkspaceUser = (user,workspaceHash) => {
    return promisify(rediscli.rpush).bind(rediscli)(['workspaces:' + workspaceHash + ':users',user]);
}
