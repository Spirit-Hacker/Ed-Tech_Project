const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");


exports.updateCourseProgress = async(req, res) => {
    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Inavalid sub section id"
            });
        }

        const courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        });

        console.log("Course progress in update course progress", courseProgress);

        if(!courseProgress){
            return res.status(400).json({
                success: false,
                message: "Course Progress not exists"
            });
        }
        else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(401).json({
                    success: false,
                    message: "sub section or video alredy completed"
                });
            }
            
            courseProgress.completedVideos.push(subSectionId);
        }
        
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "video added to course progress"
        });
    }
    catch (error) {
        console.log("Internal server error, inside update course progress");
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}