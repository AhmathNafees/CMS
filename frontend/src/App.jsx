// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import Summary from "./Components/dashboard/Summary";
import BranchList from "./Components/branch/BranchList";
import AddBranch from "./Components/branch/AddBranch";
import EditBranch from "./Components/branch/EditBranch";
import ListBranchAdmin from "./Components/branchAdmin/ListBranchAdmin";
import AddBranchAdmin from "./Components/branchAdmin/AddBranchAdmin";
import ViewBranchAdmins from "./Components/branchAdmin/ViewBranchAdmins";
import EditBranchAdmin from "./Components/branchAdmin/EditBranchAdmin";
import ViewBranchByAdmins from "./Components/branchAdmin/ViewBranchByAdmins";
import BranchAdminDashboard from "./pages/BranchAdminDashboard";
import BranchAdminSummary from "./Components/BranchAdminDashboard/BranchAdminSummary";
import Profile from "./Components/BranchAdminDashboard/profile";

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
            <Route path="/admin-dashboard/branchAdmins/edit/:id" element={<EditBranchAdmin/>}></Route>
            <Route
              path="/admin-dashboard/branchadmins/view/:branchId"
              element={<ViewBranchByAdmins />}></Route>


        </Route>
          
        <Route path="/branchAdmin-dashboard" element={
          <PrivateRoute>
            <RoleBaseRoutes requiredRole={["admin","branchAdmin"]}>
              <BranchAdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoute>
          } >
            <Route index element={<BranchAdminSummary/>}></Route>
            <Route
              path="/branchAdmin-dashboard/profile/:id"
              element={<ViewBranchAdmins />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
