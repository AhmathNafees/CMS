import React from 'react'
import BranchAdminSummaryCard from './BranchAdminSummaryCard'
import { FaBuilding, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUser, FaUsers } from 'react-icons/fa'
import { useAuth } from '../../context/AuthProvider'
const BranchAdminSummary = () => {
    const {user}=useAuth()
  return (
    <div className=' p-6'>
      <h3 className=' text-2xl font-bold '>Dashboard Overview</h3>
      <div className=' rounded flex bg-white mt-4'>
            <div className={` text-3xl flex justify-center items-center bg-teal-600 text-white px-4 rounded-2xl`}>
                <FaUser/>
            </div>
            <div className=' pl-4 py-1'>
                <p className=' text-lg font-semibold'>Welcome Back</p>
                <p className=' text-xl font-bold'>{user.name}</p>
            </div>
        </div>

      <div className='mt-12'>
        <h4 className=' text-center text-2xl font-bold'>Customer Status</h4>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <BranchAdminSummaryCard icon={<FaUsers/>} text="Total Coustomers" number={6} color="bg-teal-500"/>
          <BranchAdminSummaryCard icon={<FaCheckCircle/>} text="Work Completed Customers" number={6} color="bg-green-600"/>
          <BranchAdminSummaryCard icon={<FaHourglassHalf/>} text="Processing Customers" number={6} color="bg-yellow-600"/>
          <BranchAdminSummaryCard icon={<FaTimesCircle/>} text="Rejected Customers" number={6} color="bg-red-600"/>
        </div>
      </div>
    </div>
  )
}

export default BranchAdminSummary