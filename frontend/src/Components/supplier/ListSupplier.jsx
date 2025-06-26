import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { SupplierButtons, columns } from '../../utils/SupplierHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const ListSupplier = () => {
  const [suppliers, setSuppliers]= useState([]);
  const [loading, setLoading] = useState(false)
  const [filteredSuppliers, setFilteredSuppliers] = useState([])

  useEffect(()=>{
    const fetchSuppliers = async()=>{
      setLoading(true)
      try{
          const response = await axios.get('http://localhost:3000/api/supplier/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          // console.log(response.data)
        if(response.data.success){
          let sno =1;
          const data =await response.data.suppliers.map((supp)=>(
            {
              _id:supp._id,
              sno:sno++,
              pno:supp.pno,
              name:supp.name,
              role:supp.role,
              dob: new Date (supp.dob).toDateString(),
              profileImage:<img width={80} className=' rounded-full' src={`http://localhost:3000/${supp.profileImage}`}/>,
              nic:supp.nic,
              action:(<SupplierButtons _id={supp._id} onDelete={fetchSuppliers}/>),
            }
          ))
          setSuppliers(data)
          setFilteredSuppliers(data)
        }
      }catch(error){
        if(error.response && !error.response.data.success){
        alert(error.response.data.error)
        }

      }finally{
        setLoading(false)
      }
    };
    fetchSuppliers();
  },[]);

  const handleFilter = (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const records = suppliers.filter((supp) =>
    supp.name.toLowerCase().includes(searchTerm)
  );
  setFilteredSuppliers(records);
};

  return (
    <div className='p-5 flex-1'>
        <div className='text-center'>
          <h3 className=' text-2xl font-bold'>Manage Supplier</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Supplier Name' 
          className=' px-4 py-0.5 ml-1 border rounded w-65' onChange={handleFilter}
          />
          <Link to="/admin-dashboard/supplier/add" className=' px-4 py-1 bg-teal-600 rounded hover:bg-teal-800 mr-1 text-white'>Add New Supplier</Link>
        </div>
        <div className='mt-5'>
          <DataTable
              columns={columns()}
              data={filteredSuppliers}
              pagination
            />
        </div>
      </div>
  )
}

export default ListSupplier