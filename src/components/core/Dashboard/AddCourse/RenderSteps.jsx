import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import CourseInformationForm from './CourseInformation/CourseInformationForm'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'
import PublishCourse from './PublishCourse/PublishCourse'

const RenderSteps = () => {

    const { step } = useSelector((state) => state.course)

    const steps = [
        {
            id: 1,
            title: "Course Information",
        },
        {
            id: 2,
            title: "Course Builder",
        },
        {
            id: 3,
            title: "Publish",
        }
    ]

  return (
    <>
        <div className='relative mb-2 flex w-full justify-center'>
            {
                steps.map( (item) => (
                    <>
                        <div>
                            <div className={`grid aspect-square w-[34px] place-items-center rounded-full border-[1px] ${step === item.id 
                                ? "bg-yellow-900 text-yellow-50 border-yellow-50 border-2" 
                                : "bg-richblack-800 text-richblack-400 border-richblack-700 border-2"}
                                ${step > item.id && "bg-yellow-50"}`}>
                                {
                                    step > item.id ? (<FaCheck className="font-bold text-richblack-900"/>) : (item.id)
                                }
                            </div>
                        </div>
                        {/* Add code for dashes and labels */}
                        {item.id !== steps.length &&
                            (<>
                                <div
                                    className={`h-[17px] border-dashed border-b-2 w-[33%]
                                    ${step > item.id ? "border-yellow-50" : "border-richblack-700"}`}
                                ></div>
                            </>)
                        }
                    </>
                ))
            }
        </div>
        <div className='relative mb-16 flex w-full select-none justify-between'>
            {
                steps.map( (item) => (
                    <>
                        <div className='flex min-w-[130px] flex-col items-center gap-y-2'>
                            <p className={`text-sm ${
                            step >= item.id ? "text-richblack-5" : "text-richblack-500"
                            }`}>{item.title}</p>
                        </div>
                    </>
                ))
            }
        </div>
        {step === 1 && <CourseInformationForm/>}
        {step === 2 && <CourseBuilderForm/>}
        {step === 3 && <PublishCourse/>}
    </>
  )
}

export default RenderSteps
