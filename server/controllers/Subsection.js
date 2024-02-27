const Subsection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// create Subsection
exports.createSubsection = async(req, res) => {
    try {
        // fetch data fron req body
        const {sectionId, title, timeDuration, description} = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(401).json({
                success: false,
                message: "All fiels are required",
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create a subsection
        const subSectionDetails = await Subsection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // update section with this subsection ObjectId
        const updatedSection = await Section.findByIdAndUpdate(
                        {_id: sectionId},
                        {
                            $push:{
                                subSection: subSectionDetails._id,
                            }
                        },
                        {new: true},
        ).populate("subSection")

        // return responce
        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully",
            updatedSection,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Sub-section, please try again",
            error: error.message,
        });
    }
}

// HW: updateSubsection
exports.updateSubsection = async(req, res) => {
    try {
        // get input
        const {subSectionId, title, timeDuration, description} = req.body;

        // extract file/video
        const newVideo = req.files.videoFile;

        // data validation
        if(!subSectionId || !title || !timeDuration || !description || !newVideo){
            return res.status(401).json({
                success: false,
                message: "Missing properties",
            });
        }

        // upload new video to cloudinary
        const newUploadDetails = await uploadImageToCloudinary(newVideo, process.env.FOLDER_NAME);

        // update data
        const updatedSubSection = await Subsection.findByIdAndUpdate(
                                    {_id: subSectionId},
                                    {
                                        title,
                                        timeDuration,
                                        description,
                                        videoUrl: newUploadDetails.secure_url,
                                    },
                                    {new: true},
        );

        // return responce
        return res.status(200).json({
            success: true,
            message: "Sub-Section updated successfully",
            updatedSubSection,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update Sub-section, please try again",
            error: error.message,
        });
    }
}

// HW: deleteSubsection
exports.deleteSubsection = async(req, res) => {
    try {
        // get data - assume we send id in params
        const {subSectionId, sectionId} = req.body;

        // delete sub section
        await Subsection.findByIdAndDelete(subSectionId);
        // TODO [Testing] : do we need to delete this from section schema ??

        // return responce
        return res.status(200).json({
            success: true,
            message: "sub-section deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Sub-section, please try again",
            error: error.message,
        });
    }
}

