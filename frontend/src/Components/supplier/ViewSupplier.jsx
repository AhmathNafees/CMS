import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

const ViewSupplier = () => {
    const[supplier, setSupplier]=useState(null)
    const {id}=useParams()

    useEffect(()=>{
      
      const fetchSupplier = async()=>{
        try{
          const response = await axios.get(`http://localhost:3000/api/supplier/${id}`,{
            headers: {
              "Authorization" :`Bearer ${localStorage.getItem('accessToken')}`
            }
          })

          if(response.data.success){
          setSupplier(response.data.supplier)
          }
          // console.log(response.data)
        }catch(error){
          if(error.response && !error.response.data.success){
          alert(error.response.data.error)
          }
        }
      };
      fetchSupplier();
    },[id]) // Added id as dependency

  return (
    <>
    {supplier ? (
      <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Supplier Details
        </h2>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <img src={`http://localhost:3000/${supplier.profileImage}`} alt="" className=' rounded-full border w-72' />
            </div>
            <div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Name:</p>
                    <p className=' font-medium'>{supplier.name}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Email:</p>
                    <p className=' font-medium'>{supplier.email}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Phone Number:</p>
                    <p className=' font-medium'>{supplier.pno}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Admin ID:</p>
                    <p className=' font-medium'>{supplier.nic}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Date of Birth:</p>
                    <p className=' font-medium'>{new Date(supplier.dob).toLocaleDateString()}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Gender:</p>
                    <p className=' font-medium'>{supplier.gender}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Role:</p>
                    <p className=' font-medium'>{supplier.role}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Marital Status:</p>
                    <p className=' font-medium'>{supplier.maritalStatus}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Profile Created:</p>
                    <p className=' font-medium'>{new Date(supplier.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Profile Updated:</p>
                    <p className=' font-medium'>{new Date(supplier.updatedAt).toLocaleDateString("en-GB")}</p>
                </div>
            </div>
        </div>
        
    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default ViewSupplier