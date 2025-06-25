import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const userRole = localStorage.getItem("userRole");
  const logsPerPage = 10;
  const navigate = useNavigate();

  // Fetch logs with filters
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }
      if ((userRole === "admin" || userRole === "customerCare") && branchFilter !== "all") {
        params.append("branchId", branchFilter);
      }

      const res = await axios.get(`http://localhost:3000/api/request/logs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data.success) {
        setLogs(res.data.logs);

      }
    } catch (err) {
      alert("Failed to load logs.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch branch list (admin or customerCare only)
  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/branch", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (res.data.success) {
        setBranches(res.data.branches);
      }
    } catch (err) {
      console.error("Failed to fetch branches");
    }
  };

  useEffect(() => {
    if (userRole === "admin" || userRole === "customerCare") {
      fetchBranches();
    }
    fetchLogs();
  }, [statusFilter, startDate, endDate, branchFilter]);

  // Search local filter
  useEffect(() => {
    const lower = searchTerm.toLowerCase();

    const filtered = logs.filter((log) => {
      const care = log.requestedBy?.name?.toLowerCase() || "";
      const admin = log.handledBy?.name?.toLowerCase() || "";
      const branch = log.branch?.branch_name?.toLowerCase() || "";
      const statusMatch = statusFilter === "all" || log.status === statusFilter;
      const branchMatch = branchFilter === "all" || log.branch?._id === branchFilter;

      // Date range filtering
      const created = new Date(log.createdAt);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;
      const inDateRange = (!from || created >= from) && (!to || created <= to);

      const matchesSearch = care.includes(lower) || admin.includes(lower) || branch.includes(lower);

      return statusMatch && branchMatch && inDateRange && matchesSearch;
    });

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchTerm, statusFilter, startDate, endDate, branchFilter]);


  // Pagination
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Export to CSV
  const exportCSV = () => {
    const headers = ["S.No", "Customer Care", "Handled By", "Branch", "Status", "Requested On", "Updated On"];
    const rows = filteredLogs.map((log, i) => [
      i + 1,
      log.requestedBy?.name || "-",
      log.handledBy?.name || "-",
      log.branch?.branch_name || "-",
      log.status,
      new Date(log.createdAt).toLocaleString(),
      new Date(log.updatedAt).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "logs.csv";
    link.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Request Logs</h2>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or branch"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-60"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded w-48"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        {(userRole === "admin" || userRole === "customerCare") && (
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="p-2 border rounded w-48"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.branch_name}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Logs Table */}
      {loading ? (
        <p>Loading...</p>
      ) : currentLogs.length === 0 ? (
        <p className="text-gray-500">No logs found.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">S.No</th>
                {userRole !== "customerCare" && <th className="border p-2">Customer Care</th>}
                {userRole !== "branchAdmin" && <th className="border p-2">Handled By</th>}
                <th className="border p-2">Branch</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Requested On</th>
                <th className="border p-2">Updated On</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, i) => (
                <tr key={log._id} className="hover:bg-gray-50 border-t">
                  <td className="p-2 border text-center">{indexOfFirst + i + 1}</td>
                  {userRole !== "customerCare" && (
                    <td className="p-2 border text-center">{log.requestedBy?.name || "-"}</td>
                  )}
                  {userRole !== "branchAdmin" && (
                    <td className="p-2 border text-center">{log.handledBy?.name || "-"}</td>
                  )}
                  <td className="p-2 border text-center">{log.branch?.branch_name || "-"}</td>
                  <td className="p-2 border text-center capitalize">{log.status}</td>
                  <td className="p-2 border text-center">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-2 border text-center">{new Date(log.updatedAt).toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    {log.indexCustomer && (
                    <button
                        onClick={() => {
                        const id = log.indexCustomer._id;
                        if (userRole === "admin") {
                            navigate(`/admin-dashboard/indexCustomer/${id}`);
                        } else if (userRole === "branchAdmin") {
                            navigate(`/branchAdmin-dashboard/indexCustomer/${id}`);
                        } else if (userRole === "customerCare") {
                            navigate(`/customerCare-dashboard/indexCustomer/${id}`);
                        }
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"
                    >
                        View Index Customer
                    </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Logs;
