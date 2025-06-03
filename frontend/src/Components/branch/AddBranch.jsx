import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddBranch = () => {
  const [branch,setBranch]= useState({
    branch_name: '',
    desc:'',
  })
  const navigate= useNavigate()

  const handleChange= (e)=>{
    const {name, value} = e.target;
    setBranch({...branch, [name]:value})
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      const response = await axios.post('http://localhost:3000/api/branch/add', branch, {
        headers:{"Authorization" : `Bearer ${localStorage.getItem("token")}`}
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
    <div className=' max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
      <h2 className='text-2xl font-bold mb-6'>Add Branch</h2>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="branch_name"
          className=' text-sm font-medium text-gray-700'>Branch Name</label>
          <input type="text" placeholder='Enter Branch Name' id='branch_name' className=' mt-1 w-full p-2 border border-gray-300 rounded-md' name='branch_name'
          onChange={handleChange}/>
        </div>
        <div className='mt-3'>
          <label htmlFor="desc" className=' block text-sm font-medium text-gray-700'>Description</label>
          <textarea name="desc" id="desc" placeholder='Description' className=' mt-1 p-2 block w-full border border-gray-300 rounded-md ' rows="4"
          onChange={handleChange}/>
        </div>
        <button type='submit' className=' w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-md cursor-pointer'>Add Branch</button>
        
      </form>
    </div>
  )
}

export default AddBranch