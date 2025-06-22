import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomStatusDropdown from './CustomStatusDropdown';
import { FaHourglassHalf, FaSyncAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const getStatusIcon = (status) => {
  switch (status) {
    case "begin":
      return <FaHourglassHalf />;
    case "processing":
      return <FaSyncAlt className="text-yellow-500" />;
    case "complete":
      return <FaCheckCircle className="text-green-500" />;
    case "reject":
      return <FaTimesCircle className="text-red-500" />;
    default:
      return null;
  }
};

export const columns = (handleStatusChange, userRole) =>{
  const baseColumns = [
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
      width:"120px",
    },
    {
      name: "Profile Image",
      selector: (row)=> row.profileImage,
      width:"110px",
      center:"true",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        if (userRole === "branchAdmin") {
          // console.log("🧪 Row Status:", row.status); // 👈 Add this
          return (
            <CustomStatusDropdown
              value={row.status}
              rowId={row._id}
              handleStatusChange={handleStatusChange}
            />
          );
        } else {
          return (
            <span className="flex items-center space-x-2">
              {getStatusIcon(row.status)}
              <span className="capitalize">{row.status}</span>
            </span>
          );
        }
      },
      width:'170px',
      center:'true'

    },
    // {
    //   name: "Created",
    //   selector: (row)=> row.createAt,
    //   width:"130px",
    //   sortable:true,
      
    // },
    {
      name: "Updated",
      selector: (row)=> row.updatedAt,
      // width:"130px",
      sortable:true,
      
    },
    {
      name: "Action",
      selector: (row)=> row.action,
      center:'true',
    },
  ]

  if (userRole === "admin") {
    baseColumns.splice(5, 0, {
      name: "Branch Admin",
      selector: (row) => row.Admin_name,
      sortable: true,
      width: "130px",
    }),
    baseColumns.splice(6, 0, {
      name: "Branch",
      selector: (row) => row.branch_name,
      sortable: true,
      width: "100px",
    });
  }
  if (userRole === "branchAdmin") {
    baseColumns.splice(4, 0, {
      name: "Phone Number",
      selector: (row) => row.pno,
      sortable: true,
      width: "150px",
    });
  }
  return baseColumns;
  
}

  
export const CustomerButtons = ({ _id, onDelete, role}) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Do you really want to delete this Customer?");
    if(confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/customer/${_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if(response.data.success) {
          onDelete(); // Callback to update state if needed
        }
      } catch (error) {
        if(error.response && !error.response.data.success){
          alert(error.response.data.error);
        }
      }
    }else {
      // Optional: notify cancel or just do nothing
      console.log("Customer delete canceled");
    }
  };
  const userRole = localStorage.getItem("userRole");
  // console.log(userRole)

  return(
    <div className=" flex space-x-3">
      {userRole === "branchAdmin" ? (
        <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/branchAdmin-dashboard/customer/${_id}`)}
      >View</button>
      ):(<button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/customer/${_id}`)}
      >View</button>)}
      
      {userRole ==="branchAdmin" &&(
        <>
        <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer" 
        onClick={()=> navigate(`/branchAdmin-dashboard/customer/edit/${_id}`)}>Edit</button>
        <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" onClick={handleDelete} >Delete</button></>
      )}
      
    </div>
  )
};
