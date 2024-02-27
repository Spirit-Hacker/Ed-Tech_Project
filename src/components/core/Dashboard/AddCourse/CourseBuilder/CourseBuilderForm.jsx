import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from "../../../../common/IconBtn"
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { setCourse, setEditCourse, setStep } from '../../../../../slice/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {
  
  const [editSectionName, setEditSectionName] = useState(null)
  const { course } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  const {
    register, 
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }
  
  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please add atleast one section")
      return;
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please add atleast one sub-section/lecture")
      return;
    }

    // if everything is good
    dispatch(setStep(3))
  }

  const onSubmit = async(data) => {
    // init loader
    setLoading(true);
    let result;

    if(editSectionName){
      // we are editing the section
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id
      }, token)

    }else{
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id
      }, token)
    }

    // update value
    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }

    // remove loader
    setLoading(false)
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if(editSectionName === sectionId){
      cancelEdit()
      return
    }

    setValue("sectionName", sectionName)
    setEditSectionName(sectionId)
  }
  return (
    <div className='text-white'>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='sectionName' className='lable-style'>Section Name <sup className='text-pink-200'>*</sup></label>
          <input
            type="text"
            id="sectionName"
            placeholder="Add a section name"
            {...register("sectionName", { required: true })}
            className='w-full form-style'
          />
          {
            errors.sectionName && (
              <span>Section name is required</span>
            )
          }
        </div>

        <div className='mt-10 flex gap-4'>
          <IconBtn
            type={"submit"}
            text={editSectionName ? "Edit Section" : "Create Section"}
            outline={true}
            customClasses={"text-white"}
          >
            <IoMdAddCircleOutline className='text-yellow-50' size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type='button'
              className='text-sm text-richblack-300 underline'
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course?.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
      )}

      <div className='flex justify-end w-full gap-x-4 mt-10'>
        <button
          onClick={goBack}
          className='rounded-md cursor-pointer flex items-center gap-x-3 bg-richblack-700 px-5'
        >
          <FaAngleLeft/>
          Back
        </button>

        <IconBtn
          text={"Next"}
          onClick={goToNext}
        >
          <FaAngleRight/>
        </IconBtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm
