var {redis_client} = require('../dao/redisDB'),
    { promisify } = require('util'),
    createHash = require('hash-generator');

exports.createWorkspace = async function(workspaceData,user){
    console.log("Creating new workspace");
    let workspaceHash = createHash(8);
    await (redis_client.rpush).bind(redis_client)('user:' + user +':workspaces',workspaceHash);
    return workspaceHash;
}

exports.addWorkspace = async function(workSpaceData,user){
    await (redis_client.rpush).bind(redis_client)('user:' + user +':workspaces',workspaceData.workspace );
}