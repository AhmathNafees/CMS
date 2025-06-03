
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

export const BranchButtons = ()=>{
  return(
    <div>
      <button>Edit</button>
      <button>Delete</button>
    </div>
  )
}