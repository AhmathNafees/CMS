import React from 'react'
import {Link} from 'react-router-dom'

const ListBranchAdmin = () => {
  return (
    <div className='p-5 flex-1'>
        <div className='text-center'>
          <h3 className=' text-2xl font-bold'>Manage Branch Admins</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Branch Admin Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65' 
          />
          <Link to="/admin-dashboard/add-branchAdmin" className=' px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white'>Add New Branch Admin</Link>
        </div>
        {/* <div className='mt-5'>
          <DataTable
            columns={columns}
            data={filteredBranches}
            pagination
          />
        </div> */}
      </div>
  )
}

export default ListBranchAdmin