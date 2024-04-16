import {React, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { getAllCourses, getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slice/courseSlice';
import RenderSteps from '../AddCourse/RenderSteps';

const EditCourse = () => {

    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);

    useEffect(() => {
        const populateCourseDetails = async() => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            console.log("EDIT COURSE FE: ", result?.courseDetails[0])
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result?.courseDetails[0]));
            }
            setLoading(false);
        }

        populateCourseDetails();
    }, []);

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }

  return (
    <div className='text-richblack-5'>
        <h1>Edit Course</h1>
        <div>
            {
                course ? (<RenderSteps/>) : (<p>Course Not Found</p>)
            }
        </div>
    </div>
  )
}

export default EditCourse
