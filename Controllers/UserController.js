const usermodel=require('../model/user')

exports.getuser=async(req,res)=>{
const userId = req.params.userId;
try {
    const user = await usermodel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
} catch (error) {
    console.error("Error in getuser:", error);
    return res.status(500).json({
        message: "There's something error",
        error: error.message
    });
}

}