import React from 'react'

function Footer() {
  return (
    <div className="w-screen bg-dblue">
    <div className="">
      <ul className="nav flex flex-row justify-center border-b-2 py-1.5">
        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted text-white">Home</a></li>
        <li className="nav-item"><a href="/about" className="nav-link px-2 text-muted text-white">About</a></li>
        <li className="nav-item"><a href="/FAQs" className="nav-link px-2 text-muted text-white">FAQs</a></li>
        <li className="nav-item"><a href="/contact" className="nav-link px-2 text-muted text-white">Contact</a></li>
      </ul>
      <p className="flex justify-center align-middle py-1.5">&copy; {new Date().getFullYear()} LeetCode Analyzer. All rights reserved.</p>
    </div>
  </div>
  )
}

export default Footer