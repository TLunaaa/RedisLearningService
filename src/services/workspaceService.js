var workspaceRepository = require('../dao/workspaceRepository'),
    userService = require('./userService');

exports.createWorkspace = (user,workspaceHash, key, value) => {
    workspaceRepository.createWorkspace(workspaceHash,user);
    return workspaceRepository.setQuery(workspaceHash, key, value);
}

exports.deleteWorkspace = async (workspaceHash,user) => { 
    await userService.deleteWorkspace(user,workspaceHash);
    workspaceRepository.removeWorkspace(workspaceHash);
}

exports.executeQuery = async (workspaceId,userId,queryData) => {
    var result;
    if(!userService.isUserWorkspace(userId,workspaceId)){
        throw new Error("This user is not allowed to query in this workspace");
    }
    await userService.decreaseCounter(userId);
    switch (queryData.operation) {
        case "set": 
            // CREATE AND UPDATE
            result = await setKey(workspaceId,queryData.key,queryData.value);
            await userService.descreaseStorage(userId,queryData)
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
            await userService.releaseStorage(userId,queryData.key,workspaceId);
            break;
    }
    await userService.saveQuery(userId,workspaceId,
        queryData.operation + " " + queryData.key + " " + queryData.value,
        result)
    return result ;
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