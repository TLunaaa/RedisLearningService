var { rediscli } = require('./redisDB'),
    { promisify } = require('util');

/**
 * Stores user hashed password
 * @param {string} user user to save password
 * @param {hash} password Expects to be hashed
 * @returns Promise(err,reply)
 */
exports.saveUserPassword = function(user,password){
    return promisify(rediscli.set).bind(rediscli)('user:' + user +':login',password)
}

/**
 * @param {*} data {user,name,surname,mail}
 */
exports.saveUserData = function(data){
    rediscli.hmset('user:' + data.user +':data',
                    'name',data.name,
                    'surname',data.surname,
                    'mail',data.mail
                );
}

/**
 * Check if key exists
 * @param {string} key to verify existence
 * @returns Promise(err,1 = true or 0 = false)
 */
exports.checkKey = function(key){
    return promisify(rediscli.exists).bind(rediscli)(key);
}

/**
 * Retrieves user data by user id
 * @param {string} userId user identifier
 * @returns Promise(err,userdata)
 */
exports.findUserDataById = function(userId){
    return promisify(rediscli.hgetall).bind(rediscli)('user:' + userId +':data');
};

/**
 * Retrieves user data by user id
 * @param {string} userId user identifier
 * @returns Promise(err, hashedPass)
 */
exports.findUserPasswordById = function(userId){
    return promisify(rediscli.get).bind(rediscli)('user:' + userId +':login')
}

/**
 * @param {string} user 
 * @param {hash} workspaceHash 
 * @returns Promise(err,reply)
 */
exports.saveUserWorkspace = function(user,workspaceHash){
    return promisify(rediscli.rpush).bind(rediscli)(['user:' + user +':workspaces',workspaceHash]);
}

/**
 * @param {string} user user to save query count
 * @param {number} count 
 * @returns Promise(err,reply)
 */
exports.saveUserQueriesCounter = function(user,count){
    return promisify(rediscli.set).bind(rediscli)(['user:' + user + ':queries:count',count]);
}

/**
 * @param {string} user user to save query storage
 * @param {number} storage 
 * @returns Promise(err,reply)
 */
exports.saveUserQueriesStorage = function(user,storage){
    return promisify(rediscli.set).bind(rediscli)(['user:' + user + ':queries:storage',storage]);
}

/**
 * @param {string} user username that owns the workspaces
 * @returns Promise(err,list) 
 */
exports.findAllWorkspacesByUserId = function(user){
    return promisify(rediscli.lrange).bind(rediscli)('user:' + user + ':workspaces',0,-1);
}

/**
 * Decrease by 1 the user query counter
 * @param {string} user 
 * @returns Promise(err,reply)
 */
exports.decreaseUserQueriesCounter = function(user){
    return promisify(rediscli.decr).bind(rediscli)('user:' + user + ':queries:count');
}

/**
 * Decrease the size inserted the user query storage
 * @param {string} user 
 * @returns Promise(err,reply)
 */
exports.decreaseUserQueriesStorage = function(user,size){
    return promisify(rediscli.get).bind(rediscli)('user:' + user + ':queries:storage')
        .then(oldSize => {
            const newSize = oldSize - size;
            promisify(rediscli.set).bind(rediscli)(['user:' + user + ':queries:storage',newSize]);
            return newSize;
        })
}

/**
 * Decrease the size inserted the user query storage
 * @param {string} user 
 * @returns Promise(err,reply)
 */
exports.increaseUserQueriesStorage = function(user,size){
    return promisify(rediscli.get).bind(rediscli)('user:' + user + ':queries:storage')
        .then(oldSize => {
            const newSize = oldSize + size;
            promisify(rediscli.set).bind(rediscli)(['user:' + user + ':queries:storage',newSize]);
            return newSize;
        })
}

/**
 * Retrieves user queries counter
 * @param {string} user 
 * @returns Promise(err,reply)
 */
exports.getUserQueriesCounter = function(user){
    return promisify(rediscli.get).bind(rediscli)('user:' + user + ':queries:count');
}

/**
 * Retrieves user queries storage
 * @param {string} user 
 * @returns Promise(err,reply)
 */
exports.getUserQueriesStorage = function(user){
    return promisify(rediscli.get).bind(rediscli)('user:' + user + ':queries:storage');
}

/**
 * Saves user history
 * @param {string} user 
 * @param {JSON} jsonObject 
 * @returns Promise(err,list.length)
 */
exports.saveUserQuery = function(user,jsonObject){
    return promisify(rediscli.rpush).bind(rediscli)(['user:' + user + ':queries:history',jsonObject])
}

/**
 * Retrieves user history
 * @param {string} user 
 * @returns Promise(err,list)
 */
exports.getUserHistory = function(user){
    return promisify(rediscli.lrange).bind(rediscli)('user:' + user + ':queries:history',0,-1);
}

/**
 * Deletes an user workspace
 * @param {string} user 
 * @param {string} workspaceId 
 * @returns Promise(err,list)
 */
exports.deleteWorkspaceById = function(user,workspaceId){
    return promisify(rediscli.lrem).bind(rediscli)('user:' + user + ':workspaces',0,workspaceId);
}