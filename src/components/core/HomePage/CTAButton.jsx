import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold
          ${active ? "bg-[#FFD60A] text-[#000814] border-r-2 border-b-2 border-r-[#FFFFFF82] border-b-[#FFFFFF82]" 
          : "bg-[#161D29] text-[#F1F2FF] border-r-2 border-b-2 border-r-[#FFFFFF20] border-b-[#FFFFFF20]"}
          hover:scale-95 transition-all duration-200`
        }>
        
            {children}
        </div>
    </Link>
  )
}

export default CTAButton
