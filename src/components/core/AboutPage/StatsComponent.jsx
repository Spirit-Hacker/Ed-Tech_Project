import React from 'react'

const Stats = [
    {count: "5k", label: "Active Students"},
    {count: "10+", label: "Mentors"},
    {count: "200+", label: "Courses"},
    {count: "50+", label: "Active Rewards"},
]
const StatsComponent = () => {
  return (
    <section className='w-[100vw] bg-richblack-700 mb-20 p-10'>
        <div>
            <div className='flex gap-x-5 justify-around items-center'>
                {
                    Stats.map( (data, index) => {
                        return (
                            <div key={index} className='flex flex-col items-center gap-2'>
                                <h1 className='text-4xl font-semibold'>{data.count}</h1>
                                <h2 className='text-richblack-500 font-semibold'>{data.label}</h2>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default StatsComponent
