import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../../common/IconBtn'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { changePassword } from '../../../../services/operations/SettingsAPI'

const ResetPassword = () => {
    const { token } = useSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        // eslint-disable-next-line
        formState: { errors }
    } = useForm()

    const submitResetPassword = (data) => {
        console.log(data)
        try {
            dispatch(changePassword(token, data))
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit(submitResetPassword)}>
            <div className='flex flex-col w-full gap-10'>
                <div className='flex flex-col w-full gap-4 bg-richblack-800 px-12 py-8 border-[1px] border-richblack-700 rounded-lg'>
                    <h1 className='text-lg font-semibold'>Password</h1>
                    <div className='flex w-full items-center justify-center gap-4'>
                        <div className='flex flex-col w-full gap-2 relative'>
                            <label htmlFor="oldPassword" className='lable-style'>Current Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="oldPassword"
                                id="oldPassword"
                                placeholder='Enter Current password'
                                className='form-style'
                                {...register("oldPassword", { required: true })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-[42px] z-[10] cursor-pointer'
                            >
                                {
                                    showPassword ?
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> :
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                }
                            </span>
                        </div>
                        <div className='relative flex flex-col w-full gap-2'>
                            <label htmlFor="newPassword" className='lable-style'>New Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="newPassword"
                                id="newPassword"
                                className='form-style'
                                placeholder='Enter New password'
                                {...register("newPassword", { required: true })}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-[42px] z-[10] cursor-pointer'
                            >
                                {
                                    showConfirmPassword ?
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> :
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                }
                            </span>
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
            </div>
        </form>
    </>
  )
}

export default ResetPassword
