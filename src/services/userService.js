const createHash = require('hash-generator'),
    userRepository = require('../dao/userRepository'),
    workspaceRepository = require('../dao/workspaceRepository');

const MAX_QUERIES = process.env.MAX_QUERIES || 25;

exports.saveUserPassword = function(user,password){
    console.log("Saving user password");
    return userRepository.saveUserPassword(user,password);
}

exports.createUser = function(data){
    saveUserData(data);
    createWorkspace(data.user);
    console.log("LoginService - Nuevo usuario registrado");
    startQueriesCount(data.user);
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
        workspaceRepository.setQuery(workspaceHash,'hello','world')
    ]);
}

async function startQueriesCount(user){
    console.log("Initializing user queries counter");
    if(MAX_QUERIES != null){
        await userRepository.saveUserQueriesCounter(user,MAX_QUERIES);
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

exports.verifyUser = async function(username){
    let exists = await userRepository.checkKey('user:' + username + ':login');
    return exists == 1 ? true : false;
}

exports.getUserWorkspaces = async function(userId){
    return userRepository.findAllWorkspacesByUserId(userId);
}

exports.isUserWorkspace = async function(userId,workspaceId){
    let workspaces = await userRepository.findAllWorkspacesByUserId(userId);
    if(workspaces == null || workspaces.length > 1){
        throw new Error("User " + userId + " hasn't got any workspace");
    }
    return workspaces.includes(workspaceId);
}

exports.getCounter = function(userId){
    return userRepository.getUserQueriesCounter(userId);
}

exports.decreaseCounter = function(userId){

    return userRepository.decreaseUserQueriesCounter(userId)
        .then(reply => {
            if(reply < 0){
                throw new Error('No more queries left')
            }
        }) 
}

exports.shareWorkspace = function(owner, guest, workspaceData){
    //verificar que exista el workspace
    //verificar que exista el owner y el guest
    //agregar el workspace al guest
}