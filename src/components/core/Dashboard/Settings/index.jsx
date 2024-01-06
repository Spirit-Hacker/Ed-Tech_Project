import React from 'react'
import UpdateProfilePicture from './UpdateProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'

const Settings = () => {
  return (
    <>
      <div className='text-white flex flex-col w-full'>
          <h1 className='mb-14 text-3xl font-medium flex tracking-wide text-richblack-5'>Edit Profile</h1>
          <div className='flex flex-col gap-10'>
              <UpdateProfilePicture/>
              <EditProfile/>
              <UpdatePassword/>
              <DeleteAccount/>
          </div>
      </div>
    </>
  )
}

export default Settings
