import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ParticipantsDashboard from '../pages/Participants/ParticipantsDashboard'

const ParticipantsDashboardLanding = () => {
  return (
    <div>
      <Navbar />
      <ParticipantsDashboard />
      <Footer />
    </div>
  )
}

export default ParticipantsDashboardLanding
