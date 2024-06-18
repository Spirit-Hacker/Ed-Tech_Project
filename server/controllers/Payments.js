const {Instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

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
                console.log("COURSE ID : ", course_id);
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

                totalAmount += JSON.parse(course.price);
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
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now).toString()
        }

        // create order
        try {
            const paymentResponce = await Instance.orders.create(options);
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

// verify the payment
exports.verifyPayment = async(req, res) => {
    try {
        const { razorpay_payment_id } = req.body;
        const { razorpay_order_id } = req.body;
        const { razorpay_signature } = req.body;

        const { courses } = req.body;
        const userId = req.user.id;

        console.log("Verify Payment Data : ", req.body);
        console.log("Verify Payment Data : ", razorpay_order_id);
        console.log("Verify Payment Data : ", razorpay_payment_id);
        console.log("Verify Payment Data : ", razorpay_signature);
        console.log("Verify Payment Data : ", userId);
        console.log("Verify Payment Data : ", courses);

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

                    const courseProgress = await CourseProgress.create({
                        courseId: course_id,
                        userId: userId,
                        completedVideos: []
                    });

                    const updatedUser = await User.findByIdAndUpdate(userId, 
                        {
                            $push: {courses: course_id, courseProgress: courseProgress._id}
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
            });
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

exports.sendPaymentSuccessEmail = async(req, res) => {
    try {
        const { order_id, payment_id, amount } = req.body;
        const userId = req.user.id;
        
        console.log("Send Payment success Email Data : ", order_id);
        console.log("Send Payment success Email Data : ", payment_id);
        console.log("Send Payment success Email Data : ", amount);
        console.log("Send Payment success Email Data : ", userId);

        if(!order_id || !payment_id || !amount || !userId){
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            });
        }

        try {
            const enrolledUser = await User.findById(userId);

            if(!enrolledUser){
                return res.status(404).json({
                    success: false,
                    message: "enroled user not found"
                });
            }

            // send mail
            await mailSender(
                enrolledUser.email,
                "Payment Received",
                paymentSuccessEmail(`${enrolledUser.firstName}`, amount / 100, order_id, payment_id)  
            );
        }
        catch(error) {
            return res.status(500).json({
                success: false,
                message: "cannot send email"
            });
        }
    }
    catch(error) {
        console.log("Error while sending payment succesfull email");
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}