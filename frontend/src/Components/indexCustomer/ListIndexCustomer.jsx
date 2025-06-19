import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { CustomerButtons,columns} from '../../utils/IndexCustomerHelper';

const ListIndexCustomer = () => {
  const { branchAdminId,branchId } = useParams();
  const [indexCustomers, setIndexCustomers]= useState([]);
  const [baLoading, setBaLoading] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

  const userRole = localStorage.getItem("userRole");  // "admin" or "branchAdmin"
  const userId = localStorage.getItem("userId");
  // console.log(userRole)

  
  useEffect(()=>{
    const fetchCustomers = async()=>{
      setBaLoading(true)
      try{
        let url = "";

        if (userRole === "admin" && branchAdminId) {
          // Main admin viewing a branch admin's customers
          url = `http://localhost:3000/api/IndexCustomer/byBranchAdmin/${branchAdminId}`;
        } else if (userRole === "admin" && branchId ) {
          // Main admin logged in; show Branch's customers
          url = `http://localhost:3000/api/IndexCustomer/byBranch/${branchId}`;
        }else if (userRole === "customerCare") {
          // Branch admin logged in; show their own Branch customers
          url = `http://localhost:3000/api/IndexCustomer/`;
        } else if (userRole === "admin") {
          // Main admin viewing all
          url = `http://localhost:3000/api/IndexCustomer/`;
        }
        const response = await axios.get(url,{
          headers: {
            Authorization :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        // console.log(response.data)
        if(response.data.success){
          let sno =1;
          const data =await response.data.indexCustomers.map((customer)=>(
            {
              _id:customer._id,
              sno:sno++,
              branch_name:customer.branchId.branch_name,
              Admin_name:customer.userId.name,
              name:customer.name,
              pno:customer.pno,
              createAt: new Date(customer.createAt).toLocaleDateString("en-US", {year: "numeric",month: "numeric",
              day: "numeric"}),
              profileImage:<img width={40} className=' rounded-full' src={`http://localhost:3000/${customer.profileImage}`}/>,
              
              action: (<CustomerButtons _id={customer._id} onDelete={fetchCustomers} />),
            }
          ))
          setIndexCustomers(data)
          setFilteredCustomers(data)
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

  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
    const searchTerm = e.target.value.toLowerCase();
    const records = indexCustomers.filter((cus) =>
      cus.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomers(records);
  };

  return (
    <div className='p-5 flex-1'>
        
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Customer Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65' onChange={handleFilter}
          />
          <div className='text-center'>
            <h3 className=' text-2xl font-bold'>Manage Customers</h3>
          </div>
          {userRole === "customerCare" ? (
            <Link
              to="/customerCare-dashboard/add-indexCustomer"
              className="px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white"
            >
              Add New Customer
            </Link>
          ): (
            <div className="text-sm text-gray-500">
              {/* You are not authorized to add a customer. */}
            </div>
          )}
        </div>
        <div className='mt-5 '>
          <DataTable
            columns={columns()}
            data={filteredCustomers}
            pagination
          />
        </div>
      </div>
  )
}

export default ListIndexCustomer