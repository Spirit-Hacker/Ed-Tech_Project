import React from 'react'
import RenderSteps from './RenderSteps'

const AddCourse = () => {
  return (
    <>
        <div className='text-white w-full flex gap-5'>
            <div className='w-[60%]'>
                <h1 className='text-3xl mb-16'>Add Course</h1>
                <div className='flex flex-col'>
                    <RenderSteps/>
                </div>
            </div>
            <div className='w-[30%] flex fixed right-5 flex-col gap-10 bg-richblack-800 border-[1px] rounded-md border-richblack-600 p-5 h-96'>
                <p>⚡Code Upload Tips</p>
                <ul className='list-disc pl-5 text-[12px] flex flex-col gap-3'>
                    <li>Set the Course Price option or make it free.</li>
                    <li>Standard size for the course thumbnail is 1024x576.</li>
                    <li>Video section controls the course overview video.</li>
                    <li>Course Builder is where you create & organize a course.</li>
                    <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
                    <li>Information from the Additional Data section shows up on the course single page.</li>
                    <li>Make Announcements to notify any important</li>
                    <li>Notes to all enrolled students at once.</li>
                </ul>
            </div>
        </div> 
    </>
  )
}

export default AddCourse
