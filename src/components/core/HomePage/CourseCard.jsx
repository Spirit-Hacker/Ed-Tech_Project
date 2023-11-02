import React from 'react'

const CourseCard = ({key, cardData, currentCard, setCurrentCard}) => {
  return (
    <div className='h-[100%]'>
        <div key={key} className={`flex flex-col justify-between h-[100%] p-7 
        gap-10
        ${currentCard === cardData.heading 
        ? "bg-richblack-5 shadow-[10px_10px_yellow]"
        :"bg-richblack-800"} cursor-pointer`}
        onClick={() => setCurrentCard(cardData.heading)}
        >
            {/* {console.log(cardData.heading)} */}
            <div className='flex flex-col justify-start gap-3'>
                <div className={`text-2xl font-semibold 
                ${currentCard === cardData.heading
                ?"text-richblack-800":"text-richblack-25"}`}>
                    {cardData.heading}
                </div>

                <div className='text-richblack-400'>
                    {cardData.description}
                </div>
            </div>

            <div className={`flex flex-row justify-between pt-3  border-t-2 border-dashed
            ${currentCard === cardData.heading
                ?"text-blue-300 border-blue-300":"text-richblack-400 border-richblack-400"}`}
            >
                <div>
                    {cardData.level}
                </div>
                <div>
                    {cardData.lessionNumber} lessons
                </div>
            </div>

        </div>
    </div>
  )
}

export default CourseCard
