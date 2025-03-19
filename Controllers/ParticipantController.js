const usermodel = require("../model/user");


exports.allparticipants=async(req,res)=>{
    try{
        let users=await usermodel.find();
        if(!users){
            return res.status(201).json({"message":"Error fetching participants"})
        }
        return res.status(200).json({"message":"Participants fetched Successully"});
    }
    catch(err){
        return res.status(401).json({"message":"Error fetching participants"});
    }
}