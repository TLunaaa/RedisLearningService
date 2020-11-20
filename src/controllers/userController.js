var userService = require('../services/userService');


exports.getWorkspaces = async function(req,res,next){
    try{
        console.log("Fetching workspaces from " + req.params.username);
        let workspaces = await userService.getUserWorkspaces(req.params.username);
        res.status(200).json(workspaces);
    }catch(err){
        next(new Error(err));
    }
}

exports.createWorkspace = async function(req,res,next){
    try{
        let worspaceHash = await userService.createWorkspace(req.body,req.body.user);
        res.status(200).json({workspace : worspaceHash});
    }catch(err){
        next(new Error(err));
    }
}
