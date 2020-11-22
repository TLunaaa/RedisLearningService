var workspaceRepository = require('../dao/workspaceRepository'),
    userService = require('./userService');

exports.createWorkspace = (workspaceHash, key, value) => {
    return workspaceRepository.setQuery(workspaceHash, key, value);
}

exports.executeQuery = async (workspaceId,userId,queryData) => {
    var result;
    userService.isUserWorkspace(userId,workspaceId);
    await userService.decreaseCounter(userId);
    switch (queryData.operation) {
        case "set": 
            // CREATE AND UPDATE
            result = await setKey(workspaceId,queryData.key,queryData.value);
            break;
        case "get":
            // READ
            result = await getKey(workspaceId,queryData.key);
            break;
        case "exist":
            result = await existsKey(workspaceId,queryData.key);
            break;
        case "del":
            result = await deleteKey(workspaceId,queryData.key);
            break;
    }
    return result;
}

async function setKey(workspaceId,key,value){
    if(value == null || value == ''){
        throw new Error("value field cannot be null nor empty");
    }
    return workspaceRepository.setQuery(workspaceId,key,value);
}

async function getKey(workspaceId,key){
    let value = await workspaceRepository.getQuery(workspaceId,key);
    if(value == null){
       throw new Error("Key not found");
    }
    return value;
}

async function existsKey(workspaceId,key){
    let exists = await workspaceRepository.existQuery(workspaceId,key);
    return exists == 1;
}

async function deleteKey(workspaceId,key){
    return workspaceRepository.delQuery(workspaceId,key);
}