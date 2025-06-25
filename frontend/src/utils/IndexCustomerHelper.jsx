import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = (userRole) =>{
  const baseColumns=[
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
    selector: (row)=> row.createdAtDisplay,
    width:"130px",
    sortable:true,
    
  },
  {
    name: "Action",
    selector: (row)=> row.action,
    center:"true",
  },]
  if (userRole === "admin") {
    baseColumns.splice(3, 0, {
      name: "Branch Admin",
      selector: (row) => row.Admin_name,
      sortable: true,
      width: "130px",
    }),
    baseColumns.splice(4, 0, {
      name: "Branch",
      selector: (row) => row.branch_name,
      sortable: true,
      width: "100px",
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
        const response = await axios.delete(`http://localhost:3000/api/indexCustomer/${_id}`, {
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
  

  return(
    <div className=" flex space-x-3">
      {userRole ==='customerCare' ?(
        <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/customerCare-dashboard/indexCustomer/${_id}`)}
      >View</button>
      ):(
        <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/indexCustomer/${_id}`)}
      >View</button>
      )

      }
      
      {userRole ==="customerCare" &&(
        <>
        <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer" 
        onClick={()=> navigate(`/customerCare-dashboard/indexCustomer/edit/${_id}`)}>Edit</button>
        <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" onClick={handleDelete} >Delete</button></>
      )}
      
    </div>
  )
};
