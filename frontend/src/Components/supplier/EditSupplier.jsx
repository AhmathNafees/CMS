import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { data, useNavigate, useParams } from 'react-router-dom'
import { fetchBranches } from '../../utils/BranchAdminHelper'

const EditSupplier = () => {
    const  [supplier, setSupplier] = useState({
        name: '',
        email:'',
        nic:'',
        dob:'',
        pno:'',
        gender:'',
        maritalStatus:'',
        profileImage:'',
        role:'',
    })
    const [formData, setFormData] =useState({})
    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(()=>{
        const fetchSupplier = async()=>{
      try{
        const response = await axios.get(`http://localhost:3000/api/supplier/${id}`,{
          headers: {
            "Authorization" :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        // console.log(response.data)
        if(response.data.success){
            
            const supplier= response.data.supplier
            setSupplier((prev)=>({...prev, 
            name:supplier.name,
            email:supplier.email,
            nic:supplier.nic,
            pno:supplier.pno,
            dob: supplier.dob ? new Date(supplier.dob).toISOString().split('T')[0] : "",
            gender:supplier.gender,
            maritalStatus:supplier.maritalStatus,
            profileImage:supplier.profileImage,
            }))
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }
      }
    };
    fetchSupplier();
    },[id])

    // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setSupplier((prevData) => ({ ...prevData, [name]: value }));
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
            const response = await axios.put(`http://localhost:3000/api/supplier/edit/${id}`, formDataObj, {
                headers:{"Authorization" : `Bearer ${localStorage.getItem("accessToken")}`,"Content-Type": "multipart/form-data",}
            })
        if(response.data.success){
            navigate("/admin-dashboard/supplier");
        }
        }catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }
    
  return (
    <>
    {supplier ? (
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className=' text-2xl font-bold mb-6'>Edit Supplier</h2>
        <form action="" onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                    <label htmlFor="name" className=' block text-sm font-medium text-gray-700'>
                        Name
                    </label>
                    <input type="text" name='name' id='name' placeholder='Enter Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={supplier.name}/>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="baEmail" className=' block text-sm font-medium text-gray-700'>
                        Email Address
                    </label>
                    <input type="email" name='email' id='baEmail' placeholder='Enter Email / Gmail' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}
                    value={supplier.email} />
                </div>
                {/* Phone Number */}
                <div>
                    <label htmlFor="pno" className=' block text-sm font-medium text-gray-700'>
                        Phone Number
                    </label>
                    <input type="tel" name='pno' id='pno' placeholder='Enter Phone Number' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}
                    value={supplier.pno} />
                </div>

                {/* Branch Admin ID */}
                <div>
                    <label htmlFor="baID" className=' block text-sm font-medium text-gray-700'>
                        Branch Admin ID (NIC)
                    </label>
                    <input type="text" name='nic' id='baID' placeholder='NIC' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={supplier.nic}/>
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="baDOB" className=' block text-sm font-medium text-gray-700'>
                        Date of Birth
                    </label>
                    <input type="date" name='dob' id='baDOB' placeholder='DOB' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={supplier.dob}/>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="baGender" className=' block text-sm font-medium text-gray-700'>
                        Gender
                    </label>
                    <select  name='gender' id='baGender' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={supplier.gender}>
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
                    <select  name='maritalStatus' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' id='maritalStatus' required onChange={handleChange} value={supplier.maritalStatus}>
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="Married">Married</option>
                    </select>
                </div>

                {/* Image Upload */}
                {/* Optional: Display current profile image */}
                {supplier.profileImage && (
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-700'>Current Profile Image</label>
                    <img
                    src={`http://localhost:3000/${supplier.profileImage}`}
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
                Update Supplier
            </button>
        </form>

    </div>
    ): <div>Loading...</div>}
    </>
    
  )
}

export default EditSupplier