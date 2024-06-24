import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../slice/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { useNavigate } from 'react-router-dom';

const PublishCourse = () => {

    const {register, handleSubmit, setValue, getValues} = useForm();
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public", true);
        }
    }, []);

    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses")
    }

    const handlePublishCourse = async() => {
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true)
        || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)){
            // no updations in the form
            goToCourses();
            return;
        }
        
        // if form updated
        const formData = new FormData();
        formData.append("courseId", course._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status", courseStatus);

        // api call
        setLoading(true);
        const result = await editCourseDetails(formData, token);

        if(result){
            goToCourses();
        }

        setLoading(false);
    }

    const onSubmit = () => {
        handlePublishCourse();
    }

  return (
    <div className="rounded-md border-[1px] bg-richblack-800 border-richblack-700 p-6">
        <p>Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>

            <div>
                <label htmlFor="public">
                    <input
                        type="checkbox"
                        id="public"
                        {...register("public")}
                        className="rounded h-4 w-4"
                    />
                    <span className="ml-3">
                        Make this course public
                    </span>
                </label>
            </div>

            <div className="flex justify-end gap-x-3">
                <button
                    disabled={loading}
                    type="button"
                    className="flex items-center rounded-md px-4 py-2 bg-richblack-700"
                    onClick={() => goBack()}
                >
                    Back
                </button>
                <IconBtn disabled={loading} text={"Save Changes"}/>
            </div>

        </form>
    </div>
  )
}

export default PublishCourse
