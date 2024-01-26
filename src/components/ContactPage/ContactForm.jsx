import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import  { apiConnector } from '../../services/apiConnector'
import { contactusEndpoint }  from '../../services/apis';
import CountryCode from '../../data/countrycode.json'

const ContactForm = () => {

    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging Data: ", data);
        try {
            setLoading(true);
            const responce = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            // const responce = {status: "OK"}
            console.log("Logging responce : ", responce);
            setLoading(false);   
        }
        catch (error) {
            console.log("Error: ", error.message);
            setLoading(false);
        }
    }

    useEffect( () => {
        reset({
            firstname: "",
            lastname: "",
            email: "",
            message: "",
            phoneNo: ""
        })
    }, [reset, isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(submitContactForm)} className='w-full'>
        <div className='flex flex-col gap-10 w-full'>
            <div className='flex gap-5 w-full'>
                {/* First Name */}
                <div className='flex flex-col w-full'>
                    <label htmlFor='firstname' className='text-sm'>First Name</label>
                    <input
                        type='text'
                        name='firstname'
                        id='firstname'
                        placeholder='Enter First Name'
                        {...register('firstname', {required: true})}
                        className='text-richblack-5 outline-none bg-richblack-600 p-3 rounded-md border-b-[1px] border-b-richblack-300'
                    />
                    {
                        errors.firstname && (
                            <span>
                                Please Enter First Name
                            </span>
                        )
                    }
                </div>

                {/* Last Name */}
                <div className='flex flex-col w-full'>
                    <label htmlFor='lastname' className='text-sm'>Last Name</label>
                    <input
                        type='text'
                        name='lastname'
                        id='lastname'
                        placeholder='Enter Last Name'
                        {...register('lastname')}
                        className='text-richblack-5 outline-none bg-richblack-600 p-3 rounded-md border-b-[1px] border-b-richblack-300'
                    />
                </div>
            </div>
            {/* Email */}
            <div className='flex flex-col'>
                <label htmlFor="email" className='text-sm'>Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Enter email address'
                    {...register('email', {required: true})}
                    className='text-richblack-5 outline-none bg-richblack-600 p-3 rounded-md border-b-[1px] border-b-richblack-300'
                />
                {
                    errors.email && (
                        <span>
                            Please enter your email address
                        </span>
                    )
                }
            </div>

            {/* Phone Number */}
            <div className='flex flex-col'>
                <label htmlFor="phonenumber" className='text-sm'>Phone Number</label>
                <div className='flex flex-row gap-5'>
                    {/* Drop Down */}
                    <div className='flex gap-5'>
                        <select
                            name='dropdown'
                            id='dropdown'
                            {...register("countrycode", {required: true})}
                            className='text-richblack-5 outline-none bg-richblack-600 p-3 rounded-md border-b-[1px] border-b-richblack-300 w-[80px]'
                        >
                            {
                                CountryCode.map( (element, index) => {
                                    return  (
                                        <option key={index} value={element.code} className='bg-richblack-700 text-richblack-5'>
                                            {element.code} - {element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className='w-full'>
                        <input
                            type='number'
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='text-richblack-5 bg-richblack-600 p-3 rounded-md border-b-[1px] border-b-richblack-300 w-full outline-none'
                            {...register('phoneNo', {
                                required: {value: true, message: "Please Enter Phone Number"},
                                maxLength: {value: 10, message: "Invalid Phone Number"},
                                minLength: {value: 8, message: "Invalid Phone Number"},
                            })}
                        />
                    </div>
                </div>
                {
                    errors.phoneNo && (
                        <span>
                            {errors.phoneNo.message}
                        </span>
                    )
                }
            </div>

            {/* Message */}
            <div className='flex flex-col'>
                <label htmlFor="message" className='text-sm'>Message</label>
                <textarea
                    name='message'
                    id='message'
                    cols={30}
                    rows={7}
                    placeholder='Enter your message'
                    {...register('message', {required: true})}
                    className='text-richblack-5 bg-richblack-600 p-3 rounded-md border-b-[1px] border-b-richblack-300 outline-none'
                />
                {
                    errors.message && (
                        <span>
                            Please enter your message
                        </span>
                    )
                }
            </div>
            
            <button type='submit' className='bg-yellow-50 text-black p-3 rounded-md font-semibold'>
                Send Message
            </button>
        </div>
    </form>
  )
}

export default ContactForm
