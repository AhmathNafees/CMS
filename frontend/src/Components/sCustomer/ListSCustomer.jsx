import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { CustomerButtons,columns as customerColumns} from '../../utils/SCustomerHelper';


const ListSCustomer = () => {
  const{supplierId}=useParams();
  const [sCustomers, setSCustomers]= useState([]);
  const [baLoading, setBaLoading] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // HandleStatusFilter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };


  const userRole = localStorage.getItem("userRole");  // "admin" or "branchAdmin"
  const userId = localStorage.getItem("userId");
  // console.log(userRole)
  // console.log("Role:", userRole, "UserID:", userId);

  const handleStatusChange = async (customerId, newStatus) => {
    // Find the current status of the customer
    const customer = sCustomers.find(c => c._id === customerId);

    // 🛑 Prevent API call if status is the same
    if (customer && customer.status === newStatus) {
      console.log("Status is the same — no update needed.");
      return;
    }
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/sCustomer/${customerId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // ✅ Show success message
      alert("Status updated successfully");
      // fetchCustomers();

      // Update state locally
      setSCustomers((prev) =>
        prev.map((c) =>
          c._id === customerId ? { ...c, status: newStatus } : c
        )
      );
      setFilteredCustomers((prev) =>
        prev.map((c) =>
          c._id === customerId ? { ...c, status: newStatus } : c
        )
      );
      fetchCustomers();
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };
  // ✅ Call baseColumns with the handler
  const dynamicColumns = customerColumns(
    handleStatusChange,
    userRole,
  );

  //Fetch Customers///////////////
  const fetchCustomers = async()=>{
    setBaLoading(true)
    try{
      let url = "";

      if (userRole === "admin" && supplierId) {
        // Main admin viewing a supplier's sCustomers
        url = `http://localhost:3000/api/sCustomer/bySupplier/${supplierId}`;

      }else if (userRole === "supplier") {
        // supplier logged in; show their own sCustomers
        url = `http://localhost:3000/api/sCustomer/`;
      } else if (userRole === "admin") {
        // Main admin viewing all
        url = `http://localhost:3000/api/sCustomer/`;
      }
      const response = await axios.get(url,{
        headers: {
          Authorization :`Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      // console.log(response.data)
      if(response.data.success){
        const sortedCustomers = response.data.sCustomers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) // newest first
          );
        // console.log("💡 API Raw Customer", response.data.sCustomers);
        const data =sortedCustomers.map((customer, index)=>(
          {
            ...customer,
            _id:customer._id,
            sno:index+1,
            name:customer.name,
            status: customer.status,
            pno:customer.pno,
            email:customer.email,
            homeAdd:customer.homeAdd,
            nic:customer.nic,
            dob:new Date(customer.dob).toLocaleDateString("en-GB"),
            gender:customer.gender,
            maritalStatus:customer.maritalStatus,
            desc:customer.desc,
            Admin_name:customer.supplierId.name,
            profileImage:<img width={100} className=' rounded-full' src={`http://localhost:3000/${customer.profileImage}`}/>,
            cvPdf:<a href={`http://localhost:3000/${customer.cvPdf}`} target='_blank' rel="noopener noreferrer">Downlaod CV</a>,
            passportPdf:<a href={`http://localhost:3000/${customer.passportPdf}`} target='_blank' rel="noopener noreferrer">Downlaod Passport PDF</a>,
            createdAt: new Date(customer.createdAt).toLocaleDateString("en-US", {year: "numeric",month: "numeric", day: "numeric"}),
            updatedAt : new Date(customer.updatedAt).toLocaleString('en-GB',{
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            
            action: (<CustomerButtons _id={customer._id} onDelete={fetchCustomers} />),
          }
        ))
        setSCustomers(data)
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
  useEffect(()=>{
    
    fetchCustomers();
    
  },[]);

  const applyAllFilters = (name = searchTerm, from = fromDate, to = toDate) => {
    const filtered = sCustomers.filter((cus) => {
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
    const filtered = sCustomers.filter((cus) => {
      const createdDate = new Date(cus.createdAt);
      return (
        (!fromDate || createdDate >= new Date(fromDate)) &&
        (!toDate || createdDate <= new Date(toDate))
      );
    });
    setFilteredCustomers(filtered);
  };

  // For Status Filter
  useEffect(() => {
    const filtered = sCustomers.filter((cus) => {
      const nameMatch = cus.name.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "all" || cus.status === statusFilter;
      return nameMatch && statusMatch;
    });
    setFilteredCustomers(filtered);
  }, [sCustomers, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const headers = [
      "S.No", "Name", "Status", "Phone", "Email","NIC", "DOB", "Gender", "Address","Marital Status", "Description", "Profile Image", "CV PDF", "Passport PDF", "Admin Name", "Branch Name", "Created At", "Updated At"
    ];

    const rows = filteredCustomers.map((customer,i) => ({
      "S No": i+1,
      "Name": customer.name,
      "Phone": customer.pno,
      "Email": customer.email,
      "NIC": customer.nic,
      "DOB": customer.dob,
      "Gender": customer.gender,
      "Marital Status": customer.maritalStatus,
      "Address": customer.homeAdd,
      "Branch Admin": customer.Admin_name,
      "Status": customer.status,
      "Description": customer.desc,
      "Profile Image": `${customer.profileImage?.props?.src || ""}`,
      "CV PDF": `${customer.cvPdf?.props?.href || ""}`,
      "Passport PDF": `${customer.passportPdf?.props?.href || ""}`,
      "Created At": customer.createdAt,
      "Updated At": customer.updatedAt,
    }));

    const csvContent = [
      headers.join(","),
      ...rows.map(row => headers.map(h => `"${row[h] || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Supply_Customers_full_details.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='p-5 flex-1'>
        
        <div className='flex justify-between items-center'>
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
          {userRole === "supplier" ? (
            <Link
              to="/supplier-dashboard/add-scustomer"
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
        <div className="flex gap-2 justify-between mb-4">
          <div className="flex gap-2 mt-3">
            <span>from</span>
            <input
              type="date"
              className="border p-1 rounded"
              value={fromDate}
               onChange={(e) => {
                const newFrom = e.target.value;
                setFromDate(newFrom);
                applyAllFilters(searchTerm, newFrom, toDate);
              }}
            />
            <span>to</span>
            <input
              type="date"
              className="border p-1 rounded"
              value={toDate}
              onChange={(e) => {
                const newTo = e.target.value;
                setToDate(newTo);
                applyAllFilters(searchTerm, fromDate, newTo);
              }}
            />
          </div>
          <div className='mt-3'>
            <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800"
          >
            Export Full Details CSV
          </button>
          </div>
        </div>

        <div className='items-start mt-5'>
          <select
            className="border px-3 py-1 rounded"
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <option value="all">All Statuses</option>
            <option value="begin">Begin</option>
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
            <option value="reject">Reject</option>
          </select>
        </div>
        <div className='mt-5 '>
          <DataTable
            columns={dynamicColumns}
            data={filteredCustomers}
            pagination
            defaultSortFieldId="createdAt"
            defaultSortAsc={false}
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
                },
              },
            }}
          />
        </div>
      </div>
  )
}

export default ListSCustomer