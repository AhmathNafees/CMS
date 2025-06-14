import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';



const Setting = () => {

    const navigate = useNavigate();
    const {user} = useAuth()
    const [setting, setSetting] =useState({
        userId:user._id,
        oldPassword:"",
        newPassword:"",
        confirmPassword:"",
    });
    const [error, setError]=useState(null);

    const handleChange = (e)=>{
        const {name, value}=e.target;
        setSetting({...setting, [name]: value});
    };

    const handelSubmit = async(e)=>{
        e.preventDefault();
        if(setting.newPassword !== setting.confirmPassword){
            setError("Password not matched");
            return;
        }else{
            try{
                const response = await axios.put('http://localhost:3000/api/setting/change-password',setting,{
                headers: {
                    Authorization :`Bearer ${localStorage.getItem('accessToken')}`
                }
                })
                if(response.data.success){
                    alert("Password Change Successfully")
                    navigate("/login")
                }else{
                    setError("Failed to change password")
                }

            }catch(error){
                setError(error.response?.data?.error || "Something went wrong");
            }
        }
    }

  return (
    <div className='flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6'>
      <h2 className='font-signika text-3xl text-white'>Customer Management System</h2>
      <div className='border-0 shadow p-6 w-80 bg-white rounded'>
        <h2 className='text-2xl font-bold mb-4 text-center' >Change Password</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handelSubmit}>
          <div className='mb-4'>
            <label htmlFor="oldPassword" className='block text-gray-700'>Old Password</label>
            <input
              type="password"
              placeholder='Old Password'
              id='oldPassword'
              name='oldPassword'
              className='w-full px-3 py-2 border rounded-md'
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="newPassword" className='block text-gray-700'>New Password</label>
            <input
              type="password"
              placeholder='New Password'
              name='newPassword'
              id='newPassword'
              className='w-full px-3 py-2 border rounded-md'
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="confirmPassword" className='block text-gray-700'>Confirm Password</label>
            <input
              type="password"
              placeholder='Confirm Password'
              name='confirmPassword'
              id='confirmPassword'
              className='w-full px-3 py-2 border rounded-md'
              onChange={handleChange}
              required
            />
          </div>

          <div className='mb-4'>
            <button type='submit' className='w-full bg-teal-600 text-white py-2 rounded-md cursor-pointer'>Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Setting