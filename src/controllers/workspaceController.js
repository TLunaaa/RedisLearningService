var workspaceService = require("../services/workspaceService");


exports.executeQuery = async function(req,res,next){
    try{
        let workspaceId = req.params.workspaceId;
        let userId = req.body.user;
        let result = await workspaceService.executeQuery(workspaceId,userId,req.body);
        res.status(200).json(result);
    }catch(err){
        next(new Error(err));
    }
};