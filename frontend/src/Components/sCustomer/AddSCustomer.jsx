import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddSCustomer = () => {
    const [formData, setFormData] =useState({})
    const navigate = useNavigate()
    
    const handleChange =(e)=>{
        const{name, value, files} =e.target
        // Check if the field is a file input (for profileImage or passportImage)
        if ((name === "profileImage" || name === "passportPdf" || name === "cvPdf") && files && files.length > 0) {
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
            const response = await axios.post('http://localhost:3000/api/sCustomer/add', formDataObj, {
                headers:{"Authorization" : `Bearer ${localStorage.getItem("accessToken")}`}
            })
        if(response.data.success){
            navigate("/supplier-dashboard/sCustomers")
        }
        console.log("profileImage:", req.files?.profileImage?.[0]?.filename);
        console.log("passportPdf:", req.files?.passportPdf?.[0]?.filename);
        console.log("cvPdf:", req.files?.cvPdf?.[0]?.filename);
        }catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }


    }
    
  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className=' text-2xl font-bold mb-6'>Add New Customer</h2>
        <form action="" onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                    <label htmlFor="baName" className=' block text-sm font-medium text-gray-700'>
                        Name
                    </label>
                    <input type="text" name='name' id='baName' placeholder='Enter Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange}/>
                </div>
                {/* Phone Number */}
                <div>
                    <label htmlFor="pno" className=' block text-sm font-medium text-gray-700'>
                        Mobile Number
                    </label>
                    <input type="tel" name='pno' id='pno' placeholder='Mobile Number' className='mt-1 p-2 block w-full border border-gray-300 rounded-md'  onChange={handleChange}/>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="baEmail" className=' block text-sm font-medium text-gray-700'>
                        Email Address
                    </label>
                    <input type="email" name='email' id='baEmail' placeholder='Enter Email / Gmail' className='mt-1 p-2 block w-full border border-gray-300 rounded-md'  onChange={handleChange} />
                </div>
                {/* NIC */}
                <div>
                    <label htmlFor="nic" className=' block text-sm font-medium text-gray-700'>
                        NIC
                    </label>
                    <input type="text" name='nic' id='nic' placeholder='NIC' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' onChange={handleChange}/>
                </div>
                {/* Home Address */}
                <div>
                    <label htmlFor="homeAdd" className=' block text-sm font-medium text-gray-700'>
                        Home Address
                    </label>
                    <textarea name="homeAdd" id="homeAdd" placeholder='Home Address' className=' mt-1 p-2 block w-full border border-gray-300 rounded-md ' rows="4" 
                    onChange={handleChange}/>
                </div>
                {/* Purpose Description */}
                <div>
                    <label htmlFor="desc" className=' block text-sm font-medium text-gray-700'>
                        Purpose Descrption
                    </label>
                    <textarea name="desc" id="desc" placeholder='Eg.Work Description' className=' mt-1 p-2 block w-full border border-gray-300 rounded-md ' rows="4" 
                    onChange={handleChange}/>
                </div>

                {/* Passport PDF Upload */}
                <div>
                    <label htmlFor="passportPdf" className='block text-sm font-medium text-gray-700'>
                        Upload Passport (PDF only)
                    </label>
                    <input
                        type="file"
                        name="passportPdf"
                        id="passportPdf"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        accept="application/pdf"
                        onChange={handleChange}
                    />
                </div>

                {/* CV Upload */}
                <div>
                    <label htmlFor="cvPdf" className='block text-sm font-medium text-gray-700'>
                        Upload CV (PDF only)
                    </label>
                    <input
                        type="file"
                        name="cvPdf"
                        id="cvPdf"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        accept="application/pdf"
                        onChange={handleChange}
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="baDOB" className=' block text-sm font-medium text-gray-700'>
                        Date of Birth
                    </label>
                    <input type="date" name='dob' id='baDOB' placeholder='DOB' className='mt-1 p-2 block w-full border border-gray-300 rounded-md'  onChange={handleChange}/>
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
                    <select  name='maritalStatus' className='mt-1 p-2 block w-full border border-gray-300 rounded-md'  onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="Married">Married</option>
                    </select>
                </div>


                {/* Image Upload */}
                <div>
                    <label htmlFor="baImage" className=' block text-sm font-medium text-gray-700'>
                        Upload Profile Image
                    </label>
                    <input type="file" name='profileImage' id='baImage' placeholder='Upload Image' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' accept='image/*' onChange={handleChange}/>
                </div>
            </div>
            <button className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md'>
                Add Customer
            </button>
        </form>

    </div>
  )
}

export default AddSCustomer