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
    name: "Name",//coloumn name
    selector: (row)=> row.name, //in the jsx file name given
    sortable : true,
    width:"130px",
  },
  {
    name: "Profile Image",
    selector: (row)=> row.profileImage,
    width:"130px",
    center:true,
  },
  {
    name: "Branch",
    selector: (row)=> row.branch_name,
    sortable : true,
  },
  {
    name: "NIC",
    selector: (row)=> row.nic,
    
  },
  {
    name: "Action",
    selector: (row)=> row.action,
    center:true,
  },
]

export const fetchBranches = async()=>{
    let branches
    try{
        const response = await axios.get('http://localhost:3000/api/branch',{
            headers: {
            "Authorization" :`Bearer ${localStorage.getItem('token')}`
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

export const BranchAdminButtons = ({_id})=>{
  const navigate = useNavigate();

  return(
    <div className=" flex space-x-3">
      <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/branchAdmins/${_id}`)}
      >View</button>
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer" >Edit</button>
      <button className=" px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer" >Customers</button>
    </div>
  )
};
