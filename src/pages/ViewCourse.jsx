import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slice/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {

    const [reviewModal, setReviewModal] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { courseId } = useParams();
    const dispatch = useDispatch();

    // console.log("Whats in the useParams hook : ", useParams());
    console.log("Printing token in view course : ", token);

    useEffect(() => {
        const setCourseDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            console.log("setCourseDetails : ", courseData);
            dispatch(setCourseSectionData(courseData?.courseDetails[0]?.courseContent));
            dispatch(setEntireCourseData(courseData?.courseDetails[0]));
            dispatch(setCompletedLectures(courseData?.completedVideos));

            let lectures = 0;
            courseData?.courseDetails[0]?.courseContent.forEach((section) => {
                lectures += section?.subSection.length;
            });

            dispatch(setTotalNoOfLectures(lectures));

            localStorage.setItem("courseSectionData", JSON.stringify(courseData?.courseDetails[0]?.courseContent));
            localStorage.setItem("entireCourseData", JSON.stringify(courseData?.courseDetails[0]));
            localStorage.setItem("completedLectures", JSON.stringify(courseData?.completedVideos));
            localStorage.setItem("totalNoOfLectures", JSON.stringify(lectures));
        }

        setCourseDetails();
    }, []);

  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal = {setReviewModal}/>

            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6">
                    <Outlet />
                </div>
            </div>
        </div>

        {reviewModal && <CourseReviewModal setReviewModal = {setReviewModal}/>}
    </>
  )
}

export default ViewCourse
