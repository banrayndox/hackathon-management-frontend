import React from 'react'
import Navbar from '../components/Navbar'

import Footer from '../components/Footer'
import TeamsList from '../pages/TeamList'

const TeamListLanding = () => {
  return (
    <div>
      <Navbar />
      <TeamsList />
      <Footer />
    </div>
  )
}

export default TeamListLanding
