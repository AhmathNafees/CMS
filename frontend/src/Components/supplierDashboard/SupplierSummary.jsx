import React, { useEffect, useState } from 'react'
import SupplierSummaryCard from "./SupplierSummaryCard"
import { FaBuilding, FaCheckCircle, FaHourglassHalf, FaSyncAlt, FaTimesCircle, FaUser, FaUsers } from 'react-icons/fa'
import { useAuth } from '../../context/AuthProvider'
import axios from 'axios'

const SupplierSummary = () => {
  const {user}=useAuth()

  const[summary, setSummary]=useState(null)

  useEffect(()=>{
    const fetchSummary= async()=>{
      try{
        const summary= await axios.get(`http://localhost:3000/api/admin-dashboard/supplierSummary`,{
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
        <h4 className=' text-center text-2xl font-bold'>Customer Status</h4>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <SupplierSummaryCard icon={<FaUsers/>} text="Total Coustomers" number={summary.totalCustomers} color="bg-teal-500"/>
          <SupplierSummaryCard icon={<FaHourglassHalf/>} text="Begin Customers" number={summary.customerSummary.begin} color="bg-gray-600"/>
          <SupplierSummaryCard icon={<FaSyncAlt/>} text="Processing Customers" number={summary.customerSummary.processing} color="bg-yellow-600"/>
          <SupplierSummaryCard icon={<FaCheckCircle/>} text="Work Completed Customers" number={summary.customerSummary.complete} color="bg-green-600"/>
          <SupplierSummaryCard icon={<FaTimesCircle/>} text="Rejected Customers" number={summary.customerSummary.reject} color="bg-red-600"/>
        </div>
      </div>
    </div>
  )
}

export default SupplierSummary