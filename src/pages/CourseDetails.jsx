import React from 'react';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const CourseDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { courseId } = useParams();

    const handleCourseBuy = () => {
        buyCourse([courseId], token, user, navigate, dispatch);
        return;
    }

  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh]">
        <button className="bg-yellow-50 font-semibold py-2 px-4"
            onClick={() => handleCourseBuy()}
        >
            Buy Now
        </button>
    </div>
  )
}

export default CourseDetails
