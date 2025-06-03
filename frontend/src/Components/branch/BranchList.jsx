import React from 'react'
import {Link} from 'react-router-dom'

const BranchList = () => {
  return (
    <div className='p-5'>
      <div className='text-center'>
        <h3 className=' text-2xl font-bold'>Manage Branches</h3>
      </div>
      <div className='flex justify-between items-center'>
        <input type="text" placeholder='Search By Branch Name' 
        className=' px-4 py-0.5 ml-1 border rounded'/>
        <Link to="/admin-dashboard/add-branch" className=' px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white'>Add New Branch</Link>
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default BranchList