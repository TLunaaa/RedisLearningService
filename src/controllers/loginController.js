var loginService = require('../services/loginService'),
    {ValidationError, InternalError} = require('../errors/customErrors');

exports.register = async function(req,res,next){
    try{
        await loginService.register(req.body);
        res.status(200).end();
    }catch(err){
        if(err instanceof InternalError){
            next(new Error(err));
        }else{
            next(new ValidationError(err));
        }
        
    }
}

exports.login = async function(req,res,next){
    try{
        let userData = await loginService.login(req.body);
        userData.user = req.body.user;
        res.status(200).json(userData);
    }catch(err){
        if(err instanceof InternalError){
            next(new Error(err));
        }else{
            next(new ValidationError("Usuario y/o clave incorrectos"));
        }
    }    
}