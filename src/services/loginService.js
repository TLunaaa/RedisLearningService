var { promisify } = require('util'),
    { rediscli } = require('../dao/redisDB'),
    bcrypt = require('bcrypt'),
    userService = require('../services/userService'),
    {InternalError} = require('../errors/customErrors');

const BCRYPT_SALT_ROUNDS = 12;

//Creates a new user if the username it's not taken yet, and saves user data.
exports.register = async (data) => {    
    let userExists = await promisify(rediscli.exists).bind(rediscli)('user:' + data.user + ':login');
    if(userExists === 1){
        console.error("LoginService - Usuario existente")
        throw new Error("Usuario existente");
    }
    bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => promisify(rediscli.set).bind(rediscli)('user:' + data.user +':login',hashedPassword))
        .then(reply => {
            if(reply != null){
                userService.saveUserData(data);
                console.log("user data saved");
                userService.createWorkspace(data.user);
                console.log("LoginService - Nuevo usuario registrado")
            }
        })
        .catch(e => {
            console.error("LoginService - Error al registrar al usuario");
            throw new Error("Error al registrar al usuario");
        }) 

}

//Check if the loggin credentials are OK.
exports.login = async (data) => {
    let hashedPassword = await promisify(rediscli.get).bind(rediscli)('user:' + data.user +':login');
    return bcrypt.compare(data.password,hashedPassword)
        .then(function(isCorrect){
            console.log(isCorrect);
            if(!isCorrect){
                console.error("LoginService - Error en la autenticacion");
                throw new Error();
            }
            console.log("Obteniendo datos del usuario " + data.user)
            return userService.getUserData(data.user);
        })
        .then((object) => {
            console.log(object);
            if(object == null){
                throw new InternalError("Error al obtener los datos del usuario");
            }
            return object;
        })
}
