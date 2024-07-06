import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import Course_Card from './Course_Card';
import CourseCard from './Course_Card';

const CourseSlider = ({courses}) => {
  return (
    <>
        {
            courses?.length > 0 ?
            (<div>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={true}
                    // modules={[FreeMode, Pagination]}
                    breakpoints={{
                        1024: {
                        slidesPerView: 3,
                        },
                    }}
                    className="max-h-[30rem]"
                >
                    {
                        courses.map((course, index) => (
                            <SwiperSlide key = {index}>
                                <CourseCard course={course} height={"h-[250px]"}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>) : (<p className="text-xl text-richblack-5">{`No Course Found`}</p>)
        }
    </>
  )
}

export default CourseSlider
