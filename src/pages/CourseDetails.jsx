import React, { useEffect, useState } from 'react';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import getAverageRating from '../utils/getAvgRating';
import Error from './Error';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RatingStars from "../components/common/RatingStars";
import { formateDate } from '../services/formatDate';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';

const CourseDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.profile);
    const { paymentLoading } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);
    
    useEffect(() => {
        const getFullCourseDetails = async() => {
            try {
                const result = await fetchCourseDetails(courseId);
                setCourseData(result);
                console.log("CourseDetails : ", result);
            }
            catch(error) {
                console.log("Could not fetch course details");
            }
        }

        getFullCourseDetails();
    }, [courseId]);

    const [avgRatingCount, setAvgRatingCount] = useState(0);

    useEffect(() => {
        const count = getAverageRating(courseData?.data?.courseDetails[0]?.ratingAndReviews);
        setAvgRatingCount(count);
    }, [courseData]);

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        courseData?.data?.courseDetails[0]?.courseContent.forEach((section) => {
            lectures += section.subSection.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);

    const handleCourseBuy = () => {
        if(token){
            buyCourse([courseId], token, user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please log in, before purchasing course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        });
    }

    if(loading || !courseData){
        return (
            <div>Loading...</div>
        )
    }

    if(!courseData.success){
        return (
            <div>
                <Error/>
            </div>
        )
    }

    const {
        _id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt
    } = courseData?.data?.courseDetails[0];

  return (
    <div className="flex flex-col text-richblack-5">
        <div className="relative flex flex-col justify-start p-8">
            <p>{courseName}</p>
            <p>{courseDescription}</p>
            <div className="flex gap-x-2">
                <span>{avgRatingCount}</span>
                <RatingStars Review_Count={avgRatingCount} Star_Size={24}/>
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
            </div>

            <div>
                Created By {`${instructor.firstName} ${instructor.lastName}`}
            </div>

            <div className="flex gap-x-3">
                <p>Created At {formateDate(createdAt)}</p>
                <p>{" "} English</p>
            </div>

            <div>
                <CourseDetailsCard
                    course = {courseData?.data?.courseDetails[0]}
                    setConfirmationModal = {setConfirmationModal}
                    handleCourseBuy = {handleCourseBuy}
                />
            </div>
        </div>

        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default CourseDetails
