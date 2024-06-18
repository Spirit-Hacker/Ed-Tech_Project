import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import { useParams } from "react-router-dom";

const CourseReviewModal = ({setReviewModal}) => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseId } = useParams();
    console.log("COURSE ID : ", courseId);

    const {
      register,
      handleSubmit,
      setValue,
      formState: {errors}
    } = useForm();

    useEffect(() => {
      setValue("courseExperience", "");
      setValue("courseRating", 0);
    }, []);

    const ratingChanged = (newRating) => {
      setValue("courseRating", newRating);
    }

    const onSubmit = async(data) => {
      // console.log("DATA : ", data)
      await createRating(
        {
          courseId: courseId,
          rating: data.courseRating,
          review: data.courseExperience
        },
        token
      );

      setReviewModal(false);
    }

  return (
    <div className="text-richblack-5">
      <div>
        {/* Modal Header */}
        <div>
          <p>Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div>
          
          <div>
            <img
              src={user.image}
              alt="user image"
              className="aspect-square w-[50px] object-cover rounded-full"
            />

            <div>
              <p>{`${user.firstName} ${user.lastName}`}</p>
              <p>Posting Publicly</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center mt-6"
            >

              <ReactStars
                count={5}
                size={24}
                activeColor="#ffd700"
                onChange={ratingChanged}
              />

              <div className="flex flex-col gap-y-2 items-center">

                <label htmlFor="courseExperience" className="lable-style">
                  Add Your Experience <span className="text-pink-100">*</span>
                </label>

                <textarea
                  id="courseExperience"
                  placeholder="Add Your Experience here"
                  {...register("courseExperience", {required: true})}
                  className="form-style w-full min-h-[130px]"
                />

                {
                  errors.courseExperience && (
                    <span>Please add your experience</span>
                  )
                }
              </div>
              
              {/* Save and Cancel button */}
              <div className="flex gap-x-4 items-center justify-center pt-4">
                <button 
                  onClick={() => setReviewModal(false)}
                  className="bg-richblack-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>

                <IconBtn
                  text={"Save"}
                  type={"submit"}
                />
              </div>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
