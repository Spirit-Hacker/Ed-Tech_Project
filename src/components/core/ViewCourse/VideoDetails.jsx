import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slice/viewCourseSlice';
import { Player } from 'video-react';
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from '../../common/IconBtn';
import "video-react/dist/video-react.css";

const VideoDetails = () => {

    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);
    const { token } = useSelector((state) => state.auth);
    const playerRef = useRef();

    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    console.log("LOCAL STORAGE: ", courseSectionData, courseEntireData, completedLectures);

    // video comes in a .mov format so we use following state to store the .mp4 format and use in the Player Component
    const [videoMp4, setVideoMp4] = useState(null);

    // console.log("COURSE SECTION DATA : ", courseSectionData);
    // console.log("COURSE ENTIRE DATA : ", courseEntireData);
    console.log("Video Link : ", videoData.videoUrl);
    
    useEffect(() => {
      
      const setVideoSpecificDetails = () => {
        if(!courseSectionData.length) return;

        if(!courseId && !sectionId && !subSectionId){
          navigate("/courses/enrolled-courses");
        }
        else{
          const filteredData = courseSectionData.filter((data) => data._id === sectionId);
          const filteredVideoData = filteredData[0].subSection.filter((data) => data._id === subSectionId);

          // converting .mov format link to .mp4
          const videoUrl = filteredVideoData[0].videoUrl.substr(0, filteredVideoData[0].videoUrl.length - 3) + "mp4";
          // console.log("VIDEO DATA: ", videoUrl);
          setVideoMp4(videoUrl);

          setVideoData(filteredVideoData[0]);
          setVideoEnded(false);
        }
      }

      setVideoSpecificDetails();

    }, [courseSectionData, courseEntireData, location.pathname]);

    const isFirstVideo = () => {
      const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

      if(currentSectionIndex === 0 && currentSubsectionIndex === 0) return true;
      else return false;
    }

    const isLastVideo = () => {
      const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

      const noOfSubsections = courseSectionData[currentSectionIndex].subSection.length;

      if(currentSectionIndex === (courseSectionData.length - 1) && currentSubsectionIndex === noOfSubsections - 1) return true;
      else return false;
    }

    const goToNextVideo = () => {
      const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

      const noOfSubsections = courseSectionData[currentSectionIndex].subSection.length;
      
      if(currentSubsectionIndex !== noOfSubsections - 1){
        // same section ke next subsection me jao
        const nextSubsectionId = courseSectionData[currentSectionIndex].subSection[currentSubsectionIndex + 1]._id;
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubsectionId}`);
      }
      else{
        // next section ke first subsection pe jao
        const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
        const nextSubsectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
        navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`);
      }
    }

    const goToPrevVideo = () => {
      const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

      if(currentSubsectionIndex !== 0){
        // same section ke prev subsection me jao
        const prevSubsectionId = courseSectionData[currentSectionIndex].subSection[currentSubsectionIndex - 1]._id;
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubsectionId}`);
      }
      else{
        // prev section ke last subsection pe jao
        const prevSubsectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;

        const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
        const prevSubsectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubsectionLength - 1]._id;
        navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubsectionId}`);
      }
    }

    const handleLectureCompletion = async() => {
      // TODO: write course progress controller in backend ✅

      setLoading(true);

      const response = await markLectureAsComplete({sectionId: sectionId, subSectionId: subSectionId, courseId: courseId}, token);
      if(response){
        dispatch(updateCompletedLectures(subSectionId));
      }

      setLoading(false);
    }

  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData 
        ? (<div>No Data Found</div>)
        : (
            <Player
              ref={playerRef}
              aspectRatio="16:9"
              playsInline
              onEnded={() => setVideoEnded(true)}
              src={videoMp4}
            >
              <AiFillPlayCircle position="center"/>
              {
                videoEnded && (
                  <div style={{
                          backgroundImage:
                            "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                        }}
                        className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                  >
                    {
                      !completedLectures.includes(subSectionId) && (
                        <IconBtn
                          disabled={loading}
                          onClick={() => handleLectureCompletion()}
                          text={!loading ? "Mark as completed" : "Loading..."}
                          customClasses="text-xl max-w-max px-4 mx-auto"
                        />
                      )
                    }

                    <IconBtn
                      disabled={loading}
                      text={"Rewatch"}
                      onClick={() => {
                        if(playerRef.current){
                          playerRef.current.seek(0);
                          setVideoEnded(false);
                        }
                      }}
                      customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                    />

                    <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                      {
                        !isFirstVideo() && (
                          <button
                            disabled={loading}
                            onClick={() => goToPrevVideo()}
                            className="blackButton"
                          >
                            Prev
                          </button>
                        )
                      }

                      {
                        !isLastVideo() && (
                          <button
                            disabled={loading}
                            onClick={() => goToNextVideo()}
                            className="blackButton"
                          >
                            Next
                          </button>
                        )
                      }
                    </div>
                  </div>
                )
              }

            </Player>
        )
      }
      
      <h1 className="mt-4 text-3xl font-semibold">
        {videoData.title}
      </h1>
      <p className="pt-2 pb-6">
        {videoData.description}
      </p>
    </div>
  )
}

export default VideoDetails
