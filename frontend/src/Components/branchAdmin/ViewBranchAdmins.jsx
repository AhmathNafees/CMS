import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

const ViewBranchAdmins = () => {
    const[branchAdmin, setBranchAdmin]=useState(null)
    const {id}=useParams()

    useEffect(()=>{
      
      const fetchBranchAdmin = async()=>{
        try{
          const response = await axios.get(`http://localhost:3000/api/branchAdmin/${id}`,{
            headers: {
              "Authorization" :`Bearer ${localStorage.getItem('accessToken')}`
            }
          })

          if(response.data.success){
          setBranchAdmin(response.data.branchAdmin)
          }
        }catch(error){
          if(error.response && !error.response.data.success){
          alert(error.response.data.error)
          }
        }
      };
      fetchBranchAdmin();
  },[id]) // Added id as dependency

  return (
    <>
    {branchAdmin ? (
      <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center'>
            Branch Admin Details
        </h2>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                <img src={`http://localhost:3000/${branchAdmin.userId.profileImage}`} alt="" className=' rounded-full border w-72' />
            </div>
            <div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Name:</p>
                    <p className=' font-medium'>{branchAdmin.userId.name}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Admin ID:</p>
                    <p className=' font-medium'>{branchAdmin.nic}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Date of Birth:</p>
                    <p className=' font-medium'>{new Date(branchAdmin.dob).toLocaleDateString()}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Gender:</p>
                    <p className=' font-medium'>{branchAdmin.gender}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Branch:</p>
                    <p className=' font-medium'>{branchAdmin.branch.branch_name}</p>
                </div>
                <div className=' flex space-x-3 mb-5'>
                    <p className=' text-lg font-bold'>Marital Status:</p>
                    <p className=' font-medium'>{branchAdmin.maritalStatus}</p>
                </div>
            </div>
        </div>
        
    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default ViewBranchAdmins