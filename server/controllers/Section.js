const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req, res) => {
    try {
        // data fetch
        const {sectionName, courseId} = req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }
        // create section
        const newSection = await Section.create({sectionName});

        // update course with section object id 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                    courseId,
                                    {
                                        $push:{
                                            courseContent: newSection._id,
                                        }
                                    },
                                    {new: true},
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()
        // HW: use populate to replace section/sub-section both in the updatedCourseDetails --> Done✅

        // return responce
        return res.status(200).json({
            success: true,
            message: "Section created succesfully",
            updatedCourseDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: error.message,
        });
    }
}

exports.updateSection = async(req, res) => {
    try {
        // data input
        const {sectionName, sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                Message: "Missing Properties",
            });
        }
        // update data
        const section = await Section.findByIdAndUpdate(
                                sectionId,
                                {sectionName},
                                {new: true},
        );

        // return responce
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error: error.message,
        });
    }
}

exports.deleteSection = async(req, res) => {
    try {
        // get id - assuming we are sending ID in params
        const {sectionId} = req.body;

        // use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        // TODO [Testing] : do we need to delete this from course schema ??

        // return responce
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        });
    }
}
