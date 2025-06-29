import React from 'react'
import {NavLink} from 'react-router-dom';
import {FaBuilding, FaCogs, FaPhone, FaSync, FaTachometerAlt, FaUser, FaUsers} from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className=' bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-65'>
        <div className=' bg-teal-600 h-12 flex items-center justify-center'>
            <h3 className=' text-2xl text-center font-signika'>Main Admin Dashboard</h3>
        </div>
        <div>
            <NavLink to="/admin-dashboard"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaTachometerAlt/>
                <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin-dashboard/indexCustomers"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUsers/>
                <span>Index Customers</span>
            </NavLink>
            <NavLink to="/admin-dashboard/customercares"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaPhone/>
                <span>Customer Care</span>
            </NavLink>
            <NavLink to="/admin-dashboard/logs"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaSync/>
                <span>Logs</span>
            </NavLink>
            <NavLink to="/admin-dashboard/customers"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUsers/>
                <span>Customers</span>
            </NavLink>
            <NavLink to="/admin-dashboard/branchadmins"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUser/>
                <span>Branch Admins</span>
            </NavLink>
            <NavLink to="/admin-dashboard/sCustomers"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUsers/>
                <span>Supplier's Customer</span>
            </NavLink>
            <NavLink to="/admin-dashboard/supplier"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUser/>
                <span>Suppliers</span>
            </NavLink>
            <NavLink to="/admin-dashboard/branches"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaBuilding/>
                <span>Branches</span>
            </NavLink>

            <NavLink to="/admin-dashboard/setting"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaCogs/>
                <span>Setting</span>
            </NavLink>
        </div>
    </div>
  )
}

export default AdminSidebar