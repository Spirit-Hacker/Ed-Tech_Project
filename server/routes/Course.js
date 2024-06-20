const express = require("express");
const router = express.Router();

// import controllers

// course controllers
const {createCourse, showAllCourses, getCourseDetails, getInstructorCourses, deleteCourse, editCourse} = require("../controllers/Course");

// category controllers
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/Category");

// section controllers
const {createSection, updateSection, deleteSection} = require("../controllers/Section");

// subsection controllers
const {createSubsection, updateSubsection, deleteSubsection} = require("../controllers/Subsection");

// Rating and review controllers
const {createRating, getAverageRating, getAllRating} = require("../controllers/RatingAndReviews");

// Course Progress controllers
const { updateCourseProgress } = require("../controllers/CourseProgress");

// import middlewares
const {auth, isAdmin, isInstructor, isStudent} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Courses can Only be Edited by Instructors
router.post("/editCourse", auth, isInstructor, editCourse)
// Delete course route by only Instructor
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubsection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubsection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubsection)
// Get all Registered Courses
router.get("/getAllCourses", auth, showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", auth, getCourseDetails)
// Get all Courses of an Instructor
router.get("/getInstructorCourses", auth, getInstructorCourses)
// get /course/getFullCourseDetails
router.post("/getFullCourseDetails", auth, getCourseDetails)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here ✅
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;