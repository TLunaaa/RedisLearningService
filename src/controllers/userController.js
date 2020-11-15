var userService = require('../services/userService');

exports.createWorkspace = async function(req,res,next){
    try{
        let worspaceHash = await userService.createWorkspace(req.body,req.body.user);
        res.state(200).json({workspace : worspaceHash});
    }catch(err){
        next(new Error(err));
    }
}
