// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      const items = document.querySelectorAll('.menu ul li');
      items.forEach((item, index) => {
        setTimeout(() => item.classList.add('fade-in'), index * 100);
      });
    }
  }, [isOpen]);

  return (
    <nav className={`navbar ${isOpen ? 'menu-open' : ''}`}>
      <img src="/images/logo.png" alt="Logo" className="header-logo" />
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5 }}
          >
            <div className="close-icon" onClick={toggleMenu}>X</div>
            <ul>
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/" onClick={toggleMenu}>Home</Link>
              </li>
              <li className={location.pathname === '/about' ? 'active' : ''}>
                <Link to="/about" onClick={toggleMenu}>About</Link>
              </li>
              <li className={location.pathname === '/portfolio' ? 'active' : ''}>
                <Link to="/portfolio" onClick={toggleMenu}>Portfolio</Link>
              </li>
              <li className={location.pathname === '/contact' ? 'active' : ''}>
                <Link to="/contact" onClick={toggleMenu}>Contact</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;