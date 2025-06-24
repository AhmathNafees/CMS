import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/request/branch", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error("Error loading requests", err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/request/${requestId}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.success) {
        alert(`Request ${action} successfully`);
        fetchRequests(); // Reload
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update request");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Index Customer Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Customer Care Name</th>
              <th className="p-2 border">Customer Care Branch</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={req._id} className="border-t">
                <td className="p-2 border text-center">{i + 1}</td>
                <td className="p-2 border text-center">{req.requestedBy?.name || "-"}</td>
                <td className="p-2 border text-center">{req.branch?.branch_name || "-"}</td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"
                    onClick={() => navigate(`/branchAdmin-dashboard/indexCustomer/${req.indexCustomer?._id}`)}
                  >
                    View Index Customer
                  </button>
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-800"
                    onClick={() => handleAction(req._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                    onClick={() => handleAction(req._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Requests;
