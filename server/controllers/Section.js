const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

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
            data: updatedCourseDetails,
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
        const {sectionName, sectionId, courseId} = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                Message: "Missing Properties",
            });
        }

        // update data
        await Section.findByIdAndUpdate(
                                sectionId,
                                {sectionName: sectionName},
                                {new: true},
        );

        const updatedCourseDetails = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()


        // return responce
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedCourseDetails,
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
        // get id - assuming we are sending ID in body
        const {sectionId, courseId} = req.body;

        if(!sectionId || !courseId){
            return res.status(400).json({
                success: false,
                message: "sectionId or courseId missing"
            })
        }

        // TODO [Testing] : do we need to delete this from course schema - YES
        // delete section from course
        await Course.findByIdAndUpdate(courseId,
            {
                $pull:{
                    courseContent: sectionId
                }
            }
        )
        // delete all associated sub section
        const section = await Section.findById(sectionId)
        await SubSection.deleteMany({_id: {$in: section?.subSection}})

        // use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId)

        // updated course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate:{
                    path: "subSection"
                }
            }).exec()

        // return responce
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: updatedCourse
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
