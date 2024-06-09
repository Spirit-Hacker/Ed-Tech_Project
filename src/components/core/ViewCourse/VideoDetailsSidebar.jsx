import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

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
        <div className="text-white">
            {/* for buttons and headings */}
            <div>
                {/* for buttons */}
                <div>
                    <div
                        onClick={() => navigate("/dashboard/enrolled-courses")}
                    >
                        Back
                    </div>

                    <IconBtn
                        text={"Add Review"}
                        onClick={() => setReviewModal(true)}
                    />
                </div>

                {/* for heading and title */}
                <div>
                    <p>{courseEntireData.courseName}</p>
                    <p>{completedLectures.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* section and subSection */}
            <div>
                {
                    courseSectionData?.map((section, index) => (
                        <div
                            onClick={() => setActiveStatus(section._id)}
                            key={index}
                        >
                            {/* section */}
                            <div>
                                <div>{section?.sectionName}</div>
                            </div>

                            {/* subSection */}
                            <div>
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
