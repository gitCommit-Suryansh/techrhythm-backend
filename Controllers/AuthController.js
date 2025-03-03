const usermodel = require("../model/user");
const { generateToken } = require("../utils/GenerateToken");


exports.Signup = async (req, res) => {
    try {
        const { fullName, email, phone, college, password } = req.body;
        
        // Check if all fields are present
        if (!fullName || !email || !phone || !college || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await usermodel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Create new user
        const user = await usermodel.create({
            fullName,
            email,
            phone,
            college,
            password    // storing password directly
        });

        return res.status(200).json({
            success: true,
            message: "Signup Successful"
        });

    } catch (error) {
        console.error("Error in Signup:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Find user
        const user = await usermodel.findOne({ email });

        // Check user exists and password matches
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        let token=generateToken(user)
        
        res.cookie("token", token, {
            maxAge: 3600000,      // 1 hour
            httpOnly: false,       // Prevent XSS attacks
            secure: true,         // Ensure HTTPS only
            sameSite: "Strict",   // Prevent CSRF attacks
            path: "/",
        });


        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token:token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};