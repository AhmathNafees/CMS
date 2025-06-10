import { useNavigate } from "react-router-dom"
import axios from "axios";

export const columns = [
  {
    name: "S No",
    selector: (row)=> row.sno,
    sortable : true,
  },
  {
    name: "Department Name",//coloumn name
    selector: (row)=> row.branch_name, //in the jsx file name given
    sortable : true,
  },
  {
    name: "Action",
    selector: (row)=> row.action
  },
]

export const BranchButtons = ({_id, onBranchDelete})=>{
  const navigate = useNavigate();

  const handleDelete=async(id)=>{
    const confirm = window.confirm("Do you want to delete?")
    if(confirm){
      try{
        const response = await axios.delete(`http://localhost:3000/api/branch/${id}`,{
          headers: {
            "Authorization" :`Bearer ${localStorage.getItem('token')}`
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
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/branch/${_id}`)}
      >Edit</button>
      <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" onClick={()=>handleDelete(_id)}>Delete</button>
    </div>
  )
}