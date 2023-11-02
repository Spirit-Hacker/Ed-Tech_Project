import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from "react-icons/ai"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'

const Navbar = () => {

    const { token } = useSelector( (state) => state.auth);
    const { user } = useSelector( (state) => state.profile);
    const { totalItems } = useSelector( (state) => state.cart);

    const [subLinks, setSubLinks] = useState([]);

    const fetchSubLinks = async() => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing sublinks result", result);
            setSubLinks(result.data.data);
        }
        catch (error) {
            console.log("Could not fetch the category list")
        }
    }

    useEffect( () => {
        fetchSubLinks()
    }, [])

    const location = useLocation();
    const matchRoute = (route) => {
        // console.log(location.pathname);
        return matchPath({path: route}, location.pathname);
    }

  return (
    <div className='flex items-center justify-center h-14 border-b-[1px] border-b-richblack-700'>
        <div className='flex justify-between items-center w-11/12 max-w-maxContent'>

            {/* logo */}
            <Link to={"/"}>
                <img src={logo} alt="logo" width={160} height={42} loading='lazy'/>
            </Link>

            {/* Nav links */}
            <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map( (element, index) => (
                            (
                                <li key={index}>
                                    {
                                        element.title === "Catalog"
                                        ? (
                                            <div>
                                                
                                            </div>
                                        )
                                        : (
                                            <Link to={element?.path}>
                                                <p className={`${matchRoute(element?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                    {element?.title}
                                                </p>
                                            </Link>
                                        )
                                    }
                                </li>
                            )
                        ))
                    }
                </ul>
            </nav>

            {/* signup/login/dashboard */}
            <div className='flex gap-x-4 items-center'>
                {
                    user && user.accountType !== "Instructor" && (
                        <Link to={"/dashboard/cart"} className='relative'>
                            <AiOutlineShoppingCart/>
                            {
                                totalItems > 0 && (
                                    <span>
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to={"/login"}>
                            <button className='text-richblack-200 font-medium bg-richblack-800 px-[12px] py-[8px] rounded-md border border-richblack-700'>
                                Log in
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to={"/signup"}>
                            <button className='text-richblack-200 font-medium bg-richblack-800 px-[12px] py-[8px] rounded-md border border-richblack-700'>
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && <ProfileDropDown/>
                }
            </div>

        </div>
    </div>
  )
}

export default Navbar
