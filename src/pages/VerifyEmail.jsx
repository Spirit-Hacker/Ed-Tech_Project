import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, signUp } from '../services/operations/authAPI';
import { FaArrowLeft } from "react-icons/fa6";
import { GiAnticlockwiseRotation } from "react-icons/gi";

const VerifyEmail = () => {
    const { loading, signupData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if(!signupData){
            navigate('/signup')
        }
    })

    const handleOnSubmit = (e) => {
        e.preventDefault();

        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData;

        dispatch(signUp(
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate
        ));
    }

  return (
    <div className='text-white flex justify-center items-center h-[90vh]'>
        {
            loading ? (
                <div>Loading......</div>
            ) : (
                <div className='flex flex-col items-start justify-center w-[32%] gap-5'>
                    <h1 className='text-4xl'>Verify Email</h1>
                    <p className='text-richblack-200 text-lg'>A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit} className='w-full'>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span></span>}
                            renderInput={(props) => (
                                <input
                                {...props}
                                placeholder="-"
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center"
                                />
                            )}
                            containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                            }}
                        />
                        <button type="submit" className='bg-yellow-50 mt-6 font-normal text-black p-3 rounded-lg w-full'>
                            Verify Email
                        </button>
                    </form>
                    <div className='flex items-center justify-between w-full'>
                        <div>
                            <Link to='/signup'>
                                <div className='flex gap-2 items-center'>
                                    <FaArrowLeft/>
                                    <p>Back to Signup</p>
                                </div>
                            </Link>
                        </div>
                        <button onClick={() => dispatch(sendOtp(signupData.email, navigate))}>
                            <div className='flex gap-2 items-center text-blue-100'>
                                <GiAnticlockwiseRotation/>
                                Resend it
                            </div>
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail
