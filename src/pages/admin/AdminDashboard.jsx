import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminStats from "../../components/admin/AdminStats";
import {
  BarChart,
  PieChart,
  LineChart,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  console.log("AdminDashboard component rendering");
    const navigate = useNavigate();
  
  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login"); // Adjust this to your login route
    }
  }, [navigate]);

  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUsers: 0,
    activeCampaigns: 0,
    pendingWithdrawals: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch
    const fetchData = async () => {
      try {
        console.log("Fetching admin dashboard data");
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setStats({
          totalDonations: 125750,
          totalUsers: 1243,
          activeCampaigns: 48,
          pendingWithdrawals: 12,
        });

        setRecentActivities([
          {
            id: 1,
            type: "donation",
            user: "John Doe",
            amount: 500,
            campaign: "Help in Disaster in Juba",
            time: "10 minutes ago",
          },
          {
            id: 2,
            type: "withdrawal",
            user: "Sarah Smith",
            amount: 1200,
            campaign: "Displaced from Jambo",
            time: "25 minutes ago",
          },
          {
            id: 3,
            type: "new_campaign",
            user: "Michael Brown",
            campaign: "Education for Children",
            time: "1 hour ago",
          },
          { id: 4, type: "new_user", user: "Emma Wilson", time: "2 hours ago" },
          {
            id: 5,
            type: "flagged",
            user: "Anonymous",
            campaign: "Suspicious Campaign",
            time: "3 hours ago",
          },
        ]);

        setLoading(false);
        console.log("Admin dashboard data loaded");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "donation":
        return <DollarSign size={16} className="activity-icon donation" />;
      case "withdrawal":
        return <DollarSign size={16} className="activity-icon withdrawal" />;
      case "new_campaign":
        return <Calendar size={16} className="activity-icon campaign" />;
      case "new_user":
        return <Users size={16} className="activity-icon user" />;
      case "flagged":
        return <AlertTriangle size={16} className="activity-icon flagged" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1>Dashboard Overview</h1>

        <div className="stats-grid">
          <AdminStats
            title="Total Donations"
            value={`$${stats.totalDonations.toLocaleString()}`}
            icon={<DollarSign size={24} />}
            change="+12.5%"
            positive={true}
          />
          <AdminStats
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<Users size={24} />}
            change="+5.2%"
            positive={true}
          />
          <AdminStats
            title="Active Campaigns"
            value={stats.activeCampaigns.toString()}
            icon={<Calendar size={24} />}
            change="+3.1%"
            positive={true}
          />
          <AdminStats
            title="Pending Withdrawals"
            value={stats.pendingWithdrawals.toString()}
            icon={<AlertTriangle size={24} />}
            change="+2"
            positive={false}
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Donation Overview</h2>
              <select className="time-select">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="chart-container">
              <BarChart size={24} />
              <p className="chart-placeholder">
                Bar Chart: Donation trends over time
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Campaign Categories</h2>
            </div>
            <div className="chart-container">
              <PieChart size={24} />
              <p className="chart-placeholder">
                Pie Chart: Campaign distribution by category
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>User Growth</h2>
              <select className="time-select">
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="chart-container">
              <LineChart size={24} />
              <p className="chart-placeholder">
                Line Chart: User growth over time
              </p>
            </div>
          </div>

          <div className="dashboard-card recent-activity">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <button className="view-all">View All</button>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <ul className="activity-list">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="activity-item">
                    {getActivityIcon(activity.type)}
                    <div className="activity-content">
                      <p className="activity-text">
                        {activity.type === "donation" && (
                          <>
                            <strong>{activity.user}</strong> donated{" "}
                            <strong>${activity.amount}</strong> to{" "}
                            <strong>{activity.campaign}</strong>
                          </>
                        )}
                        {activity.type === "withdrawal" && (
                          <>
                            <strong>{activity.user}</strong> requested
                            withdrawal of <strong>${activity.amount}</strong>{" "}
                            from <strong>{activity.campaign}</strong>
                          </>
                        )}
                        {activity.type === "new_campaign" && (
                          <>
                            <strong>{activity.user}</strong> created a new
                            campaign: <strong>{activity.campaign}</strong>
                          </>
                        )}
                        {activity.type === "new_user" && (
                          <>
                            <strong>{activity.user}</strong> joined the platform
                          </>
                        )}
                        {activity.type === "flagged" && (
                          <>
                            <strong>{activity.campaign}</strong> was flagged for
                            review
                          </>
                        )}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
