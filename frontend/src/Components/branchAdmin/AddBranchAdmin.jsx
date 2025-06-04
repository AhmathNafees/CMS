import React, { useEffect, useState } from 'react'
import { fetchBranches } from '../../utils/BranchAdminHelper'

const AddBranchAdmin = () => {
    const  [branches, setBranches] = useState([])
    useEffect(()=>{
        const getBranches = async()=>{
            const branches=await fetchBranches()
            setBranches(branches)
        }
        getBranches()
        
    },[])
  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className=' text-2xl font-bold mb-6'>Add New Branch Admin</h2>
        <form action="">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                    <label htmlFor="baName" className=' block text-sm font-medium text-gray-700'>
                        Name
                    </label>
                    <input type="text" name='baName' id='baName' placeholder='Enter Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="baEmail" className=' block text-sm font-medium text-gray-700'>
                        Email Address
                    </label>
                    <input type="email" name='baEmail' id='baEmail' placeholder='Enter Email / Gmail' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                </div>

                {/* Branch Admin ID */}
                <div>
                    <label htmlFor="baID" className=' block text-sm font-medium text-gray-700'>
                        Branch Admin ID
                    </label>
                    <input type="text" name='baID' id='baID' placeholder='Branch Admin ID' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="baDOB" className=' block text-sm font-medium text-gray-700'>
                        Date of Birth
                    </label>
                    <input type="date" name='baDOB' id='baDOB' placeholder='DOB' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="baGender" className=' block text-sm font-medium text-gray-700'>
                        Gender
                    </label>
                    <select  name='baGender' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Marital Status */}
                <div>
                    <label htmlFor="maritalStatus" className=' block text-sm font-medium text-gray-700'>
                        Marital Status
                    </label>
                    <select  name='maritalStatus' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="Married">Married</option>
                    </select>
                </div>

                {/* Branch */}
                <div>
                    <label htmlFor="branch" className=' block text-sm font-medium text-gray-700'>
                        Select Branch
                    </label>
                    <select  name='branch' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Branch</option>
                        {branches.map(bra =>(
                            <option key={bra._id} value={bra._id}>{bra.branch_name}</option>
                        ))}
                        
                    </select>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="baPassword" className=' block text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    <input type="password" name='baPassword' id='baPassword' placeholder='********' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                </div>

                {/* Role */}
                <div>
                    <label htmlFor="role" className=' block text-sm font-medium text-gray-700'>
                        Role
                    </label>
                    <select  name='role' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Role</option>
                        <option value="mainAdmin">Main Admin</option>
                        <option value="branchAdmin">Branch Admin</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="baImage" className=' block text-sm font-medium text-gray-700'>
                        Upload Image
                    </label>
                    <input type="file" name='baImage' id='baImage' placeholder='Upload Image' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required accept='image/*'/>
                </div>
            </div>
            <button className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md'>
                Add Branch Admin
            </button>
        </form>

    </div>
  )
}

export default AddBranchAdmin