import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { CustomerButtons,columns as baseColumns} from '../../utils/CustomerHelper';

const ListCustomer = () => {
  const { branchAdminId } = useParams();
  const [customers, setCustomers]= useState([]);
  const [baLoading, setBaLoading] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState([])
   const [selectedRowId, setSelectedRowId] = useState(null);

  const userRole = localStorage.getItem("userRole");  // "admin" or "branchAdmin"
  const userId = localStorage.getItem("userId");
  // console.log(userRole)

  
  const handleStatusChange = async (customerId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/customer/${customerId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Update state locally
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === customerId ? { ...c, status: newStatus } : c
        )
      );
      setFilteredCustomers((prev) =>
        prev.map((c) =>
          c._id === customerId ? { ...c, status: newStatus } : c
        )
      );
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };
  // ✅ Call baseColumns with the handler
  const dynamicColumns = baseColumns(handleStatusChange);


  useEffect(()=>{
    const fetchCustomers = async()=>{
      setBaLoading(true)
      try{
        let url = "";

        if (userRole === "admin" && branchAdminId) {
          // Main admin viewing a branch admin's customers
          url = `http://localhost:3000/api/customer/byBranchAdmin/${branchAdminId}`;
        } else if (userRole === "branchAdmin") {
          // Branch admin logged in; show their own Branch customers
          url = `http://localhost:3000/api/customer/`;
        } else if (userRole === "admin") {
          // Main admin viewing all
          url = `http://localhost:3000/api/customer/`;
        }
        const response = await axios.get(url,{
          headers: {
            Authorization :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        // console.log(response.data)
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
              nic:customer.nic,
              status: customer.status,
              createAt: new Date(customer.createAt).toLocaleDateString("en-US", {year: "numeric",month: "numeric",
              day: "numeric"}),
              profileImage:<img width={40} className=' rounded-full' src={`http://localhost:3000/${customer.profileImage}`}/>,
              
              action: (<CustomerButtons _id={customer._id} onDelete={fetchCustomers} />),
            }
          ))
          setCustomers(data)
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
  const searchTerm = e.target.value.toLowerCase();
  const records = customers.filter((cus) =>
    cus.name.toLowerCase().includes(searchTerm)
  );
  setFilteredCustomers(records);
  };

  // Handler when a row is clicked; toggle selection
  const handleRowClick = (row) => {
    setSelectedRowId((prevId) => (prevId === row._id ? null : row._id));
  };
  // conditionalRowStyles for clicked (selected) row
  const conditionalRowStyles = [
    {
      when: (row) => row._id === selectedRowId,
      style: {
        transition: 'all 1s ease-in-out',
        height: '170px',
        alignItems: 'flex-start',
      },
    },
  ];

  return (
    <div className='p-5 flex-1'>
        <div className='text-center'>
          <h3 className=' text-2xl font-bold'>Manage Customers</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Customer Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65' onChange={handleFilter}
          />
          {userRole === "branchAdmin" && (
            <Link
              to="/branchAdmin-dashboard/add-customer"
              className="px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white"
            >
              Add New Customer
            </Link>
          )}
        </div>
        <div className='mt-5 '>
          <DataTable
            columns={dynamicColumns}
            data={filteredCustomers}
            pagination
            onRowClicked={handleRowClick}
            conditionalRowStyles={conditionalRowStyles}
            customStyles={{
              pagination: {
                style: {
                  backgroundColor: '#f1f5f9',
                  borderTop: '1px solid #ccc',
                },
              },
              rows: {
                style: {
                  minHeight: '72px', // adjust as needed
                  marginTop:"10px",
                  // '&:hover':{
                  //   transition: 'all 1s ease-in-out',
                  //   height: '170px',
                  //   alignItems: 'flex-start', // pushes content to top
                  // }
                },
              },
            }}
          />
        </div>
      </div>
  )
}

export default ListCustomer