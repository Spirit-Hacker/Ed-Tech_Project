import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';
import { FaArrowLeft } from "react-icons/fa6";

const ForgotPassword = () => {

    const { loading } = useSelector((state) => state.auth);
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
 
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    }

  return (
    <div className='text-white flex justify-center items-center'>
        {
            loading ? (
                <div>Loading.....</div>
            ) : (
                <div className='flex flex-col items-start justify-center h-[90vh] gap-5 w-[32%]'>
                    <h1 className='text-3xl font-semibold'>
                        {
                            !emailSent ? "Reset Your Password" : "Check Your Email"
                        }
                    </h1>
                    <p className='text-richblack-200 font-medium text-lg tracking-wide'>
                        {
                            !emailSent ? 
                            "Have no fear. We will email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                            : `We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit} className='flex w-full flex-col gap-4 items-start'>
                        {
                            !emailSent && (
                                <label className='w-full flex flex-col gap-1'>
                                    <p className='text-sm tracking-wide'>Email Address <sup className='text-pink-300'>*</sup></p>
                                    <input
                                        required
                                        type='email'
                                        name='email'
                                        value={email}
                                        placeholder='Enter Your Email Address'
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='bg-richblack-700 tracking-wide w-full p-3 rounded-md border-b-[1px] border-richblack-400'
                                    />
                                </label>
                            )
                        }
                        <button type='submit' className='w-full bg-yellow-50 p-4 text-black font-medium rounded-lg'>
                            {
                                !emailSent ? "Reset Password" : "Resend Email"
                            }
                        </button>
                    </form>
                    <div>
                        <Link to="/login">
                            <div className='flex gap-2 items-center justify-center'>
                                <FaArrowLeft />
                                <p>Back to login</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword
