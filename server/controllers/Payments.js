const {Instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// capture the payment and initiate the razorpay order
exports.capturePayment = async(req, res) => {
    try {
        // get courseId and userId
        const {courseId} = req.body;
        const userId = req.user.id;

        // validation
        // valid courseId
        if(!courseId){
            return res.json({
                success: false,
                message: "Please provide valid course Id, while capturing payment",
            });
        }

        // valid courseDetails
        let courseDetails;
        try {
            courseDetails = await Course.findById(courseId);
            if(!courseDetails){
                return res.json({
                    success: false,
                    message: "Could not find course, while capturing payment",
                });
            }

            // check if user already paid for same course
            const uid = new mongoose.Types.ObjectId(userId);
            if(courseDetails.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Student already enrolled, in the course he/she is buying",
                });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        // order create
        const ammount = courseDetails.price;
        const currency = "INR";

        const options = {
            ammount: ammount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: courseId,
                userId,
            }
        }

        try {
            // initiate the payment using razorpay
            const paymentResponce = Instance.orders.create(options);
            console.log(paymentResponce);

            // return responce
            return res.status(200).json({
                success: true,
                courseName: courseDetails.courseName,
                courseDescription: courseDetails.courseDescription,
                thumbnail: courseDetails.thumbnail,
                orderId: paymentResponce.id,
                currency: paymentResponce.currency,
                ammount: paymentResponce.ammount,
            });
        }
        catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: "Could not initiate order, In payment capture",
            });
        }
        // return responce
    }
    catch (error){
        console.log(error);
        res.json({
            success: false,
            message: "Could not initiate order, {In catch of payment capture}",
        });
    }
}

// verify signature of razorpay and server
exports.verifySignature = async(req, res) => {
    const webhookSecret = process.env.WEBHOOKSECRET;

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorized");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try {
            // fulfill the action
            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                    {_id: courseId},
                                    {
                                        $push: {studentsEnrolled: userId},
                                    },
                                    {new: true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not found, while verifying payment signature",
                });
            }

            console.log(enrolledCourse);

            // find the student and add course to their list of enrolled courses.
            const enrolledStudent = await User.findOneAndUpdate(
                                    {_id: userId},
                                    {
                                        $push: {courses: courseId},
                                    },
                                    {new: true},
            );

            if(!enrolledStudent){
                return res.status(500).json({
                    success: false,
                    message: "Student not found, while verifying payment signature",
                });
            }

            console.log(enrolledStudent);

            // mail send krdo confirmation wala
            const emailResponce = await mailSender(
                                  enrolledStudent.email,
                                  "Congratulations, from StudyNotion",
                                  courseEnrollmentEmail,
            );

            console.log(emailResponce);

            return res.status(200).json({
                success: true,
                message: "Signature verified and course added",
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Cannot verify razorpay signature",
                error: error.message,
            });
        }
    }

    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request, In payment controller",
        });
    }
};