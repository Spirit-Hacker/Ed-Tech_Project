const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true,
    },
    courseDescription: {
        type: String,
        trim:true,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        trim: true,
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviews"
        }
    ],
    price: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail:{
        type: String
    },
	tag: {
		type: [String],
	},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ],
	instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    courseProgressPercentage: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

module.exports = mongoose.model("Course", courseSchema);