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
        }

        setCourseDetails();
    }, []);

  return (
    <>
        <div>
            <VideoDetailsSidebar setReviewModal = {setReviewModal}/>

            <div>
                <Outlet/>
            </div>
        </div>

        {reviewModal && <CourseReviewModal setReviewModal = {setReviewModal}/>}
    </>
  )
}

export default ViewCourse
