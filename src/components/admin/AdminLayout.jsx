import { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <AdminSidebar collapsed={sidebarCollapsed} />

      <div className="admin-content">
        <AdminHeader toggleSidebar={toggleSidebar} />

        <main className="admin-main">{children}</main>

        <footer className="admin-footer">
          <p>&copy; {new Date().getFullYear()} Community Funding Admin Panel</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
