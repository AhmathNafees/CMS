import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { data, useNavigate, useParams } from 'react-router-dom'

export const columns = () =>[
  {
    name: "S No",
    selector: (row)=> row.sno,
    sortable : true,
    width:"75px",
  },
  {
    name: "Customer Name",//coloumn name
    selector: (row)=> row.name, //in the jsx file name given
    sortable : true,
    width:"160px",
  },
  {
    name: "Phone Number",
    selector: (row)=> row.pno,
    width:"150px",
  },
  {
    id: 'createdAt', // 🔑 Add an ID for sorting
    name: "Created",
    selector: (row)=> row.createdAt,
    width:"130px",
    sortable:true,
    
  },
  {
    name: "Action",
    selector: (row)=> row.action,
    width:"200px",
    center:"true",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    center: true,
    width:"130px",
  },
  {
    name: "Handled By",
    selector: (row) => row.handledBy,
    center: true,
    width:"130px",
  },
  {
    name: "Send Branch",
    selector: (row) => row.branch,
    center: true,
    width:"130px",
  },
]

export const CustomerButtons = ({ _id, customer  }) => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({});
  const userRole = localStorage.getItem("userRole");
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/branch', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.data.success) {
        setBranches(response.data.branches); // ✅ update state here
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target.value;
    if (name === "profileImage") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  const handleSend = async () => {
    if (!selectedBranchId) {
      return alert("Please select a branch before sending.");
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/request",
        {
          indexCustomerId:_id,
          branchId: selectedBranchId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success) {
        alert("Request sent successfully!");
        if (onSuccess) onSuccess(); // ✅ Refresh
      } else {
        alert("Failed to send request.");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Request failed.");
      console.error(err);
    }
  };
  

  return (
    <div className="flex space-x-3">
      {/* Branch Dropdown */}
      <div>
        <select
          name='branch'
          id='branch'
          className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
          required
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
        >
          <option value="">Select Branch</option>
          {branches.map(bra => (
            <option key={bra._id} value={bra._id}>{bra.branch_name}</option>
          ))}
        </select>
        <button className='w-full mt-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer' onClick={handleSend}>
            Send
        </button>
      </div>
    </div>
  );
};
