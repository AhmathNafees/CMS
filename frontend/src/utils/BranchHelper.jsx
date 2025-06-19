import { useNavigate } from "react-router-dom"
import axios from "axios";

export const columns = [
  {
    name: "S No",
    selector: (row)=> row.sno,
    sortable : true,
    width:"100px"
  },
  {
    name: "Department Name",//coloumn name
    selector: (row)=> row.branch_name, //in the jsx file name given
    sortable : true,
    width:"150px"
  },
  {
    name: "Action",
    selector: (row)=> row.action,
    center:true,
  },
]

export const BranchButtons = ({_id, onBranchDelete, branchId})=>{
  const navigate = useNavigate();

  const handleDelete=async(id)=>{
    const confirm = window.confirm("Do you want to delete?")
    if(confirm){
      try{
        const response = await axios.delete(`http://localhost:3000/api/branch/${id}`,{
          headers: {
            "Authorization" :`Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if(response.data.success){
          onBranchDelete(id)
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }

      }

    }
    
  }

  return(
    <div className=" flex space-x-3">
      <button className=" px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/branchadmins/view/${_id}`)}
      >View Admins</button>
      <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/customer/byBranch/${branchId}`)}
      >View Customer</button>
      <button className=" px-3 py-1 bg-yellow-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/indexCustomer/byBranch/${branchId}`)}
      >View Index Customer</button>
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/branch/${_id}`)}
      >Edit</button>
      <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" onClick={()=>handleDelete(_id)}>Delete</button>
    </div>
  )
}