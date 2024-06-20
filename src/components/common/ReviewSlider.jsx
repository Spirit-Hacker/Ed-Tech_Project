import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import { Autoplay, FreeMode, Navigation, Pagination } from "swiper";
import ReactStars from "react-rating-stars-component";
import { apiConnector } from '../../services/apiConnector';
import { ratingsEndpoints } from '../../services/apis';
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';

const ReviewSlider = () => {

    const [reviews, setReview] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
        const fetchAllReviews = async() => {
            const response = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API);
            console.log("Response: ", response);
            if(response.data.success) setReview(response.data.data);
        }

        fetchAllReviews();
    }, []);

    console.log("REVIEW: ", reviews);

    return (
        <div className="text-white w-full">
            <div className="h-[190px] max-w-maxContent w-full">
                <Swiper
                    slidesPerView={4}
                    loop={true}
                    spaceBetween={24}
                    freeMode={true}
                    autoplay={{
                        delay: 2500,
                    }}
                    className="w-full"
                >
                    {
                        reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={
                                        review.user.image 
                                        ? review.user.image
                                        : `https://api.dicebear.com/6.x/initials/svg?seed=${review.user.firstName}${review.user.lastName}`
                                    }
                                    className="h-9 w-9 object-cover rounded-full"
                                />
                                <p>{review.user.firstName} {review.user.lastName}</p>
                                <p>{review.course.courseName}</p>
                                <p>{review.review}</p>
                                <p>{review.rating.toFixed(1)}</p>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor={"#ffd700"}
                                    value={review.rating}
                                    emptyIcon={IoMdStar}
                                    fullIcon={IoMdStarOutline}
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default ReviewSlider
