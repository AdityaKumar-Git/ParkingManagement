import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='bg-dblue min-h-16 flex justify-between px-4 items-center'>
        <div className='text-center font-serif text-white'> Parking Companion</div>
        <div className='block lg:hidden'>
          <button onClick={toggleMenu} className='text-white'>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
        <nav className='hidden lg:flex flex-row lg:space-x-4 text-white'>
          <Link to="/" className='ml-2 flex items-center no-underline hover:border-2 hover:p-1 hover:rounded-lg text-white'>Home</Link>
          <Link to="/about" className='ml-2 flex items-center no-underline hover:border-2 hover:p-1 hover:rounded-lg text-white'>About</Link>
          <Link to="/contact" className='ml-2 flex items-center no-underline hover:border-2 hover:p-1 hover:rounded-lg text-white'>Contact</Link>
          <Link to="/book" className='ml-2 no-underline p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Book Now</Link>
          <Link to="/login" className='ml-2 no-underline p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Login/Signup</Link>
        </nav>
      </div>
      {/* Side Panel for Mobile */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-zinc-900 text-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform lg:hidden`}>
        <div className='flex justify-end p-4'>
          <button onClick={toggleMenu} className='text-white'>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className='flex flex-col p-4 space-y-4'>
          <Link to="/" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/book" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>Book Now</Link>
        </nav>
      </div>
    </>
  );
}

export default Header;