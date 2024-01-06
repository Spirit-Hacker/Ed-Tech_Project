import React, { useEffect, useRef, useState } from 'react'
import IconBtn from '../../../common/IconBtn'
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { updateDisplayPicture } from '../../../../services/operations/SettingsAPI';

const UpdateProfilePicture = () => {

    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [previewSource, setPreviewSource] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const fileInputRef = useRef(null)
    const handleClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        
        if(file){
            setImageFile(file)
            previewFile(file)
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    const handleFileUpload = () => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('displayPicture', imageFile)
            dispatch(updateDisplayPicture(token, formData))
            .then(() => {
                setLoading(false)
            })
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

    useEffect(() => {
        if(imageFile){
            previewFile(imageFile)
        }
    }, [imageFile])

  return (
    <div className='bg-richblack-800 border-[1px] border-richblack-700 rounded-[8px] flex gap-x-7 items-center px-12 py-8'>
        <img src={previewSource ||user?.image} alt={`profile-${user?.firstName}`}
            className='aspect-square w-[78px] rounded-full object-cover'
        />
        <div className='flex flex-col gap-y-2'>
            <p className='text-richblack-5'>Change Profile Picture</p>
            <div className='flex gap-x-4 items-center justify-center'>
                <input
                    type='file'
                    className='hidden'
                    ref={fileInputRef}
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={handleFileChange}
                />
                <button
                    onClick={handleClick}
                    className='bg-richblack-700 text-richblack-50 px-4 py-2 rounded-md font-semibold'>
                    Select
                </button>
                <IconBtn
                    text={loading ? "Uploading..." : "Upload"}
                    onClick={handleFileUpload}
                >
                    {!loading && <FiUpload className='text-richblack-900' />}
                </IconBtn>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfilePicture
