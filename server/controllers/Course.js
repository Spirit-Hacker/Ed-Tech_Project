const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

// createCourse handler function
exports.createCourse = async(req, res) => {
    try {
        // fetch data
        let {courseName, courseDescription, whatYouWillLearn, price, category, status, instructions, tag} = req.body;
        
        // get thumbnail
        const thumbnail = req.files.thumbnailImage;
        console.log(thumbnail)

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag || !instructions){
            return res.status(400).json({
                success: false,
                message: "All field are mandatory",
            });
        }

        if(!status || status === undefined){
            status = "Draft";
        }

        // check for instructor
        console.log("Printing req inside create course api : ", req);
        console.log("Printing req.user inside create course api : ", req.user);
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
        const allCourses = await Course.find(
                                            {status: "Published"},
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

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            // course[key] = JSON.parse(updates[key])
            course[key] = updates[key]
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}

// get course details
exports.getCourseDetails = async(req, res) => {
    try {
        // get course id
        const { courseId } = req.body;
        const userId = req.user.id;

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
        
        console.log("GET COURSE DETALS API", courseDetails)
        console.log("GET COURSE DETALS API", courseDetails[0].courseContent)

        console.log("COURSE ID: ", courseId);
        console.log("USER ID: ", userId);

        const courseProgessCount = await CourseProgress.findOne({
          courseId: courseId,
          userId: userId
        });

        console.log("course progress : ", courseProgessCount);

        // total course duration
        let totalTimeDuration = 0;
        courseDetails[0].courseContent.forEach((section) => {
            section.subSection.forEach((subSection) => {
                let timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalTimeDuration += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalTimeDuration)

        // return rsponce
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgessCount?.completedVideos ? courseProgessCount?.completedVideos : []
            }
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

// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
try {
    // Get the instructor ID from the authenticated user or request body
    console.log("printing request for fetch instructor courses", req.user.id);
    const userid = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
        instructor: userid,
    }).sort({ createdAt: -1 })

    console.log("Instructor courses:", instructorCourses)

    // Return the instructor's courses
    res.status(200).json({
    success: true,
    data: instructorCourses,
    })
} catch (error) {
    console.error(error)
    res.status(500).json({
    success: false,
    message: "Failed to retrieve instructor courses",
    error: error.message,
    })
}
}