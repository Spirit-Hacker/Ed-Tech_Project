import React from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { FooterLink2 } from "../../data/footer-links"

const Resources = [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
]

const BottomFooter = [
    "Privacy Policy",
    "Cookie Policy",
    "Terms",
]

const Footer = () => {
  return (
    <div className='bg-richblack-800'>

        {/* upper footer */}
        <div className='flex flex-row bg-richblack-800 text-white pt-[50px] mx-auto mb-5'>

            {/* left side */}
            <div className='flex flex-row w-[50%] justify-evenly border-r-[1px] border-richblack-700'>
                <div className='flex flex-row justify-between'>
                    <div>
                        <div className='mb-7'>
                            <img src={logo} alt="logo" />
                        </div>

                        <div className='flex flex-col gap-3 text-richblack-25 font-semibold'>
                            Company
                            <div className='text-richblack-300'>
                                {
                                    ["About", "Careers", "Affilates"].map((ele, index)=>{
                                        return(
                                            <Link to={ele.toLowerCase()}>
                                                <div key={index} className='mb-4 text-sm font-light max-w-maxContent hover:text-richblack-25 cursor-pointer duration-200'>
                                                    {ele}
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='flex flex-row gap-3 text-richblack-400 text-[20px] mt-2'>
                            <FaGoogle/>
                            <FaFacebook/>
                            <FaTwitter/>
                            <FaYoutube/>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3 font-semibold text-richblack-25'>
                    Resources
                    <div className='mb-2 text-richblack-300 font-light'>
                        {
                            Resources.map((ele, index) => {
                                return(
                                    <Link to={ele.toLowerCase().split(" ").join("-")}>
                                        <div key={index} className='text-sm mb-4 max-w-maxContent hover:text-richblack-25 cursor-pointer duration-200'>
                                            {ele}
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>

                    Support
                    <Link to={'/help-center'}>
                        <span className='text-sm text-richblack-400 font-light hover:text-richblack-25 cursor-pointer duration-200'>
                            Help Center
                        </span>
                    </Link>
                </div>

                <div className='flex flex-col gap-3 font-semibold text-richblack-25'>
                    Plans
                    <div className='text-richblack-300 font-light'>
                        {
                            ["Paid memberships", "For students", "Business solutions"]
                            .map((ele, index) => {
                                return(
                                    <Link to={ele.toLowerCase().split(" ").join("-")}>
                                        <div key={index} className='text-sm mb-4 max-w-maxContent hover:text-richblack-25 cursor-pointer duration-200'>
                                            {ele}
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>

                    Community
                    <div className='text-richblack-300 font-light'>
                        {
                            ["Forums", "Chapters", "Events"]
                            .map((ele, index) => {
                                return(
                                    <Link to={ele.toLowerCase()}>
                                        <div key={index} className='text-sm mb-4 max-w-maxContent hover:text-richblack-25 cursor-pointer duration-200'>
                                            {ele}
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>

            </div>

            {/* right side */}
            <div className='w-[50%] flex flex-row justify-evenly'>
                <div className='flex flex-row justify-between w-[80%]'>
                    {
                        FooterLink2.map((ele, index) => {
                            return(
                                <div key={index} className='flex flex-col gap-5'>
                                    <div className='font-semibold text-richblack-25'>
                                        {ele.title}
                                    </div>
                                    <div className='text-richblack-300'>
                                        {
                                            ele.links.map((link, index) => {
                                                return(
                                                    <Link to={link.link}>
                                                        <div key={index} className='text-sm mb-4 max-w-maxContent hover:text-richblack-25 cursor-pointer duration-200'>
                                                            {link.title}
                                                        </div>
                                                    </Link>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>

        </div>

        {/* bottom footer */}
        <div className='flex flex-row items-center justify-between border-t-[1px] border-richblack-700 p-6 ml-10 mr-14 text-white'>
            <div className='flex flex-row text-center items-center text-richblack-300 text-sm gap-6'>
                {
                    BottomFooter.map((ele, index) => {
                        return(
                            <div key={index} className={`${(index === 0 || index === 1) ? "border-r-[1px] border-richblack-700 pr-7" : ""} cursor-pointer hover:text-richblack-25 duration-200`}>
                                {ele}
                            </div>
                        )
                    })
                }
            </div>
            <div className='text-richblack-300 text-sm'>
                Made with ❤️ by Pranil Dhutraj © {new Date(Date.now()).getFullYear()} StudyNotion
            </div>
        </div>

    </div>
  )
}

export default Footer
