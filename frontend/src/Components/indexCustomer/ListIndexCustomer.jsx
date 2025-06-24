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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


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
              name:customer.name,
              pno:customer.pno,
              location:customer.location,
              gender:customer.gender,
              desc:customer.desc,
              profileImage:<img width={40} className=' rounded-full' src={`http://localhost:3000/${customer.profileImage}`}/>,
              cvPdf:<a href={`http://localhost:3000/${customer.cvPdf}`} target='_blank' rel="noopener noreferrer">Downlaod CV</a>,
              passportpdf:<a href={`http://localhost:3000/${customer.passportpdf}`} target='_blank' rel="noopener noreferrer">Downlaod Passport PDF</a>,
              Admin_name:customer.userId.name,
              branch_name:customer.branchId.branch_name,
              createdAt: new Date(customer.createdAt).toLocaleDateString("en-US", {year: "numeric",month: "numeric",
              day: "numeric"}),
              updatedAt: new Date(customer.updatedAt).toLocaleDateString("en-US", {year: "numeric",month: "numeric",
              day: "numeric"}),
              
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

  const applyAllFilters = (name = searchTerm, from = fromDate, to = toDate) => {
    const filtered = indexCustomers.filter((cus) => {
      const matchName = cus.name.toLowerCase().includes(name.toLowerCase());

      const createdDate = new Date(cus.createdAt);
      const inRange =
        (!from || createdDate >= new Date(from)) &&
        (!to || createdDate <= new Date(to));

      return matchName && inRange;
    });

    setFilteredCustomers(filtered);
  };


  const handleDateChange = () => {
    const filtered = indexCustomers.filter((cus) => {
      const createdDate = new Date(cus.createdAt);
      return (
        (!fromDate || createdDate >= new Date(fromDate)) &&
        (!toDate || createdDate <= new Date(toDate))
      );
    });
    setFilteredCustomers(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      "S.No", "Name", "Phone", "Gender", "Location", "Description", "Profile Image",
      "CV PDF", "Passport PDF", "Admin Name", "Branch Name", "Created At", "Updated At"
    ];

    const rows = filteredCustomers.map((cus, i) => ({
      "S.No": i + 1,
      "Name": cus.name,
      "Phone": cus.pno,
      "Gender": cus.gender,
      "Location": cus.location,
      "Description": cus.desc,
      "Profile Image": `http://localhost:3000/${cus.profileImage?.props?.src || ""}`,
      "CV PDF": `http://localhost:3000/${cus.cvPdf?.props?.href || ""}`,
      "Passport PDF": `http://localhost:3000/${cus.passportpdf?.props?.href || ""}`,
      "Admin Name": cus.Admin_name,
      "Branch Name": cus.branch_name,
      "Created At": cus.createdAt,
      "Updated At": cus.updatedAt
    }));

    const csvContent = [
      headers.join(","),
      ...rows.map(row => headers.map(h => `"${row[h] || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "index_customers_full_details.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const dynamicColumns = columns(
      userRole,
    );
  return (
    <div className='p-5 flex-1'>
        <div className='flex justify-between items-center '>
          <input type="text" placeholder='Search By Customer Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65' onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            applyAllFilters(value, fromDate, toDate);
          }}
          />
          
          <div className='text-center'>
            <h3 className=' text-2xl font-bold'>Manage Customers</h3>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={exportToCSV}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-800"
            >
              Export Full Details CSV
            </button>
            {userRole === "customerCare" && (
              <Link
                to="/customerCare-dashboard/add-indexCustomer"
                className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-800"
              >
                Add New Customer
              </Link>
            )}
          </div>
        </div>
        <div className='flex gap-2 mt-1'>
          <div>
            <label htmlFor="">from </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                const newFrom = e.target.value;
                setFromDate(newFrom);
                applyAllFilters(searchTerm, newFrom, toDate);
              }}

              className="px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label htmlFor="">to </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                const newTo = e.target.value;
                setToDate(newTo);
                applyAllFilters(searchTerm, fromDate, newTo);
              }}

              className="px-2 py-1 border rounded"
            />
          </div>
        </div>
        <div className='mt-5 '>
          <DataTable
            columns={dynamicColumns}
            data={filteredCustomers}
            pagination
            defaultSortFieldId="createdAt"
            defaultSortAsc={false}
          />
        </div>
      </div>
  )
}

export default ListIndexCustomer