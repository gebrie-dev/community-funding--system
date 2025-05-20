// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Plus, Edit, Trash2, DollarSign, Users, Clock } from "lucide-react";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API calls to fetch user data
    const fetchUserData = async () => {
      try {
        // In a real app, these would be API calls
        setTimeout(() => {
          setUserCampaigns([
            {
              id: 1,
              title: "Help in Disaster in Juba",
              image: "/images/flood-disaster.jpg",
              raised: 12500,
              goal: 25000,
              daysLeft: 15,
              status: "active",
            },
            {
              id: 2,
              title: "School Building Project",
              image: "/images/school-project.jpg",
              raised: 8000,
              goal: 20000,
              daysLeft: 30,
              status: "active",
            },
          ]);

          setUserDonations([
            {
              id: 1,
              campaignTitle: "Displaced from Jambo",
              amount: 100,
              date: "2025-03-15",
              receipt: "DON-12345",
            },
            {
              id: 2,
              campaignTitle: "Clean Water Initiative",
              amount: 50,
              date: "2025-03-01",
              receipt: "DON-12346",
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <Link to="/create-campaign">
            <Button className="create-campaign-button">
              <Plus size={18} />
              <span>Create Campaign</span>
            </Button>
          </Link>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            My Campaigns
          </button>
          <button
            className={`tab ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            My Donations
          </button>
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Settings
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "campaigns" && (
            <div className="campaigns-tab">
              {userCampaigns.length === 0 ? (
                <div className="empty-state">
                  <h3>You haven't created any campaigns yet</h3>
                  <p>
                    Start making a difference by creating your first campaign
                  </p>
                  <Link to="/create-campaign">
                    <Button>Create Campaign</Button>
                  </Link>
                </div>
              ) : (
                <div className="campaigns-list">
                  {userCampaigns.map((campaign) => (
                    <div key={campaign.id} className="campaign-card-dashboard">
                      <div className="campaign-image-small">
                        <img
                          src={campaign.image || "/placeholder.svg"}
                          alt={campaign.title}
                        />
                        <div className={`status-badge ${campaign.status}`}>
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </div>
                      </div>

                      <div className="campaign-info">
                        <h3>{campaign.title}</h3>

                        <div className="campaign-stats">
                          <div className="stat">
                            <DollarSign size={16} />
                            <span>
                              ${campaign.raised.toLocaleString()} raised of $
                              {campaign.goal.toLocaleString()}
                            </span>
                          </div>
                          <div className="stat">
                            <Clock size={16} />
                            <span>{campaign.daysLeft} days left</span>
                          </div>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${
                                (campaign.raised / campaign.goal) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="campaign-actions">
                        <Link
                          to={`/campaign/${campaign.id}`}
                          className="view-button"
                        >
                          View
                        </Link>
                        <button className="edit-button">
                          <Edit size={16} />
                        </button>
                        <button className="delete-button">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <div className="donations-tab">
              {userDonations.length === 0 ? (
                <div className="empty-state">
                  <h3>You haven't made any donations yet</h3>
                  <p>Support a cause you care about</p>
                  <Link to="/campaigns">
                    <Button>Browse Campaigns</Button>
                  </Link>
                </div>
              ) : (
                <div className="donations-list">
                  <table className="donations-table">
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDonations.map((donation) => (
                        <tr key={donation.id}>
                          <td>{donation.campaignTitle}</td>
                          <td>${donation.amount}</td>
                          <td>
                            {new Date(donation.date).toLocaleDateString()}
                          </td>
                          <td>
                            <button className="receipt-button">
                              View Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="profile-tab">
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={currentUser?.name || ""} />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={currentUser?.email || ""} />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea placeholder="Tell us about yourself"></textarea>
                </div>

                <div className="form-actions">
                  <Button className="save-button">Save Changes</Button>
                </div>
              </div>

              <div className="password-section">
                <h3>Change Password</h3>

                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" />
                </div>

                <div className="form-actions">
                  <Button className="password-button">Update Password</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
