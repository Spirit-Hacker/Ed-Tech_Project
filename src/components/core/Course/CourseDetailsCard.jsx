import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { addToCart } from '../../../slice/cartSlice';

const CourseDetailsCard = ({
    course,
    setConfirmationModal,
    handleCourseBuy
}) => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userAlreadyEnrolled, setUserAlreadyEnrolled] = useState(false);

    const {
        thumbnail,
        price
    } = course;

    useEffect(() => {
        const checkUserEnrolled = () => {
            console.log("USER : ", user);
            if(course.studentsEnrolled.includes(user._id)){
                setUserAlreadyEnrolled(true);
            }
            else{
                setUserAlreadyEnrolled(false);
            }
        }
        checkUserEnrolled();
    }, [course]);

    const handleAddToCart = () => {
        
    }

  return (
    <div>
        <img src = {thumbnail}/>
        <div>
            Rs. {price}
        </div>
        <div className="flex flex-col gap-y-2 items-start">
            <button
                onClick={user && userAlreadyEnrolled ? () => navigate("/dashboard/enrolled-courses") : handleCourseBuy}
            >
                {
                    user && userAlreadyEnrolled ? "Go To Course" : "Buy Course"
                }
            </button>

            {
                (!userAlreadyEnrolled && (
                    <button
                        onClick={handleAddToCart}
                    >Add To Cart</button>
                ))
            }
        </div>
    </div>
  )
}

export default CourseDetailsCard
