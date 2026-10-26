import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HeartPulse, Stethoscope, History, Home } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
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
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
