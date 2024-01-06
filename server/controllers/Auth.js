const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
require("dotenv").config();

// send OTP
exports.sendOTP = async(req, res) => {
    try {
        // fetch email from request ki body
        const {email} = req.body;

        // check id user already exists
        const userExists = await User.findOne({email});

        // if user already exists
        if(userExists){
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // generate otp
        let otp = otpGenerator.generate(6, {
            specialChars: false,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
        });
        console.log("OTP generated : ", otp);

        // check otp unique or not
        const result = await OTP.findOne({otp: otp});

        while(result){
            let otp = otpGenerator.generate(6, {
                specialChars: false,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // create an entry for OTP in DB
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP body in DB: ", otpBody);

        // return responce suucessfull
        return res.status(200).json({
            success: true,
            message: "OTP created successfully",
            otp,
        })

    }
    catch(error) {
        console.log(error, "Error while generating and storing OTP in DB");
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// sign-up
exports.signUp = async(req, res) => {
    try {
        // fetch data from request ki body
        const {
            firstName,
            lastName,
            email,
            contactNumber,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;

        // validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
                return res.status(403).json({
                    success: false,
                    message: "All fields are required"
                });
        }

        // 2 passwords match krlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword doesn't match, Please try again"
            });
        }

        // check user already exists or not
        const userExists = await User.findOne({email});

        // if user already exists
        if(userExists){
            return res.status(401).json({
                success: false,
                message: "User already registered"
            });
        }

        // find most recent otp stored for the user
        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("recentOTP is : ", recentOTP);

        // validate otp
        if(recentOTP.length == 0){
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }else if(recentOTP[0].otp !== otp){
            // invalid otp
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);        

        // create entry in DB
        let approved = "";
        approved === "Instructor" ? approved = false : approved = true

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const updatedUser = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName}${lastName}`,
        });

        // return responce
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: updatedUser
        });
    }
    catch(error){
        console.log(error, "Error while sign-up process");
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, Please try again later",
        });
    }
}

// login
exports.login = async(req, res) => {
    try {
        // get data req body
        const {email, password} = req.body;
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are mandatory",
            });
        }
        // check user exists or not
        const user = await User.findOne({email: email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered, please sign-up first",
            });
        }

        // match passwords
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            // generate JWT, after matching password
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            user.token = token;
            user.password = undefined;
            
            // create cookie and send responce
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    }
    catch(error){
        console.log(error, "Error while login process");
        return res.status(500).json({
            success: false,
            message: "Login failure, please try again later",
        });
    }
}

// change password
// TODO: HOMEWORK

exports.changePassword = async(req, res) => {
    try {
        // get data from req body
        const userDetails = await User.findById(req.user.id);

        // get oldPassword, newPassword
        const {oldPassword, newPassword} = req.body;

        // validation
        if(!oldPassword || !newPassword){
            return res.status(401).json({
                success: false,
                message: "All field are required",
            });
        }

        // validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);

        // if old password not match
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "The password is incorrect",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update password in DB
        const updatedUserDetails = await User.findByIdAndUpdate(
                             req.user.id,
                             {
                                password: hashedPassword
                             },
                             {new: true},
        );

        // send mail - password updated
        try {
            const emailResponse = await mailSender(updatedUserDetails.email,
                "Password Updated Successfully",
                passwordUpdated(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`)
            );
            console.log("Email sent successfully:", emailResponse.response);
        }
        catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }

        // return responce
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        })
    }
    catch(error){
        console.log(error, "Error while changing password");
        return res.status(500).json({
            success: false,
            message: "Failure while changing password",
        })    
    }
}