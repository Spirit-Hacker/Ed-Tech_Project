const Subsection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const SubSection = require("../models/SubSection");
require("dotenv").config();

// create Subsection
exports.createSubsection = async(req, res) => {
    try {
        // fetch data fron req body
        const {sectionId, title, description} = req.body;
        console.log("Request Body of sub section create : ", req.body);
        
        // extract file/video
        const video = req.files.videoUrl;
        console.log("Request Files: ", req.files);

        console.log(`Title : ${title}, description : ${description}, video : ${video}`);

        // validation
        if(!sectionId || !title || !description || !video){
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
            timeDuration: uploadDetails.duration,
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
            data: updatedSection,
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
        const {sectionId, subSectionId, title, description} = req.body;

        console.log("inside subsection controller");
        console.log(`Title: ${title}, Description: ${description}, Request Body: ${req.body}`);

        // validation
        if(!title || !description){
            return res.status(401).json({
                success: false,
                message: "All fiels are required",
            })
        }

        // extract file/video
        const video = req.files.videoUrl;

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        await Subsection.findByIdAndUpdate(
            {_id: subSectionId},
            {
                title: title,
                timeDuration: uploadDetails.duration,
                description: description,
                videoUrl: uploadDetails.secure_url,
            }
        )

        // update data
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // return responce
        return res.status(200).json({
            success: true,
            message: "Sub-Section updated successfully",
            data: updatedSection,
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
        const {subSectionId, sectionId} = req.body;

        // TODO [Testing] : do we need to delete this from section schema ? ans - YES
        // delete subsection from section schema
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull: {
                    subSection: subSectionId
                }
            }
        )

        // delete sub section
        await Subsection.findByIdAndDelete(subSectionId);

        const updatedSection = await Section.findById(sectionId)
                .populate("subSection");

        // return responce
        return res.status(200).json({
            success: true,
            message: "sub-section deleted successfully",
            data: updatedSection,
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

