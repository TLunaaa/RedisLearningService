const createHash = require('hash-generator'),
    userRepository = require('../dao/userRepository'),
    workspaceRepository = require('../dao/workspaceRepository');
const { use } = require('../routes/workspaceRouter');

const MAX_QUERIES = process.env.MAX_QUERIES || 25;

const MAX_STORAGE = process.env.MAX_QUERIES || 1000;

exports.saveUserPassword = function(user,password){
    console.log("Saving user password");
    return userRepository.saveUserPassword(user,password);
}

exports.createUser = function(data){
    saveUserData(data);
    createWorkspace(data.user);
    console.log("LoginService - Nuevo usuario registrado");
    startQueriesCount(data.user);
    startQueriesStorage(data.user);
}

async function saveUserData(userData){
    console.log("Saving user data");
    userRepository.saveUserData(userData);
}

async function createWorkspace(user){
    console.log("Creating new workspace");
    let workspaceHash = createHash(8);
    await Promise.all([
        userRepository.saveUserWorkspace(user,workspaceHash),
        workspaceRepository.createWorkspace(workspaceHash,user),
        workspaceRepository.setQuery(workspaceHash,'hello','world')
    ]);
    console.log(`Workspace ${workspaceHash} created`);
    return workspaceHash;
}

exports.createWorkspace = createWorkspace;

async function startQueriesCount(user){
    console.log("Initializing user queries counter");
    if(MAX_QUERIES != null){
        await userRepository.saveUserQueriesCounter(user,MAX_QUERIES);
    }else{
        throw new Error();
    }
}

async function startQueriesStorage(user){
    console.log("Initializing user queries max storage");
    if(MAX_STORAGE != null){
        await userRepository.saveUserQueriesStorage(user,MAX_STORAGE);
    }else{
        throw new Error();
    }
}

exports.addWorkspace = async function(workSpaceData,user){
    await userRepository.saveUserWorkspace(user,workSpaceData.workspace);
}

exports.getUserData = function(user){
    return userRepository.findUserDataById(user);
}

exports.getUserPassword = function(user){
    return userRepository.findUserPasswordById(user);
}

async function verifyUser(username){
    let exists = await userRepository.checkKey('user:' + username + ':login');
    return exists == 1;
}

exports.verifyUser = verifyUser;

async function getUserWorkspaces(userId){
    return userRepository.findAllWorkspacesByUserId(userId);
}

exports.getUserWorkspaces = getUserWorkspaces;

exports.isUserWorkspace = async function(userId,workspaceId){
    let workspaces = await userRepository.findAllWorkspacesByUserId(userId);
    if(workspaces == null || workspaces.length < 1){
        throw new Error("User " + userId + " hasn't got any workspace");
    }
    return workspaces.includes(workspaceId);
}

exports.saveQuery = async function(userId,workspaceId,query,result){
    let history = {
        query: query,
        result: result,
        workspace: workspaceId
    }
    await userRepository.saveUserQuery(userId,JSON.stringify(history));
}

exports.getCounter = function(userId){
    return userRepository.getUserQueriesCounter(userId);
}

exports.decreaseCounter = async function(userId){
    const oldCount = await userRepository.getUserQueriesCounter(userId);
    if(oldCount - 1 < 0){
        throw new Error("Max queries reached");
    }
    userRepository.decreaseUserQueriesCounter(userId)

    return oldCount - 1;
}

exports.descreaseStorage = async function(user,queryData){
    const size = new TextEncoder().encode(JSON.stringify({key : queryData.key,value : queryData.value})).length
    if(await userRepository.getUserQueriesStorage(user) - size < 0){
        throw new Error("Max storage reached");
    }
    console.log(`Decreasing in ${size} user ${user} max storage`);
    userRepository.decreaseUserQueriesStorage(user,size);
}

exports.releaseStorage = async function(user,key,workspace){
    const value = await workspaceRepository.getQuery(workspace,key);
    const size = new TextEncoder().encode(JSON.stringify({key : key , value : value})).length
    console.log(`Releasing ${size} space from user ${user} storage`);
    userRepository.increaseUserQueriesStorage(user,size);
}


exports.getAllUserHistory = function(userId){
    return userRepository.getUserHistory(userId);
}

exports.getUserHistoryByWorkspaceId = async function(userId,workspaceId){
    let history = await userRepository.getUserHistory(userId);
    return history.filter((element) => {
        return JSON.parse(element).workspace == workspaceId
    });
}

exports.shareWorkspace = async function(owner, guest, workspace){
    //verificar que exista el owner y el guest
    if(!verifyUser(owner) || !verifyUser(guest)){
        console.log("Owner or guest not found");
        throw new Error("Owner or guest not found");
    }
    
    //verificar que exista el workspace
    const ownerWorkspaces = await userRepository.findAllWorkspacesByUserId(owner);
    if(!ownerWorkspaces.includes(workspace)){
        throw new Error(`The workspace ${workspace} does not belong to user ${owner}`);
    }
    //agregar el workspace al guest
    workspaceRepository.addWorkspaceUser(guest,workspace);
    await addWorkspace(guest,workspace);
    return await getUserWorkspaces(guest);
}

async function addWorkspace(user,workspace){
    console.log(`Adding workspace ${workspace} to user ${user}`);
    await userRepository.saveUserWorkspace(user,workspace);
}

exports.deleteWorkspace = async (user,workspace) => {
    const {owner,users} = workspaceRepository.findUsersByWorkspaceId(workspace);
    if(user != await owner){
        throw new Error("Only owner can delete a workspace");
    }
    (await users).forEach(wuser => {
        console.log(`Removing workspace ${workspace} from user ${wuser}`);
        userRepository.deleteWorkspaceById(wuser,workspace);
    });
    userRepository.increaseUserQueriesStorage(user,MAX_STORAGE);

}