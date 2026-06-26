import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PaymentConfirmation from '../pages/Participants/PaymentConfirmation'

const PaymentConfirmationLanding = () => {
  return (
    <div>
      <Navbar />
        <PaymentConfirmation />
      <Footer />
    </div>
  )
}

export default PaymentConfirmationLanding
