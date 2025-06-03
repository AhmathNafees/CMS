import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { BranchButtons, columns } from '../../utils/BranchHelper';
import axios from 'axios';

const BranchList = () => {
  const [branches, setBranches]= useState([]);
  const [braLoading, setBraLoading] = useState(false)

  useEffect(()=>{
    const fetchBranches = async()=>{
      setBraLoading(true)
      try{
        const response = await axios.get('http://localhost:3000/api/branch',{
          headers: {
            "Authorization" :`Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.data.success){
          let sno =1;
          const data =await response.data.branches.map((branch)=>(
            {
              _id:branch._id,
              sno:sno++,
              branch_name:branch.branch_name,
              action: (<BranchButtons _id={branch._id}/>),
            }
          ))
          setBranches(data)
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }

      }finally{
        setBraLoading(false)
      }
    };
    fetchBranches();
  },[])
  
  return (
    <>
      {braLoading ? <div>Loading...</div>:
      <div className='p-5'>
        <div className='text-center'>
          <h3 className=' text-2xl font-bold'>Manage Branches</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Branch Name' 
          className=' px-4 py-0.5 ml-1 border rounded'/>
          <Link to="/admin-dashboard/add-branch" className=' px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white'>Add New Branch</Link>
        </div>
        <div className='mt-5'>
          <DataTable
            columns={columns}
            data={branches}
          />
        </div>
      </div>}
    </>
    
  )
}

export default BranchList