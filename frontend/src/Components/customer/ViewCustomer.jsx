import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

const ViewCustomer = () => {
    const[customer, setCustomer]=useState(null)
    const {id}=useParams()

    useEffect(()=>{
      
      const fetchCustomer = async()=>{
        try{
          const response = await axios.get(`http://localhost:3000/api/customer/${id}`,{
            headers: {
              Authorization :`Bearer ${localStorage.getItem('accessToken')}`
            }
          })

          if(response.data.success){
          setCustomer(response.data.customer)
          }
        }catch(error){
          if(error.response && !error.response.data.success){
          alert(error.response.data.error)
          }
        }
      };
      fetchCustomer();
  },[id]) // Added id as dependency

  return (
    <>
    {customer ? (
      <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Customer Details
        </h2>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <p className=' text-lg font-bold'>Customer Photo</p>
                <img src={`http://localhost:3000/${customer.profileImage}`} alt="" className=' rounded-full border-2 w-72' />
            </div>
            <div>
              <p className=' text-lg font-bold'>Passport Image</p>
              <img src={`http://localhost:3000/${customer.passportImage}`} alt="" className=' rounded-md w-72 border-2'  />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-90'>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Status:</p>
                    <p className=' font-medium'>{customer.status}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Name:</p>
                    <p className=' font-medium'>{customer.name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Mobile Number:</p>
                    <p className=' font-medium'>{customer.pno}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Email:</p>
                    <p className=' font-medium'>{customer.email}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Home Address:</p>
                    <p className=' font-medium'>{customer.homeAdd}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5 '>
                    <p className=' text-lg font-bold whitespace-nowrap'>Purpose Descrption:</p>
                    <p className=' font-medium'>{customer.desc}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>NIC:</p>
                    <p className=' font-medium'>{customer.nic}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Passport Number:</p>
                    <p className=' font-medium'>{customer.passport}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Date of Birth:</p>
                    <p className=' font-medium'>{new Date(customer.dob).toLocaleDateString()}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Gender:</p>
                    <p className=' font-medium'>{customer.gender}</p>
                </div>
                
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Marital Status:</p>
                    <p className=' font-medium'>{customer.maritalStatus}</p>
                </div>
                
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Branch Admin:</p>
                    <p className=' font-medium'>{customer.userId.name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Branch:</p>
                    <p className=' font-medium whitespace-nowrap'>{customer.branchId.branch_name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Created:</p>
                    <p className=' font-medium whitespace-nowrap'>{new Date(customer.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Updated:</p>
                    <p className=' font-medium whitespace-nowrap'>{new Date(customer.updatedAt).toLocaleString('en-GB',{
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}</p>
                </div>
            </div>
            
        </div>
        
    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default ViewCustomer