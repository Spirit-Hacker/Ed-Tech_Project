import React from 'react'
import CTAButton from './CTAButton'
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
        {/* section 1 */}
        <div className="w-[50%] flex flex-col gap-8">
            {heading}

            <div className="text-richblack-300 font-bold">
                {subheading}
            </div>

            <div className="flex gap-7 mt-7">
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className="flex gap-2 items-center">
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    <div className="flex gap-2 items-center">
                        {ctabtn2.btnText}
                    </div>
                </CTAButton>
            </div>
        </div>

        {/* section 2 */}
        <div className="flex relative border-2 border-richblack-800 flex-row w-[50%] h-fit text-[15px] py-4 lg:w-[500px]">
            {backgroundGradient}
            <div className="flex flex-col text-center w-[10%] font-inter font-bold text-richblack-400">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-mono font-bold pr-2 ${codeColor}`}>
                <TypeAnimation
                    sequence={[codeblock, 10, ""]}
                    repeat={Infinity}
                    cursor={true}
                    style={
                        {
                            whiteSpace: "pre-line",
                            display: "block"
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>
        </div>

    </div>
  )
}

export default CodeBlocks
