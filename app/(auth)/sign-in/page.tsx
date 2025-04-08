"use client"

import AuthComponent from "@/components/AuthComponent"
import {signInWithCredentials} from "@/lib/actions/auth"
import {signInSchema} from "@/lib/validations"
import React from "react"

const page = () => (
  <AuthComponent
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: "",
      password: "",
    }}
    onSubmit={signInWithCredentials}
  />
)

export default page
