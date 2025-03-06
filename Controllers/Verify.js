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

        return res.status(200).json({ verified: true });
    } catch (error) {
        console.error("Error verifying pass:", error);
        return res.status(500).json({ verified: false, error: error.message });
    }
};