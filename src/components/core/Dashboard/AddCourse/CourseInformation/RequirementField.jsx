import React, { useEffect, useState } from 'react'

const RequirementField = ({
    name,
    label,
    register,
    setValue,
    getValues,
    errors
}) => {
    
    const [requirement, setRequirement] = useState("")
    const [requirementList, setRequirementList] = useState([])

    useEffect(() => {
        register(name, {
            required: true,
            validate: (value) => value.length > 0
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValue(name, requirementList)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requirementList])

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList, requirement])
            setRequirement("")
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList]
        updatedRequirementList.splice(index, 1)
        setRequirementList(updatedRequirementList)
    }

  return (
    <div>
        <label htmlFor={name} className='text-sm text-richblack-5'>{label} <sup className='text-pink-200'>*</sup></label>
        <div className='flex flex-col gap-2 items-start'>
            <input
                id={name}
                type="text"
                className='w-full form-style'
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
            />
            <button
                type='button'
                onClick={handleAddRequirement}
                className='text-yellow-50 font-semibold'
            >
                Add
            </button>
        </div>

        {
            requirementList.length > 0 && (
                <ul>
                    {
                        requirementList.map((requirement, index) => (
                            <li key={index} className='flex flex-row items-center gap-3 text-richblack-5'>
                                <span>{requirement}</span>
                                <button
                                    type='button'
                                    onClick={() => handleRemoveRequirement(index)}
                                    className='text-xs text-pure-greys-300'
                                >
                                    clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
        {
            errors[name] && (
                <span>{label} is required</span>
            )
        }
    </div>
  )
}

export default RequirementField
