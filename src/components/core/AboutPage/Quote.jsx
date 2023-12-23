import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className='text-center text-4xl font-semibold mx-auto mb-20'>
        We are passionate about revolutionizing the way we learn. Our innovative platform
        <HighlightText text={"combines technology"}/>
        ,<span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff791f] to-[#e77a3b]'>{" "}expertise</span>
        , and community to create an 
        <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffcb1f]  to-[#ffcb1f]'>{" "}unparalleled educational experience.</span>
        <hr className='mt-20 opacity-20' />
    </div>
  )
}

export default Quote
