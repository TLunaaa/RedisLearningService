const createHash = require('hash-generator'),
    userRepository = require('../dao/userRepository'),
    workspaceRepository = require('../dao/workspaceRepository');

exports.saveUserData = function(userData){
    console.log("Saving user data");
    return userRepository.saveUserData(userData);
}

exports.createWorkspace = async function(user){
    console.log("Creating new workspace");
    let workspaceHash = createHash(8);
    await Promise.all([
        userRepository.saveUserWorkspace(user,workspaceHash),
        workspaceRepository.saveWorkspaceString(workspaceHash,'hello','world')
    ]);
}

exports.addWorkspace = async function(workSpaceData,user){
    await userRepository.saveUserWorkspace(user,workSpaceData.workspace);
}

exports.getUserData = function(userData){
    return userRepository.findUserDataById(userData);
}

exports.shareWorkspace = function(owner, guest, workspaceData){
    //verificar que exista el workspace
    //verificar que exista el owner y el guest
    //agregar el workspace al guest
}