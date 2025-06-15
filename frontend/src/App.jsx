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
import BranchAdminSummary from "./Components/BranchAdminDashboard/BranchAdminSummaryCard";
import BranchAdminSummaryCard from "./Components/BranchAdminDashboard/BranchAdminSummaryCard";
import ListCustomer from "./Components/customer/ListCustomer";
import Setting from "./Components/BranchAdminDashboard/Setting";
import AddCustomer from "./Components/customer/AddCustomer";
import ViewCustomer from "./Components/customer/ViewCustomer";
import EditCustomer from "./Components/customer/EditCustomer";


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
            <Route
              path="/admin-dashboard/setting"
              element={<Setting/>}></Route>
            <Route
              path="/admin-dashboard/customers"
              element={<ListCustomer/>}></Route>


        </Route>
          
        <Route path="/branchAdmin-dashboard" element={
          <PrivateRoute>
            <RoleBaseRoutes requiredRole={["admin","branchAdmin"]}>
              <BranchAdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoute>
          } >
            <Route index element={<BranchAdminSummaryCard/>}></Route>
            <Route
              path="/branchAdmin-dashboard/profile/:id"
              element={<ViewBranchAdmins />}></Route>
            <Route
              path="/branchAdmin-dashboard/customers"
              element={<ListCustomer/>}></Route>
            <Route
              path="/branchAdmin-dashboard/setting"
              element={<Setting/>}></Route>
            <Route
              path="/branchAdmin-dashboard/add-customer"
              element={<AddCustomer/>}></Route>
            <Route
              path="/branchAdmin-dashboard/customer/:id"
              element={<ViewCustomer/>}></Route>
            <Route
              path="/branchAdmin-dashboard/customer/edit/:id"
              element={<EditCustomer/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
