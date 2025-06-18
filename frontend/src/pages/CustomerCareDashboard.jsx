import React from 'react'
import { useAuth } from '../context/AuthProvider';
import Navbar from '../Components/dashboard/Navbar';
import { Outlet } from 'react-router-dom';
import CustomerCareSidebar from '../Components/customerCareDashboard/CustomerCareSidebar';

const CustomerCareDashboard = () => {
  const {user} = useAuth()

  return (
    <div className=' flex'>
      {/* AdminDashboard {user && user.name} */}
      <CustomerCareSidebar/>
      <div className=' flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default CustomerCareDashboard