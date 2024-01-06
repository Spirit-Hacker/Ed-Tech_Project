import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

const UpdatePassword = () => {
    const { loading } = useSelector( (state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const { password, confirmPassword } = formData;

    const handleOnChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        ))
    };

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token, navigate));
    }
  return (
    <div className='text-white flex justify-center items-center'>
        {
            loading ? (
                <div>Loding.....</div>
            ) : (
                <div className='h-[90vh] w-[32%] flex flex-col items-start justify-center gap-5'>
                    <h1 className='text-3xl font-semibold'>Choose a new password</h1>
                    <p className='text-richblack-300 text-lg tracking-wide'>Almost done. Enter your new password and youre all set.</p>
                    <form onSubmit={handleOnSubmit} className='w-full flex flex-col gap-3'>
                        <label className='flex flex-col gap-1 w-full'>
                            <p className='text-sm'>New Password <sup className='text-pink-300'>*</sup></p>
                            <div className='flex w-full bg-richblack-700 p-3 rounded-lg border-b-[1px] border-richblack-300'>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    name='password'
                                    value={password}
                                    onChange={handleOnChange}
                                    placeholder='Password'
                                    className='bg-transparent w-full outline-none'
                                />
                                <span className='text-richblack-300'
                                    onClick={() => setShowPassword((prev) => !prev)}>
                                    {
                                        showPassword ? <IoEyeOffOutline fontSize={24}/> : <IoEyeOutline fontSize={24}/>
                                    }
                                </span>
                            </div>
                        </label>
                        <label className='flex flex-col gap-1 w-full'>
                            <p className='text-sm'>Confirm New Password <sup className='text-pink-300'>*</sup></p>
                            <div className='flex w-full bg-richblack-700 p-4 rounded-lg border-b-[1px] border-richblack-300'>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    name='confirmPassword' 
                                    value={confirmPassword}
                                    onChange={handleOnChange}
                                    placeholder='Confirm Password'
                                    className='bg-transparent w-full outline-none'
                                />
                                <span className='text-richblack-300'
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {
                                        showConfirmPassword ? <IoEyeOffOutline fontSize={24}/> : <IoEyeOutline fontSize={24}/>
                                    }
                                </span>
                            </div>
                        </label>
                        <button type="submit" className='bg-yellow-50 mt-6 text-black p-3 rounded-lg'>
                            Reset Password
                        </button>
                    </form>
                    <div>
                        <Link to='/login'>
                            <div className='flex gap-2 justify-center items-center'>
                                <FaArrowLeft/>
                                Back to login
                            </div>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword
