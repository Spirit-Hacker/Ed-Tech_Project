import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { IoIosArrowBack } from "react-icons/io"

const VideoDetailsSidebar = ({setReviewModal}) => {

    const location = useLocation();
    const [activeStatus, setActiveStatus] = useState("");
    const [videobarActive, setVideobarActive] = useState("");
    const navigate = useNavigate();
    const { sectionId, subSectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        completedLectures,
        totalNoOfLectures
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        const setActiveFlags = () => {
            if(!courseSectionData.length) return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data?._id === sectionId
            );
            const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
                (data) => data?._id === subSectionId
            );
            const activeSubsectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubsectionIndex]?._id;

            // set current section
            setActiveStatus(courseSectionData[currentSectionIndex]?._id);

            // set current sub section
            setVideobarActive(activeSubsectionId);
        }
        setActiveFlags();
    }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            {/* for buttons and headings */}
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                {/* for buttons */}
                <div className="flex w-full items-center justify-between">
                    <div
                        onClick={() => navigate("/dashboard/enrolled-courses")}
                        className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                    >
                        <IoIosArrowBack size={30} />
                    </div>

                    <IconBtn
                        text={"Add Review"}
                        onClick={() => setReviewModal(true)}
                        customClasses="ml-auto"
                    />
                </div>

                {/* for heading and title */}
                <div className="flex flex-col">
                    <p>{courseEntireData.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500">{completedLectures.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* section and subSection */}
            <div lassName="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData?.map((section, index) => (
                        <div
                            onClick={() => setActiveStatus(section._id)}
                            key={index}
                            className="mt-2 cursor-pointer text-sm text-richblack-5"
                        >
                            {/* section */}
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">{section?.sectionName}</div>
                            </div>

                            {/* subSection */}
                            <div className="transition-[height] duration-500 ease-in-out">
                                {
                                    activeStatus === section._id && (
                                        section?.subSection.map((lecture, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-5 p-5 ${
                                                    lecture?._id === videobarActive 
                                                    ? "bg-yellow-50 text-richblack-900"
                                                    : "bg-richblack-900 text-white"
                                                }`}
                                                onClick={() => {
                                                    navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${lecture?._id}`)
                                                    setVideobarActive(lecture?._id)
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={completedLectures?.includes(lecture?._id)}
                                                    onChange={() => {}}
                                                />
                                                <span>{lecture?.title}</span>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar
