const usermodel = require("../model/user");


exports.allparticipants=async(req,res)=>{
    try{
        let users=await usermodel.find();
        if(!users){
            return res.status(201).json({"message":"Error fetching participants"})
        }
        return res.status(200).json({"message":"Participants fetched Successfully",users});
    }
    catch(err){
        return res.status(401).json({"message":"Error fetching participants"});
    }
}

exports.updatepassid=async(req,res)=>{
    try {
        const { id, passId, passType } = req.body;
        const user = await usermodel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.passId = passId;
        user.passType = passType;
        await user.save();
        return res.status(200).json({ message: "Pass ID and Type updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error updating pass ID and Type" });
    }
}