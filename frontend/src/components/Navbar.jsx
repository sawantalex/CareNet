import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity, LogOut, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            <Activity size={22} />
          </div>
          <span>CARE<span className="gradient-text">NET</span></span>
        </Link>

        {/* Center Nav Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `navbar-item ${isActive ? 'active' : ''}`}>
                  Dashboard
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
            </>
          ) : (
            <>
              <li>
                <a href="#features" className="navbar-item">AI Modules</a>
              </li>
              <li>
                <a href="#about" className="navbar-item">About Platform</a>
              </li>
            </>
          )}
        </ul>

        {/* Right Action Pill Buttons */}
        <div className="navbar-actions">
          <button onClick={toggleTheme} className="icon-btn" title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={handleLogout} className="icon-btn" title="Sign Out" style={{ color: '#f43f5e' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="navbar-item" style={{ marginRight: '8px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
                GET STARTED <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
