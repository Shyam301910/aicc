import { SignIn } from '@clerk/nextjs'
import React from 'react'

// custom sign-in page for clerk
const page = () => {
  return (
    <div><SignIn/></div>
  )
}

export default page