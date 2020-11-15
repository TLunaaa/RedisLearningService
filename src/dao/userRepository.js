var { rediscli } = require('./redisDB'),
    { promisify } = require('util');

exports.saveUserData = function(data){
    rediscli.hmset('user:' + data.user +':data',
                    'name',data.name,
                    'surname',data.surname,
                    'mail',data.mail
                );
}

/**
 * Retrieves user data by user id
 * @param {string} username
 * @returns Promise
 */
exports.findUserDataById = function(user){
    return promisify(rediscli.hgetall).bind(rediscli)('user:' + user +':data');
};

exports.saveUserWorkspace = function(user,workspaceHash){
    return promisify(rediscli.rpush).bind(rediscli)(['user:' + user +':workspaces',workspaceHash]);
}