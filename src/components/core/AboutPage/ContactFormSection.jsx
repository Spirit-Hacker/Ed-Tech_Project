import React from 'react'
import ContactForm from '../../ContactPage/ContactForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto flex flex-col items-center justify-end gap-4'>
        <h1 className='text-4xl font-semibold'>Get in Touch</h1>
        <p className='text-richblack-400'>
          We'd love to here for you, Please fill out this form.
        </p>
        <div className='pt-8'>
          <ContactForm/>
        </div>
    </div>
  )
}

export default ContactFormSection
