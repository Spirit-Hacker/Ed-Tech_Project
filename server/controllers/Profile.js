const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");

exports.updateProfile = async(req, res) => {
    try {
        // get data
        const {firstName="", lastName="", dateOfBirth="", about="", contactNumber, gender} = req.body;

        // get user id
        const id = req.user.id;

        // validation 
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        const user = await User.findByIdAndUpdate(id, {
          firstName, 
          lastName
        })
        await user.save()

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();

        // return responce
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
    }
    catch (error) {
        console.log("Error, while updating profile");

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}


// TODO: Find More on Job Schedule
// const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);
    
    
// delete account
exports.deleteAccount = async(req, res) => {
    try {
        // get id
        const id = req.user.id;

        // validation
        const userDetails = await User.findById({_id: id});
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails._id});

        // TODO: HW - un-enroll user from all enrolled courses✅

        for(const courseId of userDetails.courses){
          await Course.findByIdAndUpdate(
            {courseId},
            {
              $pull: {studentsEnrolled: id},
            },
            {new: true}
          )
        }

        // delete user
        await User.findByIdAndDelete({_id: id});

        // return responce
        return res.status(200).json({
            success: true,
            message: "Account/Profile/User deleted successfully",
        })
    } 
    catch (error) {
        console.log("Error, while deleting the account");

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

exports.getAllUserDetails = async(req, res) => {
    try {
        // get id
        const id = req.user.id;

        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);

        // return responce
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails,
        });
    }
    catch (error) {
        console.log("Error, while getting all user/profile details");
        
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      ).populate("additionalDetails").exec()

      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection"
            }
          }
        })
        .exec()

      userDetails = userDetails.toObject();
      let subSectionLength = 0;
      for(let i = 0; i < userDetails.courses.length; ++i){

        let totalTimeDuration = 0;
        subSectionLength = 0;
        for(let j = 0; j < userDetails.courses[i].courseContent.length; ++j){
          totalTimeDuration += userDetails.courses[i].courseContent[j].subSection
            .reduce((acc, curr) => parseInt(acc + curr.timeDuration), 0);

          userDetails.courses[i].timeDuration = convertSecondsToDuration(totalTimeDuration);

          subSectionLength += userDetails.courses[i].courseContent[j].subSection.length;
        }

        let courseProgressCount = await CourseProgress.findOne({
          courseId: userDetails.courses[i]._id,
          userId: userId
        });

        courseProgressCount = courseProgressCount.completedVideos.length;
        if(subSectionLength === 0){
          userDetails.courses[i].courseProgressPercentage = 100;
        }
        else{
          const multiplier = Math.pow(10, 2);
          userDetails.courses[i].courseProgressPercentage = Math.round(courseProgressCount / subSectionLength* 100 * multiplier) /        multiplier;
        }
      }

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const instructorsCourses = await Course.find({instructor: req.user.id});

    const instructorCourseStats = instructorsCourses.map((course) => {
      const totalStudents = course.studentsEnrolled.length;
      const totalProfitGenerated = totalStudents * course.price;

      const courseData = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudents: totalStudents,
        totalProfitGenerated: totalProfitGenerated
      }

      return courseData;
    });

    return res.status(200).json({
      success: true,
      message: "Instructor stats fetched successfully",
      data: instructorCourseStats
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
} 