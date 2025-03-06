const usermodel = require("../model/user");

exports.verifyPass = async (req, res) => {
    const { passId } = req.body;

    try {
        // Find the user by passId
        const user = await usermodel.findOne({ passId });

        if (!user) {
            return res.status(404).json({ verified: false });
        }

        // Perform any operations you need with the found user
        // For example, mark the pass as verified or log the verification

        return res.status(200).json({ verified: true ,userId:user._id});
    } catch (error) {
        console.error("Error verifying pass:", error);
        return res.status(500).json({ verified: false, error: error.message });
    }
};

exports.checkIn = async (req, res) => {
    const { userId } = req.body;
    console.log("Received request body:", req.body); // Debugging


    try {
        // Find the user by userId
        const user = await usermodel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the user's checkIn status
        user.checkedIn = true;
        await user.save();

        return res.status(200).json({ message: "Check-in successful."});
    } catch (error) {
        console.error("Error during check-in:", error);
        return res.status(500).json({ message: "Error during check-in.", error: error.message });
    }
};