import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Sun, Moon, HeartPulse } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import logo from '../assets/logo.png';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <img 
            src={logo} 
            alt="CareNet AI Logo" 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              objectFit: 'cover',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 0 12px rgba(216, 180, 114, 0.3)'
            }} 
          />
          <span>CARE<span className="gradient-text">NET</span></span>
        </Link>

        {/* Center Nav Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/heart-prediction" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
              Heart AI
            </NavLink>
          </li>
          <li>
            <NavLink to="/medical-diagnosis" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
              Diagnostics
            </NavLink>
          </li>
          <li>
            <NavLink to="/prediction-history" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
              History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          </li>
        </ul>

        {/* Right Action Pill Buttons */}
        <div className="navbar-actions">
          <button onClick={toggleTheme} className="icon-btn" title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/heart-prediction" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={16} /> START PREDICTION <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
