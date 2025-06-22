import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import PDFViewer from '../../utils/PDFViewer';

const ViewIndexCustomer = () => {
    const[indexCustomer, setIndexCustomer]=useState(null)
    const {id}=useParams()

    useEffect(()=>{
      
      const fetchCustomer = async()=>{
        try{
          const response = await axios.get(`http://localhost:3000/api/indexCustomer/${id}`,{
            headers: {
              Authorization :`Bearer ${localStorage.getItem('accessToken')}`
            }
          })

          if(response.data.success){
          setIndexCustomer(response.data.indexCustomer)
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
    {indexCustomer ? (
      <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Customer Details
        </h2>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <p className=' text-lg font-bold'>Customer Photo</p>
                <img src={`http://localhost:3000/${indexCustomer.profileImage}`} alt="" className=' rounded-full border-2 w-72' />
            </div>
            <div>
              <p className=' text-lg font-bold'>View CV</p>
              <a   className="text-blue-500 hover:text-blue-700 underline font-semibold" href={`http://localhost:3000/${indexCustomer.cvPdf}`} target='_blank' rel="noopener noreferrer">Downlaod CV</a>
            </div>
            <div>
              <p className=' text-lg font-bold'>View Passport</p>
              <a   className="text-blue-500 hover:text-blue-700 underline font-semibold" href={`http://localhost:3000/${indexCustomer.passportPdf}`} target='_blank' rel="noopener noreferrer">Downlaod Passport</a>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-90'>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Name:</p>
                    <p className=' font-medium'>{indexCustomer.name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Mobile Number:</p>
                    <p className=' font-medium'>{indexCustomer.pno}</p>
                </div>

                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Location:</p>
                    <p className=' font-medium'>{indexCustomer.location}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5 '>
                    <p className=' text-lg font-bold whitespace-nowrap'>Purpose Descrption:</p>
                    <p className=' font-medium'>{indexCustomer.desc}</p>
                </div>


                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Gender:</p>
                    <p className=' font-medium'>{indexCustomer.gender}</p>
                </div>
                
                
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold whitespace-nowrap'>Branch Admin:</p>
                    <p className=' font-medium'>{indexCustomer.userId.name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Branch:</p>
                    <p className=' font-medium whitespace-nowrap'>{indexCustomer.branchId.branch_name}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Created:</p>
                    <p className=' font-medium whitespace-nowrap'>{new Date(indexCustomer.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <div className=' flex flex-col md:flex-row md:items-center space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Branch:</p>
                    <p className=' font-medium whitespace-nowrap'>{new Date(indexCustomer.updatedAt).toLocaleDateString('en-GB')}</p>
                </div>
            </div>
            
        </div>
        
    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default ViewIndexCustomer