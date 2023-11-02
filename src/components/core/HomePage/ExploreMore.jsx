import React, { useState } from 'react'
import { HomePageExplore } from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter( (course) => course.tag === value);
        // console.log(result);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div className='relative w-[100%]'>
        <div className='font-semibold text-4xl text-center'>
            Unlock the
            <HighlightText text={"Power of code"}/>
        </div>

        <p className='text-center text-richblack-300 text-lg text-[16px] mt-3'>
            Learn to Build Anything You Can Imagine
        </p>

        <div className='w-[100%] flex flex-row justify-center'>
            <div className='flex flex-row my-5 rounded-full bg-richblack-800 py-1 px-1 gap-2'>
                {
                    tabsName.map((element, index) => {
                        return (
                            <div key={index}
                                className={`text-[16px] flex flex-row items-center gap-2
                                ${currentTab === element 
                                ? "bg-richblack-900 text-richblack-5 font-medium"
                                : "text-richblack-200"} rounded-full transition-all duration-200
                                cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-6
                                py-2`}
                                onClick={() => setMyCards(element)}
                                >
                                
                                {element}
                            </div>
                        )
                    })
                }
            </div>
        </div>

        <div className='block lg:h-[200px]'></div>

        {/* course card ka group */}
        <div className='lg:absolute gap-10 justify-center flex flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
            <div className='flex gap-10 justify-center'>
            {
                courses.map( (element, index) => {
                    return(
                        <CourseCard
                            key={index}
                            cardData={element}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    )
                })
            }
            </div>
        </div>
        
    </div>
    
  )
}

export default ExploreMore
