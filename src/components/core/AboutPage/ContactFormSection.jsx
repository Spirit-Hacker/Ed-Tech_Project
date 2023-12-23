import React from 'react'
import ContactForm from '../../ContactPage/ContactForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto flex flex-col items-center justify-end'>
        <h1>Get in Touch</h1>
        <p>
          We'd love to here for you, Please fill out this form.
        </p>
        <div>
          <ContactForm/>
        </div>
    </div>
  )
}

export default ContactFormSection
