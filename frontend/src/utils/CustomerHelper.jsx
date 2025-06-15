import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
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
    name: "Profile Image",
    selector: (row)=> row.profileImage,
    width:"130px",
    center:"true",
  },
  {
    name: "Branch Admin",
    selector: (row)=> row.Admin_name,
    sortable : true,
    width:"150px",
  },
  {
    name: "Branch",
    selector: (row)=> row.branch_name,
    sortable : true,
    width:"150px",
  },
  {
    name: "Phone Number",
    selector: (row)=> row.pno,
    width:"150px",
  },
  {
    name: "NIC",
    selector: (row)=> row.nic,
    width:"130px",
    
  },
  {
    name: "Action",
    selector: (row)=> row.action,
    center:"true",
  },
]

export const CustomerButtons = ({ _id}) => {
  const navigate = useNavigate();

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("Do you really want to delete this Branch Admin?");
//     if(confirmDelete) {
//       try {
//         const response = await axios.delete(`http://localhost:3000/api/branchAdmin/${_id}`, {
//           headers: {
//             "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
//           }
//         });
//         if(response.data.success) {
//           onDelete(); // Callback to update state if needed
//         }
//       } catch (error) {
//         if(error.response && !error.response.data.success){
//           alert(error.response.data.error);
//         }
//       }
//     }
//   };
  return(
    <div className=" flex space-x-3">
      <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/branchAdmin-dashboard/customer/${_id}`)}
      >View</button>
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer" 
      onClick={()=> navigate(`/branchAdmin-dashboard/customer/edit/${_id}`)}>Edit</button>
      <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" >Delete</button>
    </div>
  )
};
