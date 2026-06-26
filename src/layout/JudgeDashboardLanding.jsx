import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JudgeDashboard from '../pages/Judges/JudgeDashboard'

const JudgeDashboardLanding = () => {
  return (
    <div>
      <Navbar />
      <JudgeDashboard />
      <Footer />
    </div>
  )
}

export default JudgeDashboardLanding
