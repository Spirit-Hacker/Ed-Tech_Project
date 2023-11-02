const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// resetPasswordToken
exports.resetPasswordToken = async(req, res) => {
    try {
        // get email from req body
        const {email} = req.body;
        // check user for this email, email validation
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(402).json({
                success: false,
                message: "Your email is not registered with us",
            });
        }
        // generate token
        const token = crypto.randomBytes(20).toString("hex");

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                    {email: email},
                                    {
                                        token: token,
                                        resetPasswordToken: Date.now() + 5*60*1000,
                                    },
                                    {new: true}
        );
        console.log("DETAILS : ", updatedDetails);

        // create url
        const url = `http://localhost:3000/update-password/${token}`;
        // send mail containing the url
        await mailSender(email, "Password reset link", `Password reset link: ${url}`);
        // return responce
        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check email and change password",
        });
    }
    catch(error) {
        console.log(error, "something went wrong while reseting password");
        return res.status(500).json({
            success: false,
            message: "something went wrong while reseting password",
        });
    }
}

// resetPassword
exports.resetPassword = async(req, res) => {
    try {
        // data fetch
        const {password, confirmPassword, token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Passwords not matching",
            });
        }
        // get user details from DB using token
        const userDetails = await User.findOne({token: token});
        // if no user entry - invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: "Token is invalid",
            });
        }
        // token time check - if token is expired or not
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired, please regenerate your token",
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // update password in DB
        await User.findOneAndUpdate(
                    {token: token},
                    {password: hashedPassword},
                    {new: true},
        );
        // return response
        return res.status(200).json({
            success: true,
            message: "Password reset successfull",
        });
    }
    catch(error){
        console.log(error, "Error occured while reseting password");
        return res.status(500).json({
            success: false,
            message: "Error occured while reseting password"
        })
    }
}
