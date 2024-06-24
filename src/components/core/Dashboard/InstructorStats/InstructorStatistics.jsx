import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorStats } from '../../../../services/operations/ProfileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const InstructorStatistics = () => {

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [instructorData, setInstructorData] = useState(null);

    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true);

            const instructorApiData = await getInstructorStats(token);
            const result = await fetchInstructorCourses(token);

            console.log("instructorApiData: ", instructorApiData);
            console.log("RESULT: ", result);

            if(instructorApiData.length){
                setInstructorData(instructorApiData);
            }
            if(result){
                setCourses(result);
            }

            setLoading(false);
        }

        getCourseDataWithStats();
    }, []);

    const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudents, 0);
    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalProfitGenerated, 0);

  return (
    <div className="text-white">
        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-richblack-5">Hi {user.firstName}</h1>
            <p className="font-medium text-richblack-200">Let's start something new</p>
        </div>

        {loading ? (<div className="spinner"></div>)
            : courses.length > 0
            ?
            (
                <div>
                    <div>
                        <div className="my-4 flex h-[450px] space-x-4">
                            <InstructorChart instructorStats={instructorData}/>
                            <div className="flex min-w-[250px] h-full flex-col rounded-md bg-richblack-800 p-6">
                                <p className="text-lg font-bold text-richblack-5">Statistics</p>

                               <div className="mt-4 space-y-4">
                                <div>
                                        <p className="text-lg text-richblack-200">Total Courses</p>
                                        <p className="text-3xl font-semibold text-richblack-50">{courses.length}</p>
                                    </div>

                                    <div>
                                        <p className="text-lg text-richblack-200">Total Students</p>
                                        <p className="text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                                    </div>

                                    <div>
                                        <p className="text-lg text-richblack-200">Total Income</p>
                                        <p className="text-3xl font-semibold text-richblack-50">{totalAmount}</p>
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-md bg-richblack-800 p-6 mt-4">
                        {/* Render 3 courses */}
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                            <Link
                                to={"/dashboard/my-courses"}
                            >
                                <p className="text-xs font-semibold text-yellow-50"> View All</p>
                            </Link>
                        </div>

                        <div className="my-4 flex items-start space-x-6">
                            {
                                courses.slice(0, 3).map((course) => (
                                    <div className="w-1/3">
                                        <img src={course.thumbnail} alt="thumbnail" className="h-[201px] w-full rounded-md object-cover"/>
                                        <div className="mt-3 w-full">
                                            <p className="text-sm font-medium text-richblack-50">{course.courseName}</p>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <p className="text-xs font-medium text-richblack-300">{course.studentsEnrolled.length} {" Students"}</p>
                                                <p className="text-xs font-medium text-richblack-300">{" | "}</p>
                                                <p className="text-xs font-medium text-richblack-300">{" Rs "}{course.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
            : 
            (
                <div>
                    <p>You have not created any courses</p>
                    <Link
                        to={`/dashboard/add-course`}
                    >
                        Create a course
                    </Link>
                </div>
            )
        }
    </div>
  )
}

export default InstructorStatistics;
