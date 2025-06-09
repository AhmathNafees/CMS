import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBranches } from '../../utils/BranchAdminHelper'

const EditBranchAdmin = () => {
    const  [branchAdmin, setBranchAdmin] = useState({
        name: '',
        email:'',
        nic:'',
        dob:'',
        gender:'',
        maritalStatus:'',
        branch:'',
        profileImage:'',
        role:'',
    })
    const [formData, setFormData] =useState({})
    const [branches, setBranches]= useState([])
    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(()=>{
            const getBranches = async()=>{
                const branches=await fetchBranches()
                setBranches(branches)
            }
            getBranches()
            
        },[])

    useEffect(()=>{
        const fetchBranchAdmin = async()=>{
      try{
        const response = await axios.get(`http://localhost:3000/api/branchAdmin/${id}`,{
          headers: {
            "Authorization" :`Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.data.success){
            const branchAdmin= response.data.branchAdmin
         setBranchAdmin((prev)=>({...prev, 
            name:branchAdmin.userId.name,
            email:branchAdmin.userId.email,
            nic:branchAdmin.nic,
            dob: branchAdmin.dob ? new Date(branchAdmin.dob).toISOString().split('T')[0] : "",
            gender:branchAdmin.gender,
            maritalStatus:branchAdmin.maritalStatus,
            branch:branchAdmin.branch ? branchAdmin.branch._id : '',
            role:branchAdmin.userId.role,
            }))
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }
      }
    };
    fetchBranchAdmin();
    },[id])

    // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setBranchAdmin((prevData) => ({ ...prevData, [name]: value }));
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  }


    const handleSubmit = async(e)=>{
        e.preventDefault()
        const formDataObj = new FormData()
        Object.keys(formData).forEach((key)=>{
            formDataObj.append(key, formData[key])
        })

        try{
            const response = await axios.put(`http://localhost:3000/api/branchAdmin/${id}`, formDataObj, {
                headers:{"Authorization" : `Bearer ${localStorage.getItem("token")}`,"Content-Type": "multipart/form-data",}
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
    
  return (
    <>
    {branches && branchAdmin ? (
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className=' text-2xl font-bold mb-6'>Edit Branch Admin</h2>
        <form action="" onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                    <label htmlFor="name" className=' block text-sm font-medium text-gray-700'>
                        Name
                    </label>
                    <input type="text" name='name' id='name' placeholder='Enter Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={branchAdmin.name}/>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="baEmail" className=' block text-sm font-medium text-gray-700'>
                        Email Address
                    </label>
                    <input type="email" name='email' id='baEmail' placeholder='Enter Email / Gmail' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}
                    value={branchAdmin.email} />
                </div>

                {/* Branch Admin ID */}
                <div>
                    <label htmlFor="baID" className=' block text-sm font-medium text-gray-700'>
                        Branch Admin ID (NIC)
                    </label>
                    <input type="text" name='nic' id='baID' placeholder='NIC' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={branchAdmin.nic}/>
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="baDOB" className=' block text-sm font-medium text-gray-700'>
                        Date of Birth
                    </label>
                    <input type="date" name='dob' id='baDOB' placeholder='DOB' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={branchAdmin.dob}/>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="baGender" className=' block text-sm font-medium text-gray-700'>
                        Gender
                    </label>
                    <select  name='gender' id='baGender' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={branchAdmin.gender}>
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
                    <select  name='maritalStatus' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' id='maritalStatus' required onChange={handleChange} value={branchAdmin.maritalStatus}>
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
                    <select  name='branch' id='branch' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={branchAdmin.branch_name}>
                        <option value="">Select Branch</option>
                        {branches.map(bra =>(
                            <option  key={bra._id} value={bra._id}>{bra.branch_name}</option>
                        ))}
                        
                    </select>
                </div>

                {/* Role */}
                <div>
                    <label htmlFor="role" className=' block text-sm font-medium text-gray-700'>
                        Role
                    </label>
                    <select  name='role' id='role' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={branchAdmin.role}>
                        <option value="">Select Role</option>
                        <option value="mainAdmin">Main Admin</option>
                        <option value="branchAdmin">Branch Admin</option>
                    </select>
                </div>

                {/* Image Upload */}
                {/* Optional: Display current profile image */}
                {branchAdmin.profileImage && (
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-700'>Current Profile Image</label>
                    <img
                    src={`http://localhost:3000/uploads/${branchAdmin.profileImage}`}
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-full"
                    />
                </div>
                )}
                <input
                    type="file"
                    name="profileImage"
                    id="baImage"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>
            <button className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md'>
                Update Branch Admin
            </button>
        </form>

    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default EditBranchAdmin