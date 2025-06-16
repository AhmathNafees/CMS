import React, { useEffect, useState } from 'react'
import { fetchBranches } from '../../utils/BranchAdminHelper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AddBranchAdmin = () => {
    const  [branches, setBranches] = useState([])
    const [formData, setFormData] =useState({})
    const navigate = useNavigate()

    useEffect(()=>{
        const getBranches = async()=>{
            const branches=await fetchBranches()
            setBranches(branches)
        }
        getBranches()
        
    },[])

    const handleChange =(e)=>{
        const{name, value, files} =e.target
        if(name === "profileImage"){
            setFormData((prevData)=>({...prevData, [name]:files[0]}))
        }else{
            setFormData((prevData)=>({...prevData, [name]:value}))
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const formDataObj = new FormData()
        Object.keys(formData).forEach((key)=>{
            formDataObj.append(key, formData[key])
        })

        try{
            const response = await axios.post('http://localhost:3000/api/branchAdmin/add', formDataObj, {
                headers:{"Authorization" : `Bearer ${localStorage.getItem("accessToken")}`}
            })
        if(response.data.success){
            navigate("/admin-dashboard/branchadmins")
        }
        }catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }


    }
    const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className=' text-2xl font-bold mb-6'>Add New Branch Admin</h2>
        <form action="" onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                    <label htmlFor="baName" className=' block text-sm font-medium text-gray-700'>
                        Name
                    </label>
                    <input type="text" name='name' id='baName' placeholder='Enter Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}/>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="baEmail" className=' block text-sm font-medium text-gray-700'>
                        Email Address
                    </label>
                    <input type="email" name='email' id='baEmail' placeholder='Enter Email / Gmail' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} />
                </div>

                {/* Branch Admin ID */}
                <div>
                    <label htmlFor="baID" className=' block text-sm font-medium text-gray-700'>
                        Branch Admin ID (NIC)
                    </label>
                    <input type="text" name='nic' id='baID' placeholder='NIC' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}/>
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="baDOB" className=' block text-sm font-medium text-gray-700'>
                        Date of Birth
                    </label>
                    <input type="date" name='dob' id='baDOB' placeholder='DOB' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}/>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="baGender" className=' block text-sm font-medium text-gray-700'>
                        Gender
                    </label>
                    <select  name='gender' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}>
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
                    <select  name='maritalStatus' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}>
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
                    <select  name='branch' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}>
                        <option value="">Select Branch</option>
                        {branches.map(bra =>(
                            <option key={bra._id} value={bra._id}>{bra.branch_name}</option>
                        ))}
                        
                    </select>
                </div>

                {/* Password */}
                <div className=' relative'>
                    <label htmlFor="baPassword" className=' block text-sm font-medium text-gray-700'>
                        Password
                    </label>
                    <input type={showPassword ? "text" : "password"} name='password' id='baPassword' placeholder='********' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}/>
                    <div
                        className="absolute inset-y-10 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                    </div>
                </div>

                {/* Role */}
                <div>
                    <label htmlFor="role" className=' block text-sm font-medium text-gray-700'>
                        Role
                    </label>
                    <select  name='role' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}>
                        <option value="">Select Role</option>
                        <option value="admin">Main Admin</option>
                        <option value="branchAdmin">Branch Admin</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="baImage" className=' block text-sm font-medium text-gray-700'>
                        Upload Image
                    </label>
                    <input type="file" name='profileImage' id='baImage' placeholder='Upload Image' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required accept='image/*' onChange={handleChange}/>
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