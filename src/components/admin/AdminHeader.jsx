import { useState } from "react";
import { Bell, Search, User, Menu, Moon, Sun } from "lucide-react";
import "./AdminHeader.css";

const AdminHeader = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would implement the actual dark mode toggle functionality
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notifications">
          <button className="notification-button">
            <Bell size={20} />
            <span className="notification-indicator"></span>
          </button>
        </div>

        <div className="admin-profile">
          <div className="profile-image">
            <User size={20} />
          </div>
          <div className="profile-info">
            <span className="admin-name">Admin User</span>
            <span className="admin-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
