import React from 'react'
import { IoChatbubblesSharp } from "react-icons/io5";
import { FaEarthAmericas } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import ContactForm from '../components/ContactPage/ContactForm';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';

const Contact = () => {
  return (
    <div>
        <div className='w-11/12 mx-auto mt-20 gap-10 flex justify-center items-start mb-14'>
            <div className='text-white flex flex-col gap-10 bg-richblack-800 rounded-3xl w-[50%] p-10'>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-3 items-center justify-start'>
                        <div className='text-richblack-300 text-2xl'>
                            <IoChatbubblesSharp/>
                        </div>
                        <p className='font-semibold text-xl'>Chat on us</p>
                    </div>
                    <div className='text-sm text-richblack-300 font-semibold'>
                        <p>Our friendly team is here to help.</p>
                        <p>info@studynotion.com</p>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-3 items-center justify-start'>
                        <div className='text-richblack-300 text-2xl'>
                            <FaEarthAmericas/>
                        </div>
                        <p className='font-semibold text-xl'>Visit us</p>
                    </div>
                    <div className='text-sm text-richblack-300 font-semibold'>
                        <p>Come and say hello at our office HQ.</p>
                        <p>Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-3 items-center justify-start'>
                        <div className='text-richblack-300 text-2xl'>
                            <BsFillTelephoneFill/>
                        </div>
                        <p className='font-semibold text-xl'>Call us</p>
                    </div>
                    <div className='text-sm text-richblack-300 font-semibold'>
                        <p>Mon - Fri From 8am to 5pm</p>
                        <p>+123 456 7869</p>
                    </div>
                </div>
            </div>

            <div className='text-white border border-richblack-500 p-10 w-[75%] rounded-3xl'>
                <div className='flex flex-col items-start mx-auto gap-4 w-full'>
                    <h1 className='text-4xl font-semibold'>Got a Idea? We've got the skills. Let's team up</h1>
                    <p className='text-richblack-400'>
                        Tell us more about yourself and what you're got in mind.
                    </p>
                    <div className='pt-8 w-full'>
                        <ContactForm/>
                    </div>
                </div>
            </div>
        </div>

        <section className='mx-auto w-11/12 flex items-center justify-center'>
            <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl font-semibold mt-8">
                Reviews from other learners
                </h1>
            <ReviewSlider />
        </div>
        </section>

        <Footer/>
    </div>
  )
}

export default Contact
