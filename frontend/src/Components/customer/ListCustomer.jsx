import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { CustomerButtons,columns } from '../../utils/CustomerHelper';

const ListCustomer = () => {
  const [customers, setCustomers]= useState([]);
  const [baLoading, setBaLoading] = useState(false)
  // const [filteredBranchAdmins, setFilteredBranchAdmins] = useState([])



  useEffect(()=>{
    const fetchCustomers = async()=>{
      setBaLoading(true)
      try{
        const response = await axios.get('http://localhost:3000/api/customer/',{
          headers: {
            Authorization :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if(response.data.success){
          let sno =1;
          const data =await response.data.customers.map((customer)=>(
            {
              _id:customer._id,
              sno:sno++,
              branch_name:customer.branchId.branch_name,
              Admin_name:customer.userId.name,
              name:customer.name,
              pno:customer.pno,
              email:customer.email,
              homeAdd:customer.homeAdd,
              nic:customer.nic,
              dob: new Date (customer.dob).toDateString(),
              gender:customer.gender,
              maritalStatus:customer.maritalStatus,
              profileImage:<img width={40} className=' rounded-full' src={`http://localhost:3000/${customer.profileImage}`}/>,
              
              action: (<CustomerButtons _id={customer._id} />),
            }
          ))
          setCustomers(data)
          // setFilteredBranchAdmins(data)
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }

      }finally{
        setBaLoading(false)
      }
    };
    fetchCustomers();
  },[]);

  // const handleFilter = (e) => {
  // const searchTerm = e.target.value.toLowerCase();
  // const records = branchAdmins.filter((bAdmin) =>
  //   bAdmin.name.toLowerCase().includes(searchTerm)
  // );
  // setFilteredBranchAdmins(records);
  // };

  return (
    <div className='p-5 flex-1'>
        <div className='text-center'>
          <h3 className=' text-2xl font-bold'>Manage Customers</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Customer Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65'
          />
          <Link to="/branchAdmin-dashboard/add-customer" className=' px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white'>Add New Customer</Link>
        </div>
        <div className='mt-5'>
          <DataTable
            columns={columns}
            data={customers}
            pagination
          />
        </div>
      </div>
  )
}

export default ListCustomer