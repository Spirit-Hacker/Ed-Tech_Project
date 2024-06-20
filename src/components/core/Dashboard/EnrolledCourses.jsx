import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/ProfileAPI'
import ProgressBar from '@ramonak/react-progress-bar'
import { useNavigate } from 'react-router-dom'

const EnrolledCourses = () => {

    const { token } = useSelector((state) => state.auth)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const navigate = useNavigate();

    const getEnrolledCourses = async() => {
        try {
            const responce = await getUserEnrolledCourses(token)
            setEnrolledCourses(responce)
            console.log("RESPONSE : ", responce)
        } catch (error) {
            console.log("Unable to fetch enrolled courses")
        }
    }

    useEffect(() => {
        getEnrolledCourses()
    }, 
    // eslint-disable-next-line
    [])

  return (
    <div className='text-white flex flex-col w-full'>
        <div className='mb-14 text-3xl font-medium text-richblack-50'>Enrolled Courses</div>
        {
            !enrolledCourses 
            ? (<div>Loading...</div>)
            : enrolledCourses.length === 0 
            ? (<p className="grid h-[10vh] w-full place-content-center text-richblack-5">You have not enrolled in any course yet</p>)
            : (
                <div className="my-8 text-richblack-5">
                    <div className="flex rounded-t-lg bg-richblack-500">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3">Duration</p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>
                    {/* enrolledCourses start here */}
                    {
                        enrolledCourses.map((course, index, arr) => (
                            <div className={`flex items-center border border-richblack-700 ${
                                index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                            }`} key={index}>
                                <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                    onClick={() => {
                                    navigate(
                                        `/view-course/${course?._id}/section/${course.courseContent[0]?._id}/sub-section/${course.courseContent[0]?.subSection[0]?._id}`
                                    )
                                }}>
                                    <img src={course?.thumbnail} alt='course' className="h-14 w-14 rounded-lg object-cover"/>
                                    <div className="flex max-w-xs flex-col gap-2">
                                        <p className="font-semibold">{course?.courseName}</p>
                                        <p className="text-xs text-richblack-300">{course?.courseDescription}</p>
                                    </div>
                                </div>

                                <div className="w-1/4 px-2 py-3">
                                    {course?.timeDuration}
                                </div>

                                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                    <p>Progress: {course?.courseProgressPercentage || 0}</p>
                                    <ProgressBar
                                        completed={course?.courseProgressPercentage || 0}
                                        height="10px"
                                        isLabelVisible={false}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }
    </div>
  )
}

export default EnrolledCourses
