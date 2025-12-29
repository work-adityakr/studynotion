// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests

exports.auth = async (req, res, next) => {
    try {

        const token =
            req.cookies?.token || // Use ?. to prevent crash if cookies is undefined
            req.body?.token ||
            (req.header("Authorization")?.replace("Bearer ", "")); 


        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }

        try {
            // Verifying the JWT
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("3. Token Decoded:", decode);
            
            req.user = decode;
            
            next(); 
            
        } catch (error) {
            // Token is invalid/expired
            console.log("Token Verification Error:", error.message);
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }

    } catch (error) {
        console.log("Middleware System Error:", error);
        return res.status(500).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
        });
    }
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
