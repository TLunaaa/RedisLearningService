var bcrypt = require('bcrypt'),
    userService = require('../services/userService'),
    {InternalError,ValidationError} = require('../errors/customErrors');

const BCRYPT_SALT_ROUNDS = 12;

//Creates a new user if the username it's not taken yet, and saves user data.
exports.register = async (data) => {    
    let userExists = await userService.verifyUser(data.user);
    if(userExists){
        console.error("LoginService - Usuario existente")
        throw new ValidationError("Usuario existente");
    }
    bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => userService.saveUserPassword(data.user,hashedPassword))
        .then(reply => {
            if(reply == null){
                throw new Error();
            }
            userService.createUser(data);
        })
        .catch(e => {
            console.error("LoginService - Error al registrar al usuario");
            throw new InternalError("Error al registrar al usuario:" + e);
        }) 

}

//Check if the loggin credentials are OK.
exports.login = async (data) => {
    let hashedPassword = await userService.getUserPassword(data.user);
    return bcrypt.compare(data.password,hashedPassword)
        .then(function(isCorrect){
            if(!isCorrect){
                console.error("LoginService - Error en la autenticacion");
                throw new ValidationError();
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
