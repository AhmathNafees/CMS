import axios from "axios";
import { useNavigate } from "react-router-dom";

export const customerCarecolumns = [
  {
    name: "S No",
    selector: (row)=> row.sno,
    sortable : true,
    width:"75px",
  },
  {
    name: "Name",//coloumn name
    selector: (row)=> row.name, //in the jsx file name given
    sortable : true,
    width:"130px",
  },
  {
    name: "Profile Image",
    selector: (row)=> row.profileImage,
    width:"130px",
    center:"true",
  },
  {
    name: "Branch",
    selector: (row)=> row.branch_name,
    sortable : true,
    width:"130px",
  },
  {
    name: "Role",
    selector: (row)=> row.role,
    sortable : true,
    width:"130px",
  },
  {
    name: "Phone",
    selector: (row)=> row.pno,
    width:"130px",
    
  },
  {
    name: "Action",
    selector: (row)=> row.action,
    center:"true",
  },
]

export const fetchBranches = async()=>{
    let branches
    try{
        const response = await axios.get('http://localhost:3000/api/branch',{
            headers: {
            "Authorization" :`Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        if(response.data.success){
            branches=response.data.branches
        }
    }catch(error){
        if(error.response && !error.response.data.success){
            alert(error.response.data.error)
        }

    }
    return branches
};

export const CustomerCareButtons = ({ _id, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Do you really want to delete this Branch Admin?");
    if(confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/branchAdmin/${_id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
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
    }
  };
 
  return(
    <div className=" flex space-x-3">
      <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/branchAdmins/${_id}`)}
      >View</button>
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer" 
      onClick={()=> navigate(`/admin-dashboard/branchAdmins/edit/${_id}`)}>Edit</button>
      <button className=" px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer" onClick={()=> navigate(`/admin-dashboard/indexCustomers/${_id}`)} >Index Customers</button>
      <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" onClick={handleDelete} >Delete</button>
    </div>
  )
};
