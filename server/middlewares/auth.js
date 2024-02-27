const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// auth
exports.auth = async(req, res, next) => {
    try {
        // extract token
        const token = req.body.token || req.cookies.token 
                        || req.header("Authorisation").replace("Bearer ", "");

        // console.log("auth middleware : ", token)

        // if token is missing
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Printing Decode : ", decode, "");
            req.user = decode;
        } 
        catch (error) {
            console.log(error, "error in token verification");
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Somethig went wrong while validating the token",
        });
    }
}

// isStudent
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified as a student, please try again",
        });
    }
}

// isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructors only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified as an instructor, please try again",
        });
    }
}

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified as an admin, please try again",
        });
    }
}

// I changed middleware on perpose