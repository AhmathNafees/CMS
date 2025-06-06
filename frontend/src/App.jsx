// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import Summary from "./Components/dashboard/Summary";
import BranchList from "./Components/branch/BranchList";
import AddBranch from "./Components/branch/AddBranch";
import EditBranch from "./Components/branch/EditBranch";
import ListBranchAdmin from "./Components/branchAdmin/ListBranchAdmin";
import AddBranchAdmin from "./Components/branchAdmin/AddBranchAdmin";
import ViewBranchAdmins from "./Components/branchAdmin/ViewBranchAdmins";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoute>
          }>

            <Route index element={<Summary/>}></Route>
            <Route path="/admin-dashboard/branches" element={<BranchList/>}>
            </Route>
            <Route path="/admin-dashboard/add-branch" element={<AddBranch/>}>
            </Route>
            <Route path="/admin-dashboard/branch/:id" element={<EditBranch/>}></Route>
            <Route path="/admin-dashboard/branchadmins" element={<ListBranchAdmin/>}></Route>
            <Route path="/admin-dashboard/add-branchAdmin" element={<AddBranchAdmin/>}></Route>
            <Route path="/admin-dashboard/branchadmins/:id" element={<ViewBranchAdmins/>}></Route>

        </Route>
          
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
