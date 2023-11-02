const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

// createCourse handler function
exports.createCourse = async(req, res) => {
    try {
        // fetch data
        let {courseName, courseDescription, whatYouWillLearn, price, category, status, instructions, tag} = req.body;
        
        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !tag){
            return res.status(400).json({
                success: false,
                message: "All field are mandatory",
            });
        }

        if(!status || status === undefined){
            status = "Draft";
        }

        // check for instructor
        const userId = req.user.id;

        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });
        console.log("Instructor Details: ", instructorDetails);
        // TODO: check id userId and instructorDetails._id are same or different.

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found",
            });
        }

        // check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category Details not found",
            });
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions
        });

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true}
        );

        // update the category schema
        // HW: TODO ✅
        await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push:{
                    course: newCourse._id
                }
            },
            {new: true}
        );

        // return responce
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    }
    catch(error){
        console.log("Error, while creating course");

        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

// getAllCourses handler function
exports.showAllCourses = async(req, res) => {
    try {
        const allCourses = await Course.find({},
                                            {
                                                courseName: true,
                                                price: true,
                                                thumbnail: true,
                                                instructor: true,
                                                ratingAndReviews: true,
                                                studentsEnrolled: true,
                                            },
                                            {new: true}
        ).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        });
    }
    catch (error) {
        console.log("Error, while showing all courses");
        return res.status(500).json({
            success: true,
            message: "Cannot fetch course data",
            error: error.message,
        })
    }
}

// get course details
exports.getCourseDetails = async(req, res) => {
    try {
        // get course id
        const {courseId} = req.body;

        // find course details
        const courseDetails = await Course.find(
                              {_id: courseId}
        )
        .populate(
            {
                path:"instructor",
                populate: {
                    path: "additionalDetails",
                }
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate(
            {
                path: "courseContent",
                populate: {
                    path: "subSection",
                }
            }
        )
        .exec();
        
        // validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `could not find course with ${courseId}`,
            });
        }

        // return rsponce
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    }
    catch(error){
        console.log("Error while fetching course details");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
