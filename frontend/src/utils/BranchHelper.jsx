import { useNavigate } from "react-router-dom"

export const columns = [
  {
    name: "S No",
    selector: (row)=> row.sno
  },
  {
    name: "Department Name",//coloumn name
    selector: (row)=> row.branch_name //in the jsx file name given
  },
  {
    name: "Action",
    selector: (row)=> row.action
  },
]

export const BranchButtons = ({_id})=>{
  const navigate = useNavigate();
  return(
    <div className=" flex space-x-3">
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/branch/${_id}`)}
      >Edit</button>
      <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer">Delete</button>
    </div>
  )
}