import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import BannerImage1 from '../assets/Images/aboutus1.webp'
import BannerImage2 from '../assets/Images/aboutus2.webp'
import BannerImage3 from '../assets/Images/aboutus3.webp'
import Quote from '../components/core/AboutPage/Quote'
import FoundingHistory from '../assets/Images/FoundingStory.png'
import StatsComponent from '../components/core/AboutPage/StatsComponent'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import Footer from '../components/common/Footer'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import ReviewSlider from '../components/common/ReviewSlider'

const About = () => {
  return (
    <div className='text-white'>
      {/* Section 1 */}
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Innovation in Online Education for a
            <HighlightText text={"Brighter Future"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <img src={BannerImage1} alt="" />
            <img src={BannerImage2} alt="" />
            <img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      <div className='text-white w-11/12 mx-auto mt-14'>
        {/* Section 2 */}
        <section className='pt-[100px]'>
          <div>
            <Quote/>
          </div>
        </section>
        
        {/* Section 3 */}
        <section className='w-[100vw] mb-24'>
          <div className='flex flex-col gap-40 w-full'>
            {/* Founding story */}
            <div className='flex flex-row justify-between items-center gap-10 w-11/12'>
              {/* Founding Story left box */}
              <div className='w-[50%] flex flex-col gap-12'>
                <h1 className='text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ec1aad] via-[#fa2307] to-[#ff6924]'>
                  Our Founding Story
                </h1>
                <p className='text-richblack-400 font-semibold'>
                  Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                </p>
                <p className='text-richblack-400 font-semibold'>
                  As experienced educators ourselves, we witnessed firsthand the limitations and  challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                </p>
              </div>

              {/* Founding Story right box */}
              <div className='shadow-[10px_0px_50px_5px] shadow-[#fa0795]'>
                <img src={FoundingHistory} alt='foundingstory' />
              </div>
            </div>

            {/* vision and mission */}
            <div className='flex flex-row justify-between items-center gap-52 w-11/12'>
              {/* left box */}
              <div className='w-[50%] flex flex-col gap-12'>
                <h1 className='text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ec4b1a] via-[#fa4c07] to-[#ffc524]'>Our Vision</h1>
                <p className='text-richblack-400 font-semibold'>
                  With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                </p>
              </div>

              {/* right box */}
              <div className='w-[50%] flex flex-col gap-12'>
                <h1 className='text-4xl font-semibold'><HighlightText text={"Our Mission"}/></h1>
                <p className='text-richblack-400 font-semibold'>
                  Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 4 */}
      <StatsComponent/>

      {/* Section 5 */}
      <section className='w-11/12 mx-auto flex flex-col items-center justify-center mb-14'>
        <LearningGrid/>
        <ContactFormSection/>
      </section>

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

export default About
