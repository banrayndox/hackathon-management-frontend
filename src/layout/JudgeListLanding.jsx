import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JudgesList from '../pages/JudgesList'

const JudgesListLanding = () => {
  return (
    <div>
      <Navbar />
      <JudgesList />
      <Footer />
    </div>
  )
}

export default JudgesListLanding
