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
import ListCustomer from "./Components/customer/ListCustomer";
import Setting from "./Components/BranchAdminDashboard/Setting";
import AddCustomer from "./Components/customer/AddCustomer";
import ViewCustomer from "./Components/customer/ViewCustomer";
import EditCustomer from "./Components/customer/EditCustomer";
import CustomerCareDashboard from "./pages/CustomerCareDashboard";
import ListIndexCustomer from "./Components/indexCustomer/ListIndexCustomer";
import AddIndexCustomer from "./Components/indexCustomer/AddIndexCustomer";
import ViewIndexCustomer from "./Components/indexCustomer/ViewIndexCustomer";
import EditIndexCustomer from "./Components/indexCustomer/EditIndexCustomer";
import MyRequests from "./Components/customerCare/MyRequests";
import Requests from "./Components/branchAdmin/Requests";
import Logs from "./utils/Logs";
import CustomerCareSummary from "./Components/customerCareDashboard/CustomerCareSummary";


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
            <Route path="/admin-dashboard/branchadmins" element={<ListBranchAdmin role="branchAdmin"/>}></Route>
            <Route path="/admin-dashboard/add-branchAdmin" element={<AddBranchAdmin/>}></Route>
            <Route path="/admin-dashboard/branchadmins/:id" element={<ViewBranchAdmins/>}></Route>
            <Route path="/admin-dashboard/branchAdmins/edit/:id" element={<EditBranchAdmin/>}></Route>
            <Route
              path="/admin-dashboard/branchadmins/view/:branchId"
              element={<ViewBranchByAdmins />}></Route>
            <Route
              path="/admin-dashboard/setting"
              element={<Setting/>}></Route>
            <Route path="/admin-dashboard/customers/:branchAdminId" element={<ListCustomer />}></Route>
            <Route path="/admin-dashboard/customers" element={<ListCustomer />}></Route>
            <Route path="/admin-dashboard/customer/byBranch/:branchId" element={<ListCustomer />}></Route>
            <Route path="/admin-dashboard/customercares" element={<ListBranchAdmin role="customerCare"/>}/>
            <Route path="/admin-dashboard/add-customerCare" element={<AddBranchAdmin />}/>
            <Route path="/admin-dashboard/indexCustomers" element={<ListIndexCustomer />} />
            <Route path="indexCustomer/:id" element={<ViewIndexCustomer />} />
            <Route path="customer/:id" element={<ViewCustomer />} />
            <Route path="/admin-dashboard/indexCustomers/:branchAdminId" element={<ListIndexCustomer />} />
            <Route path="/admin-dashboard/indexCustomer/byBranch/:branchId" element={<ListIndexCustomer />} />
            <Route path="logs" element={<Logs />} />
            
        </Route>
        
        <Route
          path="/branchAdmin-dashboard"
          element={
            <PrivateRoute>
              <RoleBaseRoutes requiredRole={["admin","branchAdmin"]}>
                <BranchAdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoute>
          }
        >
          {/* Nested routes use RELATIVE paths here */}
          <Route index element={<BranchAdminSummary />} />
          <Route path="profile/:id" element={<ViewBranchAdmins />} />
          <Route path="customers" element={<ListCustomer />} />
          <Route path="setting" element={<Setting />} />
          <Route path="add-customer" element={<AddCustomer />} />
          <Route path="customer/:id" element={<ViewCustomer />} />
          <Route path="customer/edit/:id" element={<EditCustomer />} />
          <Route path="requests" element={<Requests />} />
          <Route path="indexCustomer/:id" element={<ViewIndexCustomer />} />
          <Route path="logs" element={<Logs />} />
        </Route>


          {/* {For Castomercare} */}
        <Route
          path="/customerCare-dashboard"
          element={
            <PrivateRoute>
              <RoleBaseRoutes requiredRole={["admin","customerCare"]}>
                <CustomerCareDashboard />
              </RoleBaseRoutes>
            </PrivateRoute>
          }
        >
          {/* Nested routes use RELATIVE paths here */}
          <Route index element={<CustomerCareSummary />} />
          <Route path="profile/:id" element={<ViewBranchAdmins />} />
          <Route path="setting" element={<Setting />} />
          <Route path="indexCustomers" element={<ListIndexCustomer />} />
          <Route path="add-indexCustomer" element={<AddIndexCustomer />} />
          <Route path="indexCustomer/:id" element={<ViewIndexCustomer />} />
          <Route path="indexCustomer/edit/:id" element={<EditIndexCustomer />} />
          <Route path="myRequests" element={<MyRequests />} />
          <Route path="logs" element={<Logs />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
