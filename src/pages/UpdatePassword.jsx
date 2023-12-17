import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { Link, useLocation } from 'react-router-dom';
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

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
    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token))
    }
  return (
    <div className='text-white flex justify-center items-center'>
        {
            loading ? (
                <div>Loding.....</div>
            ) : (
                <div>
                    <h1>Choose a new password</h1>
                    <p>Almost done. Enter your new password and youre all set.</p>
                    <form onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password <sup>*</sup></p>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                name='password' 
                                value={password}
                                onChange={handleOnChange}
                                placeholder='Password'
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {
                                    showPassword ? <AiFillEyeInvisible fontSize={24}/> : <AiFillEye fontSize={24}/>
                                }
                            </span>
                        </label>
                        <label>
                            <p>Confirm New Password <sup>*</sup></p>
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                name='confirmPassword' 
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder='Confirm Password'
                            />
                            <span
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {
                                    showConfirmPassword ? <AiFillEyeInvisible fontSize={24}/> : <AiFillEye fontSize={24}/>
                                }
                            </span>
                        </label>
                        <button type="submit">
                            Reset Password
                        </button>
                    </form>
                    <div>
                        <Link to='/login'>
                            <p>Back to login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword
