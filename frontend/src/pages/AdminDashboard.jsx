import React from 'react'
import { useAuth } from '../context/AuthProvider';
const AdminDashboard = () => {
  const {user} = useAuth()
  return (
    <div>AdminDashboard </div>
  )
}

export default AdminDashboard