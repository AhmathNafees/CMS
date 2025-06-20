import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { BranchAdminButtons, columns } from '../../utils/BranchAdminHelper';
import { CustomerCareButtons,customerCarecolumns } from '../../utils/CustomerCareHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const ListBranchAdmin = ({ role }) => {
  const [branchAdmins, setBranchAdmins]= useState([]);
  const [baLoading, setBaLoading] = useState(false)
  const [filteredBranchAdmins, setFilteredBranchAdmins] = useState([])



  useEffect(()=>{
    const fetchbranchAdmins = async()=>{
      setBaLoading(true)
      try{
          const endpoint = role === 'customerCare'
            ? 'http://localhost:3000/api/customerCare'
            : 'http://localhost:3000/api/branchAdmin';

          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          // console.log(response.data)
        if(response.data.success){
          let sno =1;
          const data =await response.data.branchAdmins.map((bAdmin)=>(
            {
              _id:bAdmin._id,
              sno:sno++,
              pno:bAdmin.userId.pno,
              branch_name:bAdmin.branch.branch_name,
              name:bAdmin.userId.name,
              role:bAdmin.userId.role,
              dob: new Date (bAdmin.dob).toDateString(),
              profileImage:<img width={40} className=' rounded-full' src={`http://localhost:3000/${bAdmin.userId.profileImage}`}/>,
              nic:bAdmin.nic,
              action: role ==='branchAdmin' ?(<BranchAdminButtons _id={bAdmin._id} onDelete={fetchbranchAdmins}/>):(<CustomerCareButtons _id={bAdmin._id} onDelete={fetchbranchAdmins}/>),
            }
          ))
          setBranchAdmins(data)
          setFilteredBranchAdmins(data)
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }

      }finally{
        setBaLoading(false)
      }
    };
    fetchbranchAdmins();
  },[role]);

  const handleFilter = (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const records = branchAdmins.filter((bAdmin) =>
    bAdmin.name.toLowerCase().includes(searchTerm)
  );
  setFilteredBranchAdmins(records);
};

  return (
    <div className='p-5 flex-1'>
        <div className='text-center'>
          <h3 className=' text-2xl font-bold'>{role === 'customerCare' ? 'Manage Customer Care Admins' : 'Manage Branch Admins'}</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Branch Admin Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65' onChange={handleFilter}
          />
          <Link to="/admin-dashboard/add-branchAdmin" className=' px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white'>Add New {role === 'customerCare' ? 'Customer Care Admin' : 'Branch Admin'}</Link>
        </div>
        <div className='mt-5'>
          {role === 'branchAdmin' ?(
            <DataTable
              columns={columns}
              data={filteredBranchAdmins}
              pagination
            />
          ):(<DataTable
              columns={customerCarecolumns}
              data={filteredBranchAdmins}
              pagination
            />)
          }
          
        </div>
      </div>
  )
}

export default ListBranchAdmin