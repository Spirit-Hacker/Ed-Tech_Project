const {Instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

exports.capturePayment = async(req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if(courses.length === 0){
            return res.status(400).json({
                success: false,
                message: "Please provide course id, while capture payment"
            });
        }

        let totalAmount = 0;
        for(const course_id of courses){
            let course;
            try {
                course = await Course.findById(course_id);
                if(!course){
                    return res.status(400).json({
                        success: false,
                        message: "Please provide a valid course id, while capturing payment"
                    });
                }

                // check if user already purchased the course
                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid)){
                    return res.status(400).json({
                        success: false,
                        message: "User already purchased this course"
                    });
                }

                totalAmount += course.price;
            }
            catch (error) {
                console.log("Capture Payment : ", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while capturing payment"
                });
            }
        }

        const options = {
            ammount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now).toString()
        }

        // create order
        try {
            const paymentResponce = Instance.orders.create(options);
            console.log("PAYMENT RESPONCE : ", paymentResponce);
            
            return res.status(200).json({
                success: true,
                message: "payment captured successfully",
                data: paymentResponce
            });
        }
        catch (error) {
            console.log("Error : ", error);
            return res.status(400).json({
                success: false,
                message: "Error while initiating order, in payment capture"
            });
        }
    }
    catch (error) {
        console.log("Internal Server error, capture payments", error);
        return res.status(500).json({
            success: false,
            message: "Error while capturing payment",
        });
    }
}

// verify the signature
exports.verifySignature = async(req, res) => {
    try {
        const razorpay_payment_id = req.body?.razorpay_payment_id;
        const razorpay_order_id = req.body?.razorpay_order_id;
        const razorpay_signature = req.body?.razorpay_signature;

        const { courses } = req.body;
        const userId = req.user.id;

        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !courses){
            return res.status(400).json({
                success: false,
                message: "Please provide valid data for payment verification"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature = crypto
                .createHmac("sha256", process.env.RAZORPAY_SECRET)
                .update(body.toString())
                .digest("hex");

        if(generated_signature === razorpay_signature){
            console.log("Payment verification successfull");

            // add user to all buyed course schema and add all buyed courses to user schema
            for(const course_id of courses){
                try {
                    const updatedCourse = await Course.findByIdAndUpdate(course_id,
                        {
                            $push: {studentsEnrolled: userId}
                        },
                        {new: true}
                    );

                    if(!updatedCourse){
                        return res.status(400).json({
                            success: false,
                            message: "Course not found, while verifying payment"
                        });
                    }

                    const updatedUser = await User.findByIdAndUpdate(userId, 
                        {
                            $push: {courses: course_id}
                        },
                        {new: true}
                    );

                    if(!updatedUser){
                        return res.status(400).json({
                            success: false,
                            message: "User not found, while verifying payment"
                        });
                    }

                    const emailResponce = await mailSender(
                        updatedUser.email,
                        `Congratulations for successfully enrolling in ${updatedCourse.courseName}`,
                        courseEnrollmentEmail(updatedCourse.courseName, `${updatedUser.firstName} ${updatedUser.lastName}`)  
                    );
                    console.log("Email sent successfully : ", emailResponce.response);
                }
                catch (error) {
                    console.log("Error while adding user/course to courses/user");
                    console.log("Error : ", error);

                    return res.status(400).json({
                        success: false,
                        message: "Error while adding user/course to courses/user"
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Payment Verification successfull"
            })
        }
    }
    catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Error while payment verification"
        });  
    }
}