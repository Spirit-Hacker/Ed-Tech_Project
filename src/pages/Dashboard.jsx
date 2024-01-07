import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {

    const {loading: authLoading} = useSelector(state => state.auth)
    const {loading: profileLoading} = useSelector(state => state.profile)

    if(authLoading || profileLoading){
        return (
          <div className='mt-10'>
            Loading...
          </div>
        )
    }

  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
      <Sidebar/>
      <div className='h-[calc(100vh-3.5rem)] overflow-auto'>
        <div className='flex items-center justify-center w-[calc(100vw-230px)] overflow-x-hidden px-10 py-10'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
