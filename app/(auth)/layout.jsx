import React from 'react'

// layout page for authentication pages of clerk
const AuthLayout = ({children}) => {
  return (
    <div className='flex justify-center pt-40'>{children}</div>
  )
}

export default AuthLayout