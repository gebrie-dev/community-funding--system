// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import Logo from "./Logo";
import "./Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserInitial = () => {
    if (!currentUser) return "?";
    const name = currentUser.first_name || currentUser.email || "";
    return name.charAt(0).toUpperCase() || "?";
  };

  const getDisplayName = () => {
    if (!currentUser) return "User";
    return currentUser.first_name || currentUser.email || "User";
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Home">
          <Logo />
          <span>Community Funding</span>
        </Link>

        <div className="navbar-menu" role="menubar">
          <Link
            to="/"
            className={`navbar-item ${isActive("/") ? "active" : ""}`}
            role="menuitem"
            aria-current={isActive("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/campaigns"
            className={`navbar-item ${isActive("/campaigns") ? "active" : ""}`}
            role="menuitem"
            aria-current={isActive("/campaigns") ? "page" : undefined}
          >
            Campaigns
          </Link>
          <Link
            to="/about"
            className={`navbar-item ${isActive("/about") ? "active" : ""}`}
            role="menuitem"
            aria-current={isActive("/about") ? "page" : undefined}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`navbar-item ${isActive("/contact") ? "active" : ""}`}
            role="menuitem"
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            Contact
          </Link>
        </div>

        <div className="navbar-actions">
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentUser ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className={`user-menu-button ${userMenuOpen ? "active" : ""}`}
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar">{getUserInitial()}</div>
                <ChevronDown
                  size={16}
                  className={`chevron ${userMenuOpen ? "rotate" : ""}`}
                />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown" role="menu" aria-label="User menu">
                  <div className="user-info">
                    <span className="user-name">{getDisplayName()}</span>
                    <span className="user-email">
                      {currentUser.email || "No email"}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                    role="menuitem"
                  >
                    <User size={16} aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/create-campaign"
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                    role="menuitem"
                  >
                    <Settings size={16} aria-hidden="true" />
                    <span>Create Campaign</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                    role="menuitem"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="auth-link" role="button">
                Sign In
              </Link>
              <Link to="/signup" className="auth-button signup" role="button">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
        ref={mobileMenuRef}
        role="menu"
        aria-label="Mobile menu"
      >
        <div className="mobile-menu-container">
          <div className="mobile-menu-header">
            <Link
              to="/"
              className="navbar-logo"
              onClick={() => setMobileMenuOpen(false)}
            >
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
              className={`mobile-menu-item ${isActive("/") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
              role="menuitem"
              aria-current={isActive("/") ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              to="/campaigns"
              className={`mobile-menu-item ${
                isActive("/campaigns") ? "active" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
              role="menuitem"
              aria-current={isActive("/campaigns") ? "page" : undefined}
            >
              Campaigns
            </Link>
            <Link
              to="/about"
              className={`mobile-menu-item ${
                isActive("/about") ? "active" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
              role="menuitem"
              aria-current={isActive("/about") ? "page" : undefined}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`mobile-menu-item ${
                isActive("/contact") ? "active" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
              role="menuitem"
              aria-current={isActive("/contact") ? "page" : undefined}
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
                  role="menuitem"
                >
                  <User size={18} aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/create-campaign"
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  <Settings size={18} aria-hidden="true" />
                  <span>Create Campaign</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="mobile-menu-item logout"
                  role="menuitem"
                >
                  <LogOut size={18} aria-hidden="true" />
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
                  role="menuitem"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="mobile-menu-button signup"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Sign Up
                </Link>
              </>
            )}

            <div className="mobile-menu-divider"></div>
            <button
              onClick={toggleDarkMode}
              className="mobile-menu-item theme"
              role="menuitem"
            >
              {darkMode ? (
                <>
                  <Sun size={18} aria-hidden="true" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} aria-hidden="true" />
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