import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from "react-icons/fa"
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/CTAButton'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from '../components/core/HomePage/TimelineSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import ReviewSlider from '../components/common/ReviewSlider'

const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center
            text-white justify-between">
            <Link to={"/signup"}>
                <div className="group mt-16 p-1 mx-auto rounded-full border-b-2 border-[#FFFFFF20] bg-richblack-800 font-bold text-richblack-200
                    transition-all duration-200 hover:scale-95 w-fit">

                    <div className="flex flex-row items-center gap-6 rounded-full px-10 py-[5px] transition-all duration-200
                        group-hover:bg-richblack-900">
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>

                </div>
            </Link>

            <div className="text-center text-4xl font-semibold mt-7">
                Empower Your Future with
                <HighlightText text="Coding Skills"/>
            </div>

            <div className="mt-4 w-[90%] text-center font-bold text-lg text-richblack-300">
                With our online coding courses, you can learn at your own pace, 
                from anywhere in the world, and get access to a wealth of resources, 
                including hands-on projects, quizzes, and personalized feedback 
                from instructors
            </div>

            <div className="flex flex-row mt-8 gap-7">
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>
            </div>

            <div className="mx-auto my-14 shadow-[10px_-5px_50px_-5px] shadow-blue-200 w-[99%] max-w-11/12">
                <video
                className='shadow-[20px_20px_rgba(255,255,255)]'
                muted
                autoPlay
                loop
                >
                    <source src={Banner} type='video/mp4'/>
                </video>
            </div>

            {/* code section 1 */}
            <div>
                <CodeBlocks
                    position={`lg: flex-row`}
                    heading={
                        <div className="text-4xl font-semibold">
                            Unlock your
                            <HighlightText text={"coding potential "}/>
                            with our online courses.
                        </div>
                    }
                    subheading={
                        `Our courses are designed and taught by industry experts who have years
                        of experience in coding and are passionate about sharing their knowledge
                        with you.`
                    }
                    ctabtn1={
                        {
                            btnText: "Try it yourself",
                            linkto: "/signup",
                            active: true
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn more",
                            linkto: "/login",
                            active: false
                        }
                    }
                    codeblock={
                        `<<!DOCTYPE html>>
                        <html>
                            <head>
                                <title>Example</title>
                                <linkrel="stylesheet"href="styles.css">
                            </head>
                        <body>
                            <h1>
                                <a href="/">Header</a>
                            </h1>
                        <body/>`
                    }
                    codeColor={"text-yellow-25"}
                    backgroundGradient={
                        <div className='codeblock1 absolute'></div>
                    }
                />
            </div>

            {/* code section 2 */}
            <div>
                <CodeBlocks
                    position={"lg: flex-row-reverse"}
                    heading={
                        <div className="text-4xl font-semibold">
                            Start
                            <HighlightText text={"coding in seconds"}/>
                        </div>
                    }
                    subheading={
                        `Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.`
                    }
                    ctabtn1={
                        {
                            btnText: "Continue lesson",
                            linkto: "/signup",
                            active: true
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn more",
                            linkto: "/login",
                            active: false
                        }
                    }
                    codeblock={
                        `<<!DOCTYPE html>>
                        <html>
                            <head>
                                <title>Example</title>
                                <linkrel="stylesheet"href="styles.css">
                            </head>
                        <body>
                            <h1>
                                <a href="/">Header</a>
                            </h1>
                        <body/>`
                    }
                    codeColor={"text-pink-100"}
                    backgroundGradient={
                        <div className='codeblock2 absolute'></div>
                    }
                />
            </div>

            <ExploreMore/>
        </div>

        <div className='block lg:h-[30px]'></div>

        {/* Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700 pb-10 pt-10'>
            <div className='homepage_bg h-[310px]'>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center 
                    justify-between gap-7'>

                    <div className='h-[100px]'></div>
                    <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={'/signup'}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={'/login'}>
                            <div className='flex items-center gap-3'>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center 
                justify-between gap-7'>
                
                <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                    <div className='text-4xl font-semibold w-[50%]'>
                        Get the skills you need for a
                        <HighlightText text={"job that is in demand"}/>
                    </div>

                    <div className='flex flex-col gap-10 w-[50%] items-start'>
                        <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a 
                            competitive specialist requires more than professional skills.
                        </div>

                        <CTAButton active={true} linkto={'/signup'}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>


                <TimelineSection/>

                <LearningLanguageSection/>
            </div>

        </div>


        {/* Section 3 */}
        <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center
            justify-between gap-8 text-white bg-richblack-900 mb-10'>

            <InstructorSection/>

            <h2 className='text-center text-4xl font-semibold mt-10'>
                Reviews from other learners
            </h2>

            {/* Review slider here */}
            <ReviewSlider/>
        </div>

        {/* Footer */}
        <Footer/>
    </div>
  )
}

export default Home
