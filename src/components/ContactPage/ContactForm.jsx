import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
// import  { apiConnector } from '../../services/apiConnector'
// import { contactusEndpoint }  from '../../services/apis';
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
            // const responce = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            const responce = {status: "OK"}
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
    <form onSubmit={handleSubmit(submitContactForm)}>
        <div className='flex flex-col gap-10'>
            <div className='flex gap-5'>
                {/* First Name */}
                <div className='flex flex-col'>
                    <label htmlFor='firstname'>First Name</label>
                    <input
                        type='text'
                        name='firstname'
                        id='firstname'
                        placeholder='Enter First Name'
                        {...register('firstname', {required: true})}
                        className='text-black'
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
                <div className='flex flex-col'>
                    <label htmlFor='lastname'>Last Name</label>
                    <input
                        type='text'
                        name='lastname'
                        id='lastname'
                        placeholder='Enter Last Name'
                        {...register('lastname')}
                        className='text-black'
                    />
                </div>
            </div>
            {/* Email */}
            <div className='flex flex-col'>
                <label htmlFor="email">Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Enter email address'
                    {...register('email', {required: true})}
                    className='text-black'
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
                <label htmlFor="phonenumber">Phone Number</label>
                <div className='flex flex-row gap-5'>
                    {/* Drop Down */}
                    <div className='flex gap-5'>
                        <select
                            name='dropdown'
                            id='dropdown'
                            {...register("countrycode", {required: true})}
                            className='text-richblack-700 w-[50px]'
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
                            className='text-black w-full'
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
                <label htmlFor="message">Message</label>
                <textarea
                    name='message'
                    id='message'
                    cols={30}
                    rows={7}
                    placeholder='Enter your message'
                    {...register('message', {required: true})}
                    className='text-black'
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
