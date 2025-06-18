import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BranchAdminButtons } from "../../utils/BranchAdminHelper";

const ViewBranchByAdmins = () => {
  const { branchId } = useParams();
  const [branchAdmins, setBranchAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBranchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/branchAdmin/by-branch/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.data.success) {
        let sno = 1;
        const data = response.data.branchAdmins.map((bAdmin) => ({
          _id: bAdmin._id,
          sno: sno++,
          name: bAdmin.userId.name,
          role:bAdmin.userId.role,
          branch_name: bAdmin.branch.branch_name,
          dob: new Date(bAdmin.dob).toDateString(),
          profileImage: (
            <img
              width={40}
              className="rounded-full"
              src={`http://localhost:3000/${bAdmin.userId.profileImage}`}
              alt="Profile"
            />
          ),
          nic: bAdmin.nic,
          action: (
            <BranchAdminButtons
              _id={bAdmin._id}
              onDelete={fetchBranchAdmins}
            />
          ),
        }));
        setBranchAdmins(data);
      }
    } catch (error) {
      alert("Error fetching branch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchAdmins();
  }, [branchId]);

  const columns = [
    { name: "S No", selector: (row) => row.sno, sortable: true,width:"75px", },
    { name: "Name", selector: (row) => row.name, sortable: true, width:"100px", },
    { name: "Profile", selector: (row) => row.profileImage,width:"75px", },
    { name: "Role", selector: (row) => row.role },
    { name: "Branch", selector: (row) => row.branch_name },
    { name: "NIC", selector: (row) => row.nic },
    { name: "Action", selector: (row) => row.action,center:true },
  ];

  return (
    <div className="p-5 flex-1">
      <h3 className="text-2xl font-bold text-center">Branch Admins</h3>
      <div className="mt-5">
        <DataTable columns={columns} data={branchAdmins} pagination progressPending={loading} />
      </div>
    </div>
  );
};

export default ViewBranchByAdmins;
