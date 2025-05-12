// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo />
          <span>Community Funding</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link to="/" className={`navbar-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/campaigns" className={`navbar-item ${isActive('/campaigns') ? 'active' : ''}`}>
            Campaigns
          </Link>
          <Link to="/about" className={`navbar-item ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
          <Link to="/contact" className={`navbar-item ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        <div className="navbar-actions">
          <button 
            onClick={toggleDarkMode} 
            className="theme-toggle" 
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentUser ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-button" 
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <span className="user-name">{currentUser.name}</span>
                    <span className="user-email">{currentUser.email}</span>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <User size={16} />
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link to="/create-campaign" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Settings size={16} />
                    <span>Create Campaign</span>
                  </Link>
                  
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
              <Link to="/signup" className="auth-button signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-container">
          <div className="mobile-menu-header">
            <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
              <Logo />
              <span>Community Funding</span>
            </Link>
            <button 
              className="mobile-menu-close" 
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mobile-menu-items">
            <Link 
              to="/" 
              className={`mobile-menu-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/campaigns" 
              className={`mobile-menu-item ${isActive('/campaigns') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link 
              to="/about" 
              className={`mobile-menu-item ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className={`mobile-menu-item ${isActive('/contact') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {currentUser ? (
              <>
                <div className="mobile-menu-divider"></div>
                <Link 
                  to="/dashboard" 
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/create-campaign" 
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings size={18} />
                  <span>Create Campaign</span>
                </Link>
                <button onClick={handleLogout} className="mobile-menu-item logout">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <div className="mobile-menu-divider"></div>
                <Link 
                  to="/login" 
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="mobile-menu-button signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <div className="mobile-menu-divider"></div>
            <button onClick={toggleDarkMode} className="mobile-menu-item theme">
              {darkMode ? (
                <>
                  <Sun size={18} />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;