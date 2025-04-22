"use client"

import {useEffect} from "react"
import emailjs from "@emailjs/browser"
import {toast} from "sonner"

type ContactEmailProps = {
  fullName: string
  email: string
  message: string
}

const ContactEmail = ({fullName, email, message}: ContactEmailProps) => {
  useEffect(() => {
    const sendEmail = async () => {
      try {
        await emailjs.send(
          "service_tn7ffdn",
          "template_z6pxjii",
          {
            user_name: fullName,
            user_email: email,
            message: message,
          },
          "uYqAtgmRVQHewEzFx"
        )
        toast.success("Welcome email sent!")
      } catch (error) {
        toast.error("Failed to send welcome email.")
        console.error(error)
      }
    }

    sendEmail()
  }, [fullName, email, message]) // run when props change

  return null // no visible UI
}

export default ContactEmail
