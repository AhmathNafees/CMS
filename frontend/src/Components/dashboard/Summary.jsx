import React from 'react'
import SummaryCard from './SummaryCard'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaTimesCircle, FaUsers } from 'react-icons/fa'

const Summary = () => {
  return (
    <div className=' p-6'>
      <h3 className=' text-2xl font-bold '>Dashboard Overview</h3>
      <div className=' grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        <SummaryCard icon={<FaUsers/>} text="Total Branch Admins" number={13} color="bg-teal-600"/>
        <SummaryCard icon={<FaBuilding/>} text="Total Branches" number={6} color="bg-yellow-600"/>
      </div>

      <div className='mt-12'>
        <h4 className=' text-center text-2xl font-bold'>Customer Status</h4>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <SummaryCard icon={<FaUsers/>} text="Total Coustomers" number={6} color="bg-teal-500"/>
          <SummaryCard icon={<FaCheckCircle/>} text="Work Completed Customers" number={6} color="bg-green-600"/>
          <SummaryCard icon={<FaHourglassHalf/>} text="Processing Customers" number={6} color="bg-yellow-600"/>
          <SummaryCard icon={<FaTimesCircle/>} text="Rejected Customers" number={6} color="bg-red-600"/>
        </div>
      </div>
    </div>
  )
}

export default Summary