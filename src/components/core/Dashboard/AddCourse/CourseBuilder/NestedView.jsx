import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx"
import { MdModeEditOutline } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import { BiSolidDownArrow } from "react-icons/bi"
import { AiOutlinePlus } from "react-icons/ai"
import SubSectionModal from './SubSectionModal'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slice/courseSlice'

const NestedView = ({handleChangeEditSectionName}) => {

    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course)
    const dispatch = useDispatch()

    const [addSubsection, setAddSubsection] = useState(null)
    const [editSubsection, setEditSubsection] = useState(null)
    const [viewSubsection, setViewSubsection] = useState(null)

    const [confirmationModal, setConfirmationModal] = useState(null)

    const handleDeleteSection = async(sectionId) => {
      const result = await deleteSection({
        sectionId,
        courseId: course._id,
        token,
      });

      if(result){
        dispatch(setCourse(result));
      }
      setConfirmationModal(null);
    }

    const handleDeleteSubsection = async(subSectionId, sectionId) => {
      const result = await deleteSubSection({subSectionId, sectionId, token});
      if(result){
        const updatedCourseContent = course.courseContent.map((section) => {
          return section._id === sectionId ? result : section
        })
        const updatedCourse = {...course, courseContent: updatedCourseContent}
        dispatch(setCourse(updatedCourse));
      }
      setConfirmationModal(null);
    }

  return (
    <div>

      <div className='mt-10 rounded-lg bg-richblack-700 p-6 px-8'>
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>

            <summary className='flex items-center justify-between gap-x-3 border-b-[1px]'>
              <div className='flex items-center gap-x-3'>
                <RxDropdownMenu size={20}/>
                <p>{section.sectionName}</p>
              </div>
              <div className='flex items-center gap-x-3'>
                <button
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                >
                  <MdModeEditOutline/>
                </button>
                <button
                  onClick={() => setConfirmationModal({
                    text1: "Delete this section",
                    text2: "All the lectures in this section will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleteSection(section._id),
                    btn2Handler: () => setConfirmationModal(null)
                  })} 
                >
                  <RiDeleteBin6Line/>
                </button>
                <span>|</span>
                <button>
                  <BiSolidDownArrow className='text-[14px] text-richblack-200'/>
                </button>
              </div>
            </summary>

            <div>
              {
                section?.subSection.map((data) => (
                  <div 
                    key={data._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewSubsection(data)
                    }}
                    className='flex items-center justify-between gap-x-3 border-b-2'
                  >
                    <div className='flex items-center gap-x-3'>
                      <RxDropdownMenu/>
                      <p>{data.title}</p>
                    </div>

                    <div className='flex items-center gap-x-3'>
                      <button
                        className=''
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditSubsection({...data, sectionId: section._id})
                        }}
                      >
                        <MdModeEditOutline/>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmationModal({
                            text1: "Delete this section",
                            text2: "All the lectures in this section will be deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDeleteSubsection(data._id, section._id),
                            btn2Handler: () => setConfirmationModal(null)
                          })
                        }}
                      >
                        <RiDeleteBin6Line/>
                      </button>
                    </div>

                  </div>
                ))
              }
              <button
                onClick={() => setAddSubsection(section._id)}
                className='mt-4 flex items-center gap-x-2 text-yellow-50'
              >
                <AiOutlinePlus/>
                <p>Add Lecture</p>
              </button>
            </div>

          </details>
        ))}
      </div>
      
      {
        addSubsection ? (<SubSectionModal modalData={addSubsection} setModalData={setAddSubsection} add={true}/>)
        : viewSubsection ? (<SubSectionModal modalData={viewSubsection} setModalData={setViewSubsection} view={true}/>)
        : editSubsection ? (<SubSectionModal modalData={editSubsection} setModalData={setEditSubsection} edit={true}/>)
        : <div></div>
      }
      {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default NestedView
