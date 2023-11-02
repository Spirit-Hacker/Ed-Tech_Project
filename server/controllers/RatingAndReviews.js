const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create rating and review
exports.createRating = async(req, res) => {
    try {
        // get user id
        const userId = req.user.id;
        
        // fetch data from request body
        const {rating, review, courseId} = req.body;

        // check if user is enrolled in the course or not
        const courseDetails = await Course.findOne(
                                {
                                    _id: courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId}},
                                }
        );

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled with the course",
            });
        }

        // check if user already reviewed the course
        const alreadyReviwed = await RatingAndReviews.findOne(
                                    {
                                        user: userId,
                                        course: courseId,
                                    }
        );

        if(alreadyReviwed){
            return res.status(403).json({
                success: false,
                message: "Course is already reviwed by the User",
            });
        }

        // create rating and review
        const ratingReview = await RatingAndReviews.create(
            {
                user: userId,
                rating: rating,
                review: review,
                course: courseId,
            }
        );

        // update course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                    {_id: courseId},
                    {
                        $push: {
                            ratingAndReviews: ratingReview._id,
                        },
                    },
                    {new: true}
        );
        console.log(updatedCourseDetails);

        // return responce
        return res.status(200).json({
            success: true,
            message: "Rating and Review created succesfully",
            rating: ratingReview,
        });
    }
    catch (error) {
        console.log("Error while creating rating and reviews");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// get average rating
exports.getAverageRating = async(req, res) => {
    try {
        // get course id
        const courseId = req.body.courseId;
        // const {courseId} = req.body;

        // calculate average rating
        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: `$rating`}
                }
            }
        ]);

        // return responce
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // if no rating and reviews found
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no ratings given till now",
            averageRating: 0,
        });
    }
    catch (error){
        console.log("Error while fetching average rating");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// get all ratings and review
exports.getAllRating = async(req, res) => {
    try {
        const allRatingAndReviews = await RatingAndReviews.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path: "user",
                                        select: "firstName lastName email image",
                                    })
                                    .populate({
                                        path: "course",
                                        select: "courseName",
                                    })
                                    .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allRatingAndReviews,
        });
    }
    catch (error) {
        console.log("Error while fetching all rating and reviews");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}