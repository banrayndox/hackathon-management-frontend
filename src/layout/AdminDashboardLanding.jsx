import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AdminDashboard from '../pages/Admin/AdminDashboard'

const AdminDashboardLanding = () => {
  return (
    <div>
      <Navbar />
      <AdminDashboard />
      <Footer />
    </div>
  )
}

export default AdminDashboardLanding
