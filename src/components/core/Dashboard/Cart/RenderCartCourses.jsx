import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-rating-stars-component'
import { IoMdStar } from "react-icons/io";
import { IoMdStarOutline } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from '../../../../slice/cartSlice';

const RenderCartCourses = () => {

    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

  return (
    <div>
        {
            cart.map((course, index) => (
                <div key={index}>
                    <div>
                        <img src={course?.thumbnail} alt="course thumbnail" />
                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>4.8</span>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor={"#ffd700"}
                                    emptyIcon={IoMdStar}
                                    fullIcon={IoMdStarOutline}
                                />
                                <span>{course?.ratingAndReviews.length} Ratings</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => dispatch(removeFromCart(course._id))}
                        >
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>

                        <p>{course?.price}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses
