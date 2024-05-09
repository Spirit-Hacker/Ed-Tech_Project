import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Course_Card from './Course_Card';

const CourseSlider = ({courses}) => {
  return (
    <React.Fragment>
        {
            courses?.length > 0 ?
            (<div>
                <Swiper>
                    {
                        courses.map((course, index) => (
                            <SwiperSlide key = {index}>
                                <Course_Card course = {course} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>) : (<p>{`No Course Found`}</p>)
        }
    </React.Fragment>
  )
}

export default CourseSlider
