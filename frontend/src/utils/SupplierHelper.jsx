import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = () =>{
  const baseColumns = [
    {
      name: "S No",
      selector: (row)=> row.sno,
      sortable : true,
      width:"75px",
    },
    {
      name: "Supplier Name",//coloumn name
      selector: (row)=> row.name, //in the jsx file name given
      sortable : true,
      width:"130px",
    },
    {
      name: "Profile Image",
      selector: (row)=> row.profileImage,
      width:"120px",
      center:"true",
    },
    {
      name: "Phone Number",
      selector: (row)=> row.pno,
      width:"120px",
      center:"true",
    },
    
    {
      name: "Action",
      selector: (row)=> row.action,
      center:'true',
    },
  ]

  return baseColumns;
  
}

  
export const SupplierButtons = ({ _id, onDelete}) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Do you really want to delete this Supplier?");
    if(confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/supplier/${_id}`, {
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
      console.log("Supplier delete canceled");
    }
  };
  const userRole = localStorage.getItem("userRole");
  // console.log(userRole)

  return(
    <div className=" flex space-x-3">
      <button className=" px-3 py-1 bg-green-600 text-white rounded-md cursor-pointer"
        onClick={()=> navigate(`/admin-dashboard/supplier/${_id}`)}
      >View</button>
      <button className=" px-3 py-1 bg-teal-600 text-white rounded-md cursor-pointer" 
        onClick={()=> navigate(`/admin-dashboard/supplier/edit/${_id}`)}>Edit</button>
        <button className=" px-3 py-1 bg-red-600 text-white rounded-md cursor-pointer" onClick={handleDelete} >Delete</button>
      
    </div>
  )
};
