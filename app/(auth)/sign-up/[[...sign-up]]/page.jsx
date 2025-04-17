import { SignUp } from '@clerk/nextjs'
import React from 'react'

// custom sign up page for clerk
const page = () => {
  return (
    <div>
        <SignUp/>
    </div>
  )
}

export default page