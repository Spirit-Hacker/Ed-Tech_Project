import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI'
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import RequirementField from './RequirementField'
import { setCourse, setStep } from '../../../../../slice/courseSlice'
import toast from 'react-hot-toast'
import { COURSE_STATUS } from "../../../../../utils/constants"
import Upload from '../Upload'
import ChipInput from "./ChipInput"
import IconBtn from "../../../../common/IconBtn"

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const dispatch = useDispatch()
    const { course, editCourse } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [courseCategories, setCourseCategories] = useState([])

    useEffect(() => {
        const getCategories = async() => {
            setLoading(true)
            const categories = await fetchCourseCategories()
            console.log(categories)
            if(categories.length > 0){
                setCourseCategories(categories)
            }
            setLoading(false)
        }

        if(editCourse){
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        
        getCategories()
        // eslint-disable-next-line
    }, [])

    const isFormUpdated = () => {
        const currentValues = getValues()
        if(currentValues.courseTitle !== course.courseName
            || currentValues.courseShortDesc !== course.courseDescription
            || currentValues.coursePrice !== course.price
            || currentValues.courseTags !== course.tag
            || currentValues.courseBenefits !== course.whatYouWillLearn
            || currentValues.courseCategory !== course.category
            || currentValues.courseRequirements.toString() !== course.instructions.toString()
            || currentValues.courseImage !== course.thumbnail
        ){
            return true
        }else{
            return false
        }
    }

    const onSubmit = async(data) => {
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues()
                const formData = new FormData()

                formData.append("courseId", course._id)
                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName", data.courseTitle)
                }
                if(currentValues.courseShortDesc !== course.courseDescription){
                    formData.append("courseDescription", data.courseShortDesc)
                }
                if(currentValues.coursePrice !== course.price){
                    formData.append("price", data.coursePrice)
                }
                if(currentValues.courseTags !== course.tag){
                    formData.append("tag", data.courseTags)
                }
                if(currentValues.courseBenefits !== course.whatYouWillLearn){
                    formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if(currentValues.courseCategory._id !== course.category._id){
                    formData.append("category", data.courseCategory)
                }
                if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                    formData.append("instructions", JSON.stringify(data.courseRequirements))
                }
                if(currentValues.courseImage !== course.thumbnail){
                    formData.append("thumbnail", data.courseImage)
                }

                setLoading(true)
                const result = await editCourseDetails(formData, token)
                if(result){
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }
                setLoading(false)
            }else{
                toast.error("No changes made to the form")
            }
            return
        }

        console.log("Create course data - ", data)
        
        // create new course
        const formData = new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        setLoading(true)
        const result = await addCourseDetails(formData, token)
        console.log("TOKEN add Course", token)
        if(result){
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }
        setLoading(false)
        console.log("Create Course Result - ", result)
        console.log("Create Course FormData - ", formData)
    }

  return (
    <form
        onSubmit={handleSubmit(onSubmit)}
        className='rounded-md border-richblack-700 bg-richblack-800 space-y-8 p-6'
    >
        <div>
            <label htmlFor='courseTitle' className='text-sm text-richblack-5'>Course Title <sup className='text-pink-200'>*</sup></label>
            <input
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle", {required: true})}
                className='w-full form-style'
            />
            {
                errors.courseTitle && (
                    <span>Course title is required</span>
                )
            }
        </div>

        <div>
            <label htmlFor='courseShortDesc' className='text-sm text-richblack-5'>Course Short Description <sup className='text-pink-200'>*</sup></label>
            <textarea
                id='courseShortDesc'
                placeholder='Enter Description'
                {...register("courseShortDesc", {required: true})}
                className='w-full min-h-[140px] form-style'
            />
            {
                errors.courseShortDesc && (
                    <span>Course Description is required</span>
                )
            }
        </div>

        <div>
            <label htmlFor='coursePrice' className='text-sm text-richblack-5'>Course Price <sup className='text-pink-200'>*</sup></label>
            <div className='relative'>
                <input
                    id='coursePrice'
                    placeholder='Enter Course Title'
                    {...register("coursePrice", {
                        required: true,
                        valueAsNumber: true
                    })}
                    className='form-style w-full !pl-12'
                />
                <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            {
                errors.coursePrice && (
                    <span>Course price is required</span>
                )
            }
        </div>
        
        <div>
            <label htmlFor='courseCategory' className='text-sm text-richblack-5'>Course Category <sup className='text-pink-200'>*</sup></label>
            <select
                id='courseCategory'
                defaultValue=""
                {...register("courseCategory", {required: true})}
                className='w-full form-style'
            >
                <option value="" disabled>Choose a category</option>
                {
                    courseCategories.map((category, index) => (
                        <option key={index} value={category?._id}>
                            {category?.name}
                        </option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                    <psan>Course Category is required</psan>
                )
            }
        </div>
        
        {/* Create a custom component for handling tags */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter tags and press enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* create a component for uploading and showing thumbnail image */}
        <Upload
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course?.thumbnail : null}
      />

        {/* Benifits of the course */}
        <div>
            <label htmlFor='courseBenefits' className='text-sm text-richblack-5'>Course Benefits <sup className='text-pink-200'>*</sup></label>
            <textarea
                id='courseBenefits'
                placeholder='Enter Course Benefits'
                {...register("courseBenefits", {required: true})}
                className='w-full min-h-[140px] form-style'
            />
            {
                errors.courseBenefits && (
                    <span>Course Benefits is required</span>
                )
            }
        </div>

        {/* Requirement Field */}
        <RequirementField
            name="courseRequirements"
            id="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
        />

        <div className='flex justify-end gap-3'>
            {
                editCourse && (
                    <button
                        onClick={() => dispatch(setStep(2))}
                        className='flex items-center gap-x-2 bg-richblack-300 px-4 py-2 font-medium rounded-md text-white'
                    >
                        Continue without saving
                    </button>
                )
            }
            <IconBtn
                text={editCourse ? "Save Changes" : "Next"}
                type="submit"
            />
        </div>


    </form>
  )
}

export default CourseInformationForm
