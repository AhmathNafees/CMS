import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6' >
        <h2 className='font-signika text-3xl text-white' >Customer Management System</h2>
        <div className=' border-0 shadow p-6 w-80 bg-white rounded'>
            <h2 className=' text-2xl font-bold mb-4'>Login</h2>
            <form action="">
            
                <div className=' mb-4' >
                    <label htmlFor="email" className=' block text-gray-700'>Email</label>
                    <input type="email" placeholder='Enter Email' id='email' className=' w-full px-3 py-2 border rounded-md'/>
                </div>
                <div className=' mb-4'>
                    <label htmlFor="password" className=' block text-gray-700'>Password</label>
                    <input type="password" placeholder='*******' id='password' className=' w-full px-3 py-2 border rounded-md'/>
                </div>
                <div className=' mb-4 flex items-center justify-between'>
                    <label  className=' inline-flex items-center'>
                        <input type="checkbox" className=' form-checkbox'/>
                        <span className=' ml-2 text-gray-700 '>Remember me</span>
                    </label>
                    <a href="" className=' text-teal-600'>Forgot Password</a>
                </div>
                <div className='mb-4'>
                    <button type='submit' className=' w-full bg-teal-600 text-white py-2 rounded-md' >Login</button>
                </div>
                
            </form>
        </div>
        
    </div>
  )
}

export default Login