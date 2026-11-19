import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { GraduationCap, Users, UserPlus, LayoutDashboard, Menu, X, Activity } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    // Check backend health on mount
    checkBackendHealth()
      .then(() => setServerOnline(true))
      .catch(() => setServerOnline(false));

    const interval = setInterval(() => {
      checkBackendHealth()
        .then(() => setServerOnline(true))
        .catch(() => setServerOnline(false));
    }, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-box">
            <GraduationCap className="brand-icon" size={26} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">SkillTrack</span>
            <span className="brand-subtitle">Placement Portal</span>
          </div>
        </Link>

        {/* Server Status Pill (Desktop) */}
        <div className="server-status-pill" title={serverOnline ? 'Backend API Connected' : 'Checking Backend API...'}>
          <span className={`status-dot ${serverOnline === true ? 'online' : serverOnline === false ? 'offline' : 'checking'}`}></span>
          <span className="status-label">
            {serverOnline === true ? 'MongoDB API Live' : serverOnline === false ? 'Backend Offline' : 'Connecting...'}
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <Users size={18} />
            <span>Student List</span>
          </NavLink>

          <NavLink
            to="/add-student"
            className={({ isActive }) => `nav-btn-primary ${isActive ? 'nav-btn-active' : ''}`}
          >
            <UserPlus size={18} />
            <span>Add Student</span>
          </NavLink>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/students"
            onClick={closeMobileMenu}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
          >
            <Users size={20} />
            <span>Student List</span>
          </NavLink>

          <NavLink
            to="/add-student"
            onClick={closeMobileMenu}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
          >
            <UserPlus size={20} />
            <span>Add Student Skills</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
