/**
 * Module dependencies.
 */

var {redis_client} = require('../dao/redis_client'),
var fmt = require('util').format;

/**
 * Redis formats.
 */

var formats = {
  client: 'clients:%s', //The application wanting to have access to your resources
  token: 'tokens:%s',
  user: 'users:%s', //The person wanting to use your resources on the Client
  refreshToken: 'refresh_tokens:%s'
};

/**
 * Get access token.
 * Invoked to retrieve an existing access token previously saved through Model#saveToken().
 */

module.exports.getAccessToken = function(bearerToken) {
  return redis_client.hgetall(fmt(formats.token, bearerToken))
    .then( (token) => {
      if (!token) {
        return;
      }

      return {
        accessToken: token.accessToken,
        clientId: token.clientId,
        expires: token.accessTokenExpiresOn,
        userId: token.userId
      };
    });
};

/**
 * Get client.
 */

module.exports.getClient = function(clientId, clientSecret) {
  return redis_client.hgetall(fmt(formats.client, clientId))
    .then(function(client) {
      if (!client || client.clientSecret !== clientSecret) {
        return;
      }

      return {
        clientId: client.clientId,
        clientSecret: client.clientSecret
      };
    });
};


/**
 * Get user.
 * Invoked to retrieve a user using a username/password combination.
 */

module.exports.getUser = function(username, password) {
  return redis_client.hgetall(fmt(formats.user, username))
    .then(function(user) {
      if (!user || password !== user.password) {
        return;
      }

      return {
        id: username
      };
    });
};

/**
 * Save token.
 * Invoked to save an access token and optionally a refresh token, depending on the grant type.
 * Used by OAuth2Server.token()
 */

module.exports.saveToken = function(token, client, user) {
  var data = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id
  };

  return Promise.all([
    redis_client.hmset(fmt(formats.token, token.accessToken), data),
    redis_client.hmset(fmt(formats.token, token.refreshToken), data)
  ]).return(data);
};
