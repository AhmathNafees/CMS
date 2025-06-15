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
                <img src={`http://localhost:3000/${customer.profileImage}`} alt="" className=' rounded-full border w-72' />
            </div>
            <div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Name:</p>
                    <p className=' font-medium'>{customer.name}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Mobile Number:</p>
                    <p className=' font-medium'>{customer.pno}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Email:</p>
                    <p className=' font-medium'>{customer.email}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Home Address:</p>
                    <p className=' font-medium'>{customer.homeAdd}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Purpose Descrption:</p>
                    <p className=' font-medium'>{customer.desc}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>NIC:</p>
                    <p className=' font-medium'>{customer.nic}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Passport Number:</p>
                    <p className=' font-medium'>{customer.passport}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Date of Birth:</p>
                    <p className=' font-medium'>{new Date(customer.dob).toLocaleDateString()}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Gender:</p>
                    <p className=' font-medium'>{customer.gender}</p>
                </div>
                
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Marital Status:</p>
                    <p className=' font-medium'>{customer.maritalStatus}</p>
                </div>
                <div>
                  <img src={`http://localhost:3000/${customer.passportImage}`} alt="" className=' rounded-full border w-72' />
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Branch Admin:</p>
                    <p className=' font-medium'>{customer.userId.name}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Branch:</p>
                    <p className=' font-medium'>{customer.branchId.branch_name}</p>
                </div>
            </div>
        </div>
        
    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default ViewCustomer