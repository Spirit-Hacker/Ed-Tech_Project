import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateProfile } from '../../../../services/operations/SettingsAPI'

const EditProfile = () => {

    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const Genders = ['Male', 'Female', 'Other']

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const submitProfileForm = (data) => {
        console.log(data)
        try {
            dispatch(updateProfile(token, data))
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit(submitProfileForm)}>
            <div className='flex my-10 w-full flex-col gap-5 bg-richblack-800 p-10 rounded-lg border-[1px] border-richblack-700'>
                <h1 className='text-lg font-semibold text-richblack-5'>Profile Information</h1>
                <div className='flex flex-col gap-5 w-full'>
                    <div className='flex gap-5 w-full'>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="firstName" className='lable-style'>First Name</label>
                            <input
                                type="text"
                                placeholder='firstName'
                                name='firstName'
                                id='firstName'
                                className='form-style'
                                {...register('firstName', {
                                    required: true
                                })}
                                defaultValue={user.firstName}
                            />
                            {
                                errors.firstName && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        Please enter your First Name.
                                    </span>
                                )
                            }
                        </div>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="lastName" className='lable-style'>Last Name</label>
                            <input
                                type="text"
                                placeholder='lastName'
                                name='lastName'
                                id='lastName'
                                className='form-style'
                                {...register('lastName', {
                                    required: true
                                })}
                                defaultValue={user.lastName}
                            />
                            {
                                errors.lastName && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        Please enter your Last Name.
                                    </span>
                                )
                            }
                        </div>
                    </div>
                    <div className='flex gap-5 w-full'>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="dateOfBirth" className='lable-style'>Date of Birth</label>
                            <input
                                type="Date"
                                placeholder='dateOfBirth'
                                name='dateOfBirth'
                                id='dateOfBirth'
                                className='form-style'
                                {...register('dateOfBirth', {
                                    required: {
                                        value: true,
                                        message: "Please enter your Date of Birth.",
                                    },
                                    max: {
                                        value: new Date().toISOString().split("T")[0],
                                        message: "Date of Birth cannot be in the future.",
                                    },
                                })}
                                defaultValue={user?.additionalDetails?.dateOfBirth}
                            />
                            {
                                errors.dateOfBirth && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        {errors.dateOfBirth.message}
                                    </span>
                                )
                            }
                        </div>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="gender" className='lable-style'>Gender</label>
                            <select
                                type="text"
                                placeholder='gender'
                                name='gender'
                                id='gender'
                                className='form-style'
                                {...register('gender', {
                                    required: true
                                })}
                                defaultValue={user?.additionalDetails?.gender}
                            >
                                {
                                    Genders.map((gender, index) => <option key={index}>{gender}</option>)
                                }
                            </select>
                            {
                                errors.gender && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        Please Enter Your Gender
                                    </span>
                                )
                            }
                        </div>
                    </div>
                    <div className='flex gap-5 w-full'>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="contactNumber" className='lable-style'>Contact Number</label>
                            <input
                                type="text"
                                placeholder='Enter your contact number'
                                name='contactNumber'
                                id='contactNumber'
                                className='form-style'
                                {...register('contactNumber', {
                                    required: {
                                        value: true,
                                        message: "Please enter your contact number.",
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Contact number must be 10 digits.",
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: "Contact number must be 10 digits.",
                                    }
                                })}
                                defaultValue={user?.additionalDetails?.contactNumber}
                            />
                            {
                                errors.contactNumber && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        {errors.contactNumber.message}
                                    </span>
                                )
                            }
                        </div>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="about" className='lable-style'>About</label>
                            <input
                                type="text"
                                placeholder='Enter your Bio'
                                name='about'
                                id='about'
                                className='form-style'
                                {...register('about', {
                                    required: true
                                })}
                                defaultValue={user?.additionalDetails?.about}
                            />
                            {
                                errors.about && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        Please enter your Bio.
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex gap-5 justify-end'>
                <button
                    className='bg-richblack-700 px-5 rounded-lg'
                    onClick={() => {
                        navigate('/dashboard/my-profile')
                    }}
                >
                    Cancel
                </button>
                <IconBtn
                    text={"Save"}
                    type={"submit"}
                />
            </div>
        </form>
    </>
  )
}

export default EditProfile
