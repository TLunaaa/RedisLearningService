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
        let worspaceHash = await userService.createWorkspace(req.params.username);
        res.status(200).json({workspace : worspaceHash});
    }catch(err){
        next(new Error(err));
    }
}

exports.addWorkspace = async function(req,res,next){
    try{
        let workspaces = await userService.shareWorkspace(req.body.owner,req.params.username,req.body.workspace);
        res.status(200).json(workspaces);
    }catch(err){
        next(new Error(err));
    }
}

exports.userQueriesCounter = async function(req,res,next){
    try{
        let count = await userService.getCounter(req.params.username);
        res.status(200).json(count);
    }catch(err){
        next(new Error(err));
    }
}

exports.userHistory = async function(req,res,next){
    try{
        let historyList;
        if(req.query.workspaceId != null){
            historyList = await userService.getUserHistoryByWorkspaceId(req.params.username,req.query.workspaceId);
        }else{
            historyList = await userService.getAllUserHistory(req.params.username);
        }
        let converted = historyList.map(function(element){
            return JSON.parse(element);
        })
        res.status(200).json(converted);
    }catch(err){parse
        next(new Error(err));
    }
}