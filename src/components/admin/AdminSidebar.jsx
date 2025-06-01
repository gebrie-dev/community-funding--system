import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Flag,
  Users,
  FileText,
  DollarSign,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logo from "../Logo";
import "./AdminSidebar.css";

const AdminSidebar = ({ collapsed, toggleCollapse }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Logo />
          {!collapsed && <span>Admin Panel</span>}
        </div>
        <button className="collapse-button" onClick={toggleCollapse}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
              <LayoutDashboard size={20} />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/campaigns"
              className={isActive("/admin/campaigns") ? "active" : ""}
            >
              <Flag size={20} />
              {!collapsed && <span>Campaigns</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={isActive("/admin/users") ? "active" : ""}
            >
              <Users size={20} />
              {!collapsed && <span>Users</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/withdrawals"
              className={isActive("/admin/withdrawals") ? "active" : ""}
            >
              <DollarSign size={20} />
              {!collapsed && <span>Withdrawals</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/reports"
              className={isActive("/admin/reports") ? "active" : ""}
            >
              <FileText size={20} />
              {!collapsed && <span>Reports</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ul>
          <li>
            <Link to="/admin/settings">
              <Settings size={20} />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
          <li>
            <Link to="/admin/notifications">
              <Bell size={20} />
              {!collapsed && <span>Notifications</span>}
              <span className="notification-badge">5</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <LogOut size={20} />
              {!collapsed && <span>Exit Admin</span>}
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
