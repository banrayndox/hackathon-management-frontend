import React from 'react'

const Footer = () => {
  return (
<>
<footer className="footer sm:footer-horizontal footer-center bg-[#0e0916] text-base-content p-4">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by <a className='underline' href='https://facebook.com/team.nothuman'>NOT HUMAN</a></p>
  </aside>
</footer>
</>
  )
}

export default Footer
