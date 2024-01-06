import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/ProfileAPI'
import ProgressBar from '@ramonak/react-progress-bar'

const EnrolledCourses = () => {

    const { token } = useSelector((state) => state.auth)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    const getEnrolledCourses = async() => {
        try {
            const responce = await getUserEnrolledCourses(token)
            setEnrolledCourses(responce)
        } catch (error) {
            console.log("Unable to fetch enrolled courses")
        }
    }

    useEffect(() => {
        getEnrolledCourses()
    }, [])

  return (
    <div className='text-white flex flex-col w-full'>
        <div className='mb-14 text-3xl font-medium text-richblack-50'>Enrolled Courses</div>
        {
            !enrolledCourses 
            ? (<div>Loading...</div>)
            : enrolledCourses.length === 0 
            ? (<div>You have not enrolled in any course yet</div>)
            : (
                <div>
                    <div>
                        <p>Course Name</p>
                        <p>Duration</p>
                        <p>Progress</p>
                    </div>
                    {/* enrolledCourses start here */}
                    {
                        enrolledCourses.map((course, index) => (
                            <div>
                                <div>
                                    <img src={course?.thumbnail} alt='course'/>
                                    <div>
                                        <p>{course?.courseName}</p>
                                        <p>{course?.courseDescription}</p>
                                    </div>
                                </div>

                                <div>
                                    {course?.totalDuration}
                                </div>

                                <div>
                                    <p>Progress: {course?.progressPercentage || 0}</p>
                                    <ProgressBar
                                        completed={course?.progressPercentage || 0}
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
