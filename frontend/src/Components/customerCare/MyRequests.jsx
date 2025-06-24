import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { CustomerButtons,columns} from '../customerCare/MyRequestsHelper';


const MyRequests = () => {
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
        const [custRes, reqRes] = await Promise.all([
          axios.get(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }),
          axios.get("http://localhost:3000/api/request/my-requests", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          })
        ]);
        const requestMap = {};
        reqRes.data.requests.forEach(req => {
          requestMap[req.indexCustomer._id] = {
            status: req.status,
            handledBy: req.handledBy?.name || "N/A"
          };
        });
        // console.log(response.data)
        if (custRes.data.success) {
        let sno = 1;
        const data = custRes.data.indexCustomers.map(customer => {
          const reqInfo = requestMap[customer._id] || { status: "Not Sent", handledBy: "-" };
          return {
            _id: customer._id,
            sno: sno++,
            name: customer.name,
            pno: customer.pno,
            createdAt: new Date(customer.createdAt).toLocaleDateString(),
            profileImage: <img width={40} className="rounded-full" src={`http://localhost:3000/${customer.profileImage}`} />,
            cvPdf: <a href={`http://localhost:3000/${customer.cvPdf}`} target="_blank" rel="noopener noreferrer">Download CV</a>,
            action: <CustomerButtons _id={customer._id} customer={customer} />,
            status: reqInfo.status,
            handledBy: reqInfo.handledBy,
          };
        });
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
            <h3 className=' text-2xl font-bold'>Send Index Customers</h3>
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
            defaultSortFieldId="createdAt" // 🔁 Sort by Created column
            defaultSortAsc={false}
          />
        </div>
    </div>
  )
}

export default MyRequests;