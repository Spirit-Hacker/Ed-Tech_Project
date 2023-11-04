const Category = require("../models/Category");

exports.createCategory = async(req, res) => {
    try {
        // fetch data
        const {name, description} = req.body;

        // validation
        if(!name || !description){
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        }

        // create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);

        // return responce
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        });
    }
    catch (error) {
        console.log("Error, while creating catogory!");

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// get all category
exports.showAllCategories = async(req, res) => {
    try {
        const allCategories = await Category.find({}, {name: true, description: true});
        return res.status(200).json({
            success: true,
            message: "All Categories returned successfully",
            allCategories,
        });
    }
    catch (error) {
        console.log("Error, while showing all category");

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
} 

exports.categoryPageDetails = async(req, res) => {
    try {
        // get category id
        const {categoryId} = req.body;

        // get courses for specified category id
        const selectedCategory = await Category.findById(categoryId)
                                        .populate("courses")
                                        .exec();

        // validation
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found",
            });
        }

        // get courses for different categories
        const differentCategories = await Category.findById(
                                    {
                                        _id: {
                                            $ne: categoryId,
                                        },
                                    },
        )
        .populate("courses")
        .exec()

        if(!differentCategories){
            return res.status(404).json({
                success: false,
                message: "Data not found",
            })
        }

        // get top selling courses ---> HW ✅

        const allCategories = await Category.find({})
        .populate("course")
        .exec()

        const allCourses = allCategories.flatMap( (category) => category.course )
        const topSellingCourse = allCourses.sort( (a, b) => a.sold - b.sold).slice(0, 10)

        // const allCategory = await Category.find()
        // .populate("courses").exec()

        // const getAllCourses = allCategory.map((category) => category.course);
        // const topSellingCourse = getAllCourses.sort((a, b) => getAllCourses.compare(b - a))


        // return responce
        return res.status(200).json({
            success: true,
            message: "Category page details fetched successfully",
            data: {
                selectedCategory,
                differentCategories,
                topSellingCourse,
            },
        });
    }
    catch (error) {
        console.log("Error while fetching category page details")
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}