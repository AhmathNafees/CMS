import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

const ViewSCustomer = () => {
    const[sCustomer, setSCustomer]=useState(null)
    const {id}=useParams()

    useEffect(()=>{
      
      const fetchCustomer = async()=>{
        try{
          const response = await axios.get(`http://localhost:3000/api/sCustomer/${id}`,{
            headers: {
              Authorization :`Bearer ${localStorage.getItem('accessToken')}`
            }
          })

          if(response.data.success){
          setSCustomer(response.data.sCustomer)
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
    {sCustomer ? (
      <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Customer Details
        </h2>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <p className=' text-lg font-bold'>Customer Photo</p>
                <img src={`http://localhost:3000/${sCustomer.profileImage}`} alt="" className=' rounded-full border-2 w-72' />
            </div>
            <div>

            </div>
            <div>
              <p className=' text-lg font-bold'>View CV</p>
              <a   className="text-blue-500 hover:text-blue-700 underline font-semibold" href={`http://localhost:3000/${sCustomer.cvPdf}`} target='_blank' rel="noopener noreferrer">Downlaod CV</a>
            </div>
            <div>
              <p className=' text-lg font-bold'>View Passport</p>
              <a   className="text-blue-500 hover:text-blue-700 underline font-semibold" href={`http://localhost:3000/${sCustomer.passportPdf}`} target='_blank' rel="noopener noreferrer">Downlaod Passport</a>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-90'>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Status:</p>
                    <p className=' font-medium'>{sCustomer.status}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Name:</p>
                    <p className=' font-medium'>{sCustomer.name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Mobile Number:</p>
                    <p className=' font-medium'>{sCustomer.pno}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Email:</p>
                    <p className=' font-medium'>{sCustomer.email}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Home Address:</p>
                    <p className=' font-medium'>{sCustomer.homeAdd}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5 '>
                    <p className=' text-lg font-bold whitespace-nowrap'>Purpose Descrption:</p>
                    <p className=' font-medium'>{sCustomer.desc}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>NIC:</p>
                    <p className=' font-medium'>{sCustomer.nic}</p>
                </div>

                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Date of Birth:</p>
                    <p className=' font-medium'>{new Date(sCustomer.dob).toLocaleDateString()}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Gender:</p>
                    <p className=' font-medium'>{sCustomer.gender}</p>
                </div>
                
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Marital Status:</p>
                    <p className=' font-medium'>{sCustomer.maritalStatus}</p>
                </div>
                
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Branch Admin:</p>
                    <p className=' font-medium'>{sCustomer.supplierId.name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Created:</p>
                    <p className=' font-medium whitespace-nowrap'>{new Date(sCustomer.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Updated:</p>
                    <p className=' font-medium whitespace-nowrap'>{new Date(sCustomer.updatedAt).toLocaleString('en-GB',{
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

export default ViewSCustomer