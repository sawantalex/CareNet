import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, HeartPulse, Stethoscope, History, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/heart-prediction" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <HeartPulse size={20} />
            <span>Heart Prediction</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/medical-diagnosis" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Stethoscope size={20} />
            <span>Medical Diagnostics</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/prediction-history" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <History size={20} />
            <span>Prediction History</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
        <button 
          onClick={handleLogout} 
          className="sidebar-item" 
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
