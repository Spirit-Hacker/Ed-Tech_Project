import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slice/courseSlice'
import { RxCross1 } from 'react-icons/rx'
import Upload from '../Upload'
import IconBtn from '../../../../common/IconBtn'

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false
}) => {

    const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState: {errors}
    } = useForm()

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course)

    useEffect(() => {
      if(view || edit){
        setValue("lectureTitle", modalData.title)
        setValue("lectureDesc", modalData.description)
        setValue("lectureVideo", modalData.videoUrl)
      }
    }, [])

    const isFormUpdated = () => {
      const currentValues = getValues()
      if(
        currentValues.lectureTitle !== modalData.title
        || currentValues.lectureDesc !== modalData.description
        || currentValues.lectureVideo !== modalData.videoUrl
      ){
        return true
      }
      else{
        return false
      }
    }

    const handleEditSubSection = async() => {
      const currentValues = getValues()
      console.log("Form Values in edit sub section", currentValues)
      const formData = new FormData()

      formData.append("sectionId", modalData.sectionId)
      formData.append("subSectionId", modalData._id)

      if(currentValues.lectureTitle !== modalData.title){
        formData.append("title", currentValues.lectureTitle)
      }
      if(currentValues.lectureDesc !== modalData.description){
        formData.append("description", currentValues.lectureDesc)
      }
      formData.append("videoUrl", currentValues.lectureVideo)
      

      setLoading(true)

      // API call
      const result = await updateSubSection(formData, token)

      if(result){
        const updatedCourseContent = course.courseContent.map((section) => {
          return section._id === modalData.sectionId ? result : section
        })
        const updatedCourse = {...course, courseContent: updatedCourseContent}
        dispatch(setCourse(updatedCourse))
      }

      setModalData(null)
      setLoading(false)
    }

    const onSubmit = async(data) => {
      if(view){
        return
      }
      if(edit){
        if(isFormUpdated() === false){
          toast.error("No changes made in the sub section")
        }else{
          // edit sub section
          handleEditSubSection()
        }
        return
      }

      // add sub section
      const formData = new FormData()
      formData.append("sectionId", modalData)
      formData.append("title", data.lectureTitle)
      formData.append("description", data.lectureDesc)
      formData.append("videoUrl", data.lectureVideo)

      setLoading(true)

      // API call
      const result = await createSubSection(formData, token)

      if(result){
        const updatedCourseContent = course.courseContent.map((section) => {
          return section._id === modalData ? result : section
        })
        const updatedCourse = {...course, courseContent: updatedCourseContent}
        dispatch(setCourse(updatedCourse))
      }

      setModalData(null)
      setLoading(false)
    }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">

      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">

        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
          <button onClick={() => (!loading ? setModalData(null) : null)}>
            <RxCross1 className="text-2xl text-richblack-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          <Upload
            register={register}
            name={"lectureVideo"}
            label={"Lecture Video"}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          <div>
            <label className='lable-style'>Lecture Title</label>
            <input 
              type="text"
              {...register("lectureTitle", { required: true })}
              placeholder="Enter Lecture Title"
              id="lectureTitle"
              className='w-full form-style'
            />
            {
              errors.lectureTitle && (
                <span>
                  Lecture title is required
                </span>
              )
            }
          </div>

          <div>
            <label className='lable-style'>Lecture Description</label>
            <textarea
              id="lectureDesc"
              placeholder='Enter Lecture Description'
              {...register("lectureDesc", { required: true })}
              className='w-full min-h-[130px] form-style'
            />
            {
              errors.lectureDesc && (
                <span>Lecture description is required</span>
              )
            }
          </div>

          {
            !view && (
              <div>
                <IconBtn
                  text={loading ? "loading..." : edit ? "Save Changes" : "Save"}
                />
              </div>
            )
          }
          
        </form>

      </div>

    </div>
  )
}

export default SubSectionModal
