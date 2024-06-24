import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../slice/cartSlice';
import copy from "copy-to-clipboard";
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { BsFillCaretRightFill } from "react-icons/bs";
// import { FaShareSquare } from "react-icons/fa";

const CourseDetailsCard = ({
    course,
    setConfirmationModal,
    handleCourseBuy
}) => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail,
        price,
        instructions
    } = course;

    const newInstructions = JSON.parse(instructions);

    const handleAddToCart = () => {
        if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are an instructor, you cannot buy a course");
            return;
        }
        if(token){
            dispatch(addToCart(course));
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

    const handleShare = () => {
        copy(window.location.href);
        toast.success("Copied to clipboard");
    }

  return (
    <>
        <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
            <img src = {thumbnail} alt="thumbnail" className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"/>
            <div className="space-x-3 pb-4 text-3xl font-semibold">
                Rs. {price}
            </div>
            <div className="px-4">
                <div className="flex flex-col gap-4">
                    <button
                        onClick={user && course.studentsEnrolled.includes(user._id) ? () => navigate("/dashboard/enrolled-courses") : handleCourseBuy}
                        className = "bg-yellow-50 w-fit text-richblack-900 font-semibold px-4 py-2 rounded-sm"
                    >
                        {
                            user && course.studentsEnrolled.includes(user._id) ? "Go To Course" : "Buy Course"
                        }
                    </button>

                    {
                        (user && !course.studentsEnrolled.includes(user._id) && (
                            <button
                                onClick={handleAddToCart}
                                className = "bg-richblack-500 w-fit text-richblack-5 px-4 py-2 font-semibold rounded-sm"
                            >
                                Add To Cart
                            </button>
                        ))
                    }
                </div>

                <div>
                    <p className="pb-3 pt-6 text-center text-sm text-richblack-25">30 Days Money Back Guarantee</p>
                </div>

                <div>
                    <p className={`my-2 text-xl font-semibold `}>This Course Includes:</p>
                    <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                        {
                            newInstructions.length > 0 && (
                                newInstructions.map((item, index) => (
                                    <p key={index} className="flex gap-2">
                                        <BsFillCaretRightFill />
                                        <span>{item}</span>
                                    </p>
                                ))
                            )
                        }
                    </div>
                </div>

                <div className="text-center">
                    <button
                        className="flex items-center mx-auto text-yellow-50 p-6 gap-2"
                        onClick={handleShare}
                    >
                        Share
                    </button>
                </div>
            </div>
        </div>
    </>
  )
}

export default CourseDetailsCard
