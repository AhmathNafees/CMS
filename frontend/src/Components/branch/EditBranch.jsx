import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

const EditBranch = () => {
  const {id} = useParams()
  const [branch, setBranch]=useState([])
  const [braLoading,setBraLoading]=useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchBranches = async()=>{
      setBraLoading(true)
      try{
        const response = await axios.get(`http://localhost:3000/api/branch/${id}`,{
          headers: {
            "Authorization" :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if(response.data.success){
         setBranch(response.data.branch)
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }

      }finally{
        setBraLoading(false)
      }
    };
    fetchBranches();
  },[id]) // Added id as dependency

  const handleChange= (e)=>{
    const {name, value} = e.target;
    setBranch({...branch, [name]:value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      const response = await axios.put(`http://localhost:3000/api/branch/${id}`, branch, {
        headers:{Authorization : `Bearer ${localStorage.getItem("accessToken")}`}
      })
      if(response.data.success){
        navigate("/admin-dashboard/branches")
      }
    }catch(error){
      if(error.response && !error.response.data.success){
        alert(error.response.data.error)
      }
    }

  }

  return (
    <>{braLoading ? <div>Loading...</div> :
      <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6'>Edit Branch</h2>
        <form action="" onSubmit={handleSubmit} >
          <div>
            <label htmlFor="branch_name"
            className=' text-sm font-medium text-gray-700'>Branch Name</label>
            <input type="text" placeholder='Enter Branch Name' id='branch_name' className=' mt-1 w-full p-2 border border-gray-300 rounded-md' name='branch_name'
            onChange={handleChange}
            value={branch.branch_name}
            required/>
          </div>
          <div className='mt-3'>
            <label htmlFor="desc" className=' block text-sm font-medium text-gray-700'>Description</label>
            <textarea name="desc" id="desc" placeholder='Description' className=' mt-1 p-2 block w-full border border-gray-300 rounded-md ' rows="4"
            onChange={handleChange}
            value={branch.desc}/>
          </div>
          <button type='submit' className=' w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-md cursor-pointer'>Update Branch</button>
          
        </form>
      </div>}
    </>
    
  )
}

export default EditBranch