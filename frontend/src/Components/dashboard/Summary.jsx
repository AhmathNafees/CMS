import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaSyncAlt, FaTimesCircle, FaUsers } from 'react-icons/fa'
import axios from 'axios'

const Summary = () => {

  const[summary, setSummary]=useState(null)

  useEffect(()=>{
    const fetchSummary= async()=>{
      try{
        const summary= await axios.get(`http://localhost:3000/api/admin-dashboard/summary`,{
          headers :{
            Authorization :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        setSummary(summary.data)
      }catch(error){
        if(error.response){
          alert(error.response.data.error)
        }
        console.log(error.message)
      }
    }
    fetchSummary()
  },[])

  if(!summary){
    return <div>Loading...</div>
  }

  return (
    <div className=' p-6'>
      <h3 className=' text-2xl font-bold '>Dashboard Overview</h3>
      <div className=' grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        <SummaryCard icon={<FaBuilding/>} text="Total Branches" number={summary.totalBranches} color="bg-yellow-600"/>
        <SummaryCard icon={<FaUsers/>} text="Total Admins" number={summary.totalBranchAdmins} color="bg-teal-700"/>
        <SummaryCard icon={<FaUsers/>} text="Total Main Admins" number={summary.totalMainAdmin} color="bg-teal-500"/>
        <SummaryCard icon={<FaUsers/>} text="Total Branch Admins" number={summary.totalBranchAdmin} color="bg-teal-500"/>
        <SummaryCard icon={<FaUsers/>} text="Total Customercares" number={summary.totalCustomerCares} color="bg-teal-500"/>
        
      </div>

      <div className='mt-12'>
        <h4 className=' text-center text-2xl font-bold'>Customer Status</h4>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <SummaryCard icon={<FaUsers/>} text="Total Coustomers" number={summary.totalCustomers} color="bg-teal-600"/>
          <SummaryCard icon={<FaHourglassHalf/>} text="Begining Customers" number={summary.customerSummary.begin} color="bg-gray-600"/>
          <SummaryCard icon={<FaSyncAlt/>} text="Processing Customers" number={summary.customerSummary.processing} color="bg-yellow-600"/>
          <SummaryCard icon={<FaCheckCircle/>} text="Work Completed Customers" number={summary.customerSummary.complete} color="bg-green-600"/>
          <SummaryCard icon={<FaTimesCircle/>} text="Rejected Customers" number={summary.customerSummary.reject} color="bg-red-600"/>
        </div>
      </div>
      <div className='mt-12'>
        <h4 className=' text-center text-2xl font-bold'>Index Customer Status</h4>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <SummaryCard icon={<FaUsers/>} text="Total Index Coustomers" number={summary.totalIndexCustomers} color="bg-teal-500"/>
          <SummaryCard icon={<FaHourglassHalf/>} text="Pending Index Customers" number={summary.indexCustomerSummary.pending} color="bg-yellow-600"/>
        </div>
      </div>
    </div>
  )
}

export default Summary