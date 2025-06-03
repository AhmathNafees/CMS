import React from 'react'
import { useAuth } from '../../context/AuthProvider'

const Navbar = () => {
  const {user} = useAuth()
  return (
    <div className=' flex justify-between h-12 bg-teal-600 items-center text-white px-5'>
      <p>Welcome {user.name}</p>
      <button className=' px-4 py-1 bg-teal-700 cursor-pointer hover:bg-teal-800 rounded'>Logout</button>
    </div>
  )
}

export default Navbar