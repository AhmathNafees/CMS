// Login.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // default to admin

  
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginEndpoint = role === "supplier"
      ? "http://localhost:3000/api/supplier/login"
      : "http://localhost:3000/api/auth/login";
      const response = await axios.post(loginEndpoint, { email, password });
      // console.log(response.data)
      const resData = response.data;
    const userData = resData.user || resData.supplier;

    if (resData.success) {
      login(userData);
      localStorage.setItem("accessToken", resData.accessToken);
      localStorage.setItem("refreshToken", resData.refreshToken);
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userId", userData._id);

      if (userData.role === "admin") {
        navigate('/admin-dashboard');
      } else if (userData.role === "branchAdmin") {
        navigate('/branchAdmin-dashboard');
      } else if (userData.role === "supplier") {
        navigate('/supplier-dashboard');
      } else {
        navigate('/customerCare-dashboard');
      }
    }
    } catch (error) {
      if(error.response && !error.response.data.success){
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6'>
      <h2 className='font-signika text-3xl text-white'>Customer Management System</h2>

      <div className='border-0 shadow p-6 w-80 bg-white rounded'>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        <div className='mb-4'>
          <label htmlFor="role" className='block text-gray-700'>Login As</label>
          <select
            id='role'
            className='w-full px-3 py-2 border rounded-md'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>
        
        {error && <p className='text-red-600'>{error}</p>}
        <form onSubmit={handelSubmit}>
          <div className='mb-4'>
            <label htmlFor="email" className='block text-gray-700'>Email</label>
            <input
              type="email"
              placeholder='Enter Email'
              id='email'
              className='w-full px-3 py-2 border rounded-md'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
          </div>
          <div className='mb-4 relative'>
            <label htmlFor="password" className='block text-gray-700'>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='*******'
              id='password'
              className='w-full px-3 py-2 border rounded-md'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </div>
          </div>
          <div className='mb-4 flex items-center justify-between'>
            <label className='inline-flex items-center'>
              <input type="checkbox" className='form-checkbox'/>
              <span className='ml-2 text-gray-700'>Remember me</span>
            </label>
            <a href="" className='text-teal-600'>Forgot Password</a>
          </div>
          <div className='mb-4'>
            <button type='submit' className='w-full bg-teal-600 text-white py-2 rounded-md cursor-pointer'>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
