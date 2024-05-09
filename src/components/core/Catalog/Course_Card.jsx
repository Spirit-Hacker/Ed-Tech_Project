import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import getAverageRating from '../../../utils/getAvgRating';

const Course_Card = ({
    course,
    height
}) => {

    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const count = getAverageRating(course?.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course]);

  return (
    <div>
        
        <Link to={`/courses/${course._id}`}>
            <div>
                <img src={course.thumbnail} alt="courseImage" className={`${height} w-full rounded-xl object-cover`} />
            </div>
            <div>
                <p>{course?.courseName}</p>
                <p>{`${course?.instructor?.firstName} ${course?.instructor?.lastName}`}</p>
                <div className="flex gap-x-3">
                    <span>{avgReviewCount}</span>
                    <RatingStars Review_Count={avgReviewCount} />
                    <span>{course?.ratingAndReviews?.length} Ratings</span>
                </div>
                <p>₹ {course?.price}</p>
            </div>
        </Link>

    </div>
  )
}

export default Course_Card
