const usermodel = require("../model/user");

// Function to generate a unique 10-digit ID
const generateUniqueId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

exports.registerPass = async (req, res) => {
    try {
        const { email, paymentDetails } = req.body;

        // Find the user by email
        const user = await usermodel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new paymentDetails object excluding passType and originalAmount
        const { passType, originalAmount, ...filteredPaymentDetails } = paymentDetails;

        // Initialize passId
        let passId = null;

        // Check if payment was successful
        if (paymentDetails.code === "PAYMENT_SUCCESS") {
            passId = generateUniqueId(); // Generate a unique 10-digit ID
        }

        // Update user with filtered payment details, pass type, and passId if applicable
        const updatedUser = await usermodel.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    paymentDetails: filteredPaymentDetails, // Use the filtered payment details
                    passAmount: originalAmount / 100, // Store the original amount separately
                    passType: passType, // Store passType separately
                    passId: passId // Save passId if generated
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "Failed to update user details" });
        }

        return res.status(200).json({
            message: "Pass registered successfully",
            user: updatedUser
        });

    } catch (err) {
        console.error("Error in registerPass:", err);
        return res.status(500).json({
            message: "There's something error",
            error: err.message
        });
    }
};


