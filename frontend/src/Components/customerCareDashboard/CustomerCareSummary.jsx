import React, { useEffect, useState } from 'react'
import CustomerCareSummaryCard from './CustomerCareSummaryCard'
import { FaBuilding, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUser, FaUsers } from 'react-icons/fa'
import { useAuth } from '../../context/AuthProvider'
import axios from 'axios'
const CustomerCareSummary = () => {
  const {user}=useAuth()

  const[summary, setSummary]=useState(null)

  useEffect(()=>{
    const fetchSummary= async()=>{
      try{
        const summary= await axios.get(`http://localhost:3000/api/admin-dashboard/customerCareSummary`,{
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
        <h4 className=' text-center text-2xl font-bold'>Index Customer Status</h4>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <CustomerCareSummaryCard icon={<FaUsers/>} text="Total Coustomers" number={summary.totalIndexCustomers} color="bg-teal-500"/>
          <CustomerCareSummaryCard icon={<FaCheckCircle/>} text="Accepted Customers" number={summary.statusSummary.accepted} color="bg-green-600"/>
          <CustomerCareSummaryCard icon={<FaHourglassHalf/>} text="Pending Customers" number={summary.statusSummary.pending} color="bg-yellow-600"/>
          <CustomerCareSummaryCard icon={<FaTimesCircle/>} text="Rejected Customers" number={summary.statusSummary.rejected} color="bg-red-600"/>
        </div>
      </div>
    </div>
  )
}

export default CustomerCareSummary