import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const EditIndexCustomer = () => {
    const  [indexCustomer, setIndexCustomer] = useState({
        name:'',
        pno:'',
        location:'',
        gender:'',
        profileImage:'',
        passportPdf:'',
        cvPdf:'',
        desc:'',
    })

    const [formData, setFormData] =useState({})
    const navigate = useNavigate()
    const {id} = useParams()
    useEffect(()=>{
      
      const fetchCustomer = async()=>{
        try{
          const response = await axios.get(`http://localhost:3000/api/indexCustomer/${id}`,{
            headers: {
              Authorization :`Bearer ${localStorage.getItem('accessToken')}`
            }
          })

          if(response.data.success){
          setIndexCustomer(response.data.indexCustomer)
            const indexCustomer= response.data.indexCustomer
            setIndexCustomer((prev)=>({...prev, 
            name:indexCustomer.name,
            gender:indexCustomer.gender,
            pno:indexCustomer.pno,
            location:indexCustomer.location,
            desc:indexCustomer.desc,
            profileImage:indexCustomer.profileImage,
            passportPdf:indexCustomer.passportPdf,
            cvPdf:indexCustomer.cvPdf,
            }))
          }
        }catch(error){
          if(error.response && !error.response.data.success){
          alert(error.response.data.error)
          }
        }
      };
      fetchCustomer();
  },[id]) // Added id as dependency

    const handleChange =(e)=>{
        const{name, value, files} =e.target
        // Check if the field is a file input (for profileImage or passportImage)
        if ((name === "profileImage" || name === "passportPdf" || name === "cvPdf") && files && files.length > 0) {
            setFormData((prevData)=>({...prevData, [name]:files[0]}))
        }else{
            setIndexCustomer((prevData)=>({...prevData, [name]:value}))
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
            const response = await axios.put(`http://localhost:3000/api/indexCustomer/edit/${id}`, formDataObj, {
                headers:{"Authorization" : `Bearer ${localStorage.getItem("accessToken")}`}
            })
        if(response.data.success){
            navigate("/customerCare-dashboard/indexCustomers")
        }
        }catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }


    }
    
  return (
    <>
        {indexCustomer?(
            <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className=' text-2xl font-bold mb-6'>Edit Customer</h2>
        <form action="" onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                    <label htmlFor="baName" className=' block text-sm font-medium text-gray-700'>
                        Name
                    </label>
                    <input type="text" name='name' id='baName' placeholder='Enter Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={indexCustomer.name}/>
                </div>
                {/* Phone Number */}
                <div>
                    <label htmlFor="pno" className=' block text-sm font-medium text-gray-700'>
                        Mobile Number
                    </label>
                    <input type="tel" name='pno' id='pno' placeholder='Mobile Number' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={indexCustomer.pno}/>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="homeAdd" className=' block text-sm font-medium text-gray-700'>
                        Location
                    </label>
                    <textarea name="location" id="homeAdd" placeholder='Customer Location' className=' mt-1 p-2 block w-full border border-gray-300 rounded-md ' rows="4" 
                    onChange={handleChange} value={indexCustomer.location}/>
                </div>
                {/* Purpose Description */}
                <div>
                    <label htmlFor="desc" className=' block text-sm font-medium text-gray-700'>
                        Purpose Descrption
                    </label>
                    <textarea name="desc" id="desc" placeholder='Eg.Work Description' className=' mt-1 p-2 block w-full border border-gray-300 rounded-md ' rows="4" required
                    onChange={handleChange} value={indexCustomer.desc}/>
                </div>

                {/* Passport Upload */}
                {indexCustomer.passportPdf && (
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Current Passport PDF</label>
                    <a className=' border p-0.5  rounded-md' href={`http://localhost:3000/${indexCustomer.passportPdf}`} target='_blank' rel="noopener noreferrer">Downlaod Passport</a>
                </div>
                )}
                <div>
                    <label htmlFor="passportImage" className=' block text-sm font-medium text-gray-700'>
                        Upload Passport By PDF
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
                {indexCustomer.cvPdf && (
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Current CV PDF</label>
                    <a className=' border p-0.5  rounded-md' href={`http://localhost:3000/${indexCustomer.cvPdf}`} target='_blank' rel="noopener noreferrer">Downlaod CV </a>
                </div>
                )}
                <div>
                    <label htmlFor="passportImage" className=' block text-sm font-medium text-gray-700'>
                        Upload CV By PDF
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

                {/* Gender */}
                <div>
                    <label htmlFor="baGender" className=' block text-sm font-medium text-gray-700'>
                        Gender
                    </label>
                    <select  name='gender' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required onChange={handleChange} value={indexCustomer.gender}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Image Upload */}
                {indexCustomer.profileImage && (
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-700'>Current Profile Image</label>
                    <img
                    src={`http://localhost:3000/${indexCustomer.profileImage}`}
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-full"
                    />
                </div>
                )}
                <div>
                    <label htmlFor="baImage" className=' block text-sm font-medium text-gray-700'>
                        Upload Profile Image
                    </label>
                    <input type="file" name='profileImage' id='baImage' placeholder='Upload Image' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' accept='image/*' onChange={handleChange}/>
                </div>
            </div>
            <button className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md'>
                Update Customer
            </button>
        </form>

    </div>
        ):<div>Loading...</div>}
    </>
    
  )
}

export default EditIndexCustomer