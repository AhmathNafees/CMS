import React from 'react'
import {NavLink} from 'react-router-dom';
import {FaBuilding, FaCogs, FaExchangeAlt, FaSync, FaTachometerAlt, FaUser, FaUsers} from 'react-icons/fa';
import { useAuth } from '../../context/AuthProvider';

const SupplierSidebar = () => {
    const {user} = useAuth()
  return (
    <div className=' bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-65'>
        <div className=' bg-teal-600 h-12 flex items-center justify-center'>
            <h3 className=' text-2xl text-center font-signika'>Supplier Dashboard</h3>
        </div>
        <div>
            <NavLink to="/supplier-dashboard"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaTachometerAlt/>
                <span>Dashboard</span>
            </NavLink>

            <NavLink to={`/supplier-dashboard/profile/${user._id}`}
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUser/>
                <span>My Profile</span>
            </NavLink>

            <NavLink to="/supplier-dashboard/customers"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaUsers/>
                <span>Customers</span>
            </NavLink>
            <NavLink to="/supplier-dashboard/requests"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaExchangeAlt/>
                <span>Requests</span>
            </NavLink>
            <NavLink to="/supplier-dashboard/logs"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaSync/>
                <span>My Logs</span>
            </NavLink>

            <NavLink to="/supplier-dashboard/setting"
            className={({isActive})=> `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5  px-4 rounded`}end>
                <FaCogs/>
                <span>Setting</span>
            </NavLink>
        </div>
    </div>
  )
}

export default SupplierSidebar