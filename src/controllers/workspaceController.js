var workspaceService = require("../services/workspaceService");


exports.executeQuery = async function(req,res,next){
    try{
        let result = await workspaceService.executeQuery(req.params.workspaceId,req.body.user,req.body);
        res.status(200).json(result);
    }catch(err){
        next(new Error(err));
    }
};