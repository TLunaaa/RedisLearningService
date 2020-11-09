var {redis_client} = require('../dao/redisDB'),
    { promisify } = require('util');
    bcrypt = require('bcrypt');

const BCRYPT_SALT_ROUNDS = 12;

//Creates a new user if the username it's not taken yet, and saves user data.
exports.register = async (data) => {    
    let userExists = await promisify(redis_client.exists).bind(redis_client)('user:' + data.user + ':login');
    if(userExists === 1){
        console.error("LoginService - Usuario existente")
        throw new Error("Usuario existente");
    }
    bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => promisify(redis_client.set).bind(redis_client)('user:' + data.user +':login',hashedPassword))
        .then(reply => {
            if(reply != null){
                redis_client.hmset('user:' + data.user +':data','name',data.name,'surname',data.surname,'mail',data.mail);
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

    let hashedPassword = await promisify(redis_client.get).bind(redis_client)('user:' + data.user +':login');
    return bcrypt.compare(data.password,hashedPassword)
        .then(function(isCorrect){
            console.log(isCorrect);
            if(!isCorrect){
                console.error("LoginService - Error en la autenticacion");
                throw new Error("Usuario y/o clave incorrectos");
            }
            console.log("Obteniendo datos del usuario " + data.user)
            return promisify(redis_client.hgetall).bind(redis_client)('user:' + data.user +':data');
        })
        .then((object) => {
            console.log(object);
            if(object == null){
                throw new Error("Error al obtener los datos del usuario");
            }
            return object;
        })
}
