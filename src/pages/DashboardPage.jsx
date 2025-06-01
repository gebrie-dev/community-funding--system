
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  Clock,
  Download,
  Eye,
  TrendingUp,
  BarChart3,
  Wallet,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  FileText,
} from "lucide-react"
import "./DashboardPage.css"

const DashboardPage = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("campaigns")
  const [userCampaigns, setUserCampaigns] = useState([])
  const [userDonations, setUserDonations] = useState([])
  const [dashboardStats, setDashboardStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock API calls to fetch user data
    const fetchUserData = async () => {
      try {
        // In a real app, these would be API calls
        setTimeout(() => {
          setDashboardStats({
            totalRaised: 45750,
            totalDonated: 1250,
            activeCampaigns: 3,
            totalSupporters: 127,
          })

          setUserCampaigns([
            {
              id: 1,
              title: "Emergency Relief for Flood Victims in Juba",
              image: "/placeholder.svg?height=200&width=300",
              raised: 12500,
              goal: 25000,
              daysLeft: 15,
              status: "active",
              supporters: 45,
              createdDate: "2024-01-15",
              category: "Emergency",
            },
            {
              id: 2,
              title: "Building New School in Rural Community",
              image: "/placeholder.svg?height=200&width=300",
              raised: 18000,
              goal: 30000,
              daysLeft: 22,
              status: "active",
              supporters: 67,
              createdDate: "2024-01-10",
              category: "Education",
            },
            {
              id: 3,
              title: "Medical Treatment for Children",
              image: "/placeholder.svg?height=200&width=300",
              raised: 15250,
              goal: 20000,
              daysLeft: 0,
              status: "completed",
              supporters: 89,
              createdDate: "2023-12-01",
              category: "Medical",
            },
          ])

          setUserDonations([
            {
              id: 1,
              campaignTitle: "Clean Water Initiative for Remote Villages",
              campaignId: 101,
              amount: 250,
              date: "2024-01-20",
              receipt: "DON-2024-001",
              status: "completed",
            },
            {
              id: 2,
              campaignTitle: "Educational Supplies for Orphanage",
              campaignId: 102,
              amount: 150,
              date: "2024-01-18",
              receipt: "DON-2024-002",
              status: "completed",
            },
            {
              id: 3,
              campaignTitle: "Emergency Food Distribution",
              campaignId: 103,
              amount: 100,
              date: "2024-01-15",
              receipt: "DON-2024-003",
              status: "completed",
            },
            {
              id: 4,
              campaignTitle: "Disaster Relief Fund",
              campaignId: 104,
              amount: 300,
              date: "2024-01-12",
              receipt: "DON-2024-004",
              status: "completed",
            },
          ])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleWithdraw = (campaignId) => {
    // This will be connected to backend API
    console.log(`Withdrawing funds for campaign ${campaignId}`)
    // Add withdrawal logic here
  }

  const handleDeleteCampaign = (campaignId) => {
    // This will be connected to backend API
    console.log(`Deleting campaign ${campaignId}`)
    // Add delete logic here
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className="status-icon active" />
      case "completed":
        return <CheckCircle size={16} className="status-icon completed" />
      case "pending":
        return <Clock size={16} className="status-icon pending" />
      case "rejected":
        return <XCircle size={16} className="status-icon rejected" />
      default:
        return <AlertCircle size={16} className="status-icon" />
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, {currentUser?.first_name || "User"}!</h1>
              <p>Manage your campaigns and track your impact</p>
            </div>
            <Link to="/create-campaign">
              <Button className="create-campaign-button">
                <Plus size={18} />
                <span>Create New Campaign</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 size={18} />
            <span>Overview</span>
          </button>
          <button
            className={`nav-tab ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            <FileText size={18} />
            <span>My Campaigns</span>
          </button>
          <button
            className={`nav-tab ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            <CreditCard size={18} />
            <span>My Donations</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>{formatCurrency(dashboardStats.totalRaised)}</h3>
                    <p>Total Raised</p>
                    <span className="stat-change positive">+12% this month</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>{dashboardStats.totalSupporters}</h3>
                    <p>Total Supporters</p>
                    <span className="stat-change positive">+8 new supporters</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FileText size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>{dashboardStats.activeCampaigns}</h3>
                    <p>Active Campaigns</p>
                    <span className="stat-change neutral">2 ending soon</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>{formatCurrency(dashboardStats.totalDonated)}</h3>
                    <p>Total Donated</p>
                    <span className="stat-change positive">+5% this month</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <DollarSign size={16} />
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>New donation received</strong> - $50 for "Emergency Relief for Flood Victims"
                      </p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <Users size={16} />
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>New supporter joined</strong> - "Building New School" campaign
                      </p>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>Campaign completed</strong> - "Medical Treatment for Children" reached its goal
                      </p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="campaigns-tab">
              <div className="tab-header">
                <h2>My Campaigns</h2>
                <div className="tab-actions">
                  <select className="filter-select">
                    <option value="all">All Campaigns</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {userCampaigns.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FileText size={48} />
                  </div>
                  <h3>No campaigns yet</h3>
                  <p>Start making a difference by creating your first campaign</p>
                  <Link to="/create-campaign">
                    <Button className="primary-button">
                      <Plus size={18} />
                      Create Your First Campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="campaigns-grid">
                  {userCampaigns.map((campaign) => (
                    <div key={campaign.id} className="campaign-card">
                      <div className="campaign-image">
                        <img src={campaign.image || "/placeholder.svg"} alt={campaign.title} />
                        <div className={`status-badge ${campaign.status}`}>
                          {getStatusIcon(campaign.status)}
                          <span>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span>
                        </div>
                      </div>

                      <div className="campaign-content">
                        <div className="campaign-category">{campaign.category}</div>
                        <h3 className="campaign-title">{campaign.title}</h3>

                        <div className="campaign-progress">
                          <div className="progress-info">
                            <span className="raised">{formatCurrency(campaign.raised)}</span>
                            <span className="goal">of {formatCurrency(campaign.goal)}</span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="progress-percentage">
                            {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                          </div>
                        </div>

                        <div className="campaign-stats">
                          <div className="stat">
                            <Users size={14} />
                            <span>{campaign.supporters} supporters</span>
                          </div>
                          <div className="stat">
                            <Clock size={14} />
                            <span>{campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : "Campaign ended"}</span>
                          </div>
                        </div>

                        <div className="campaign-actions">
                          <Link to={`/campaigns/${campaign.id}`} className="action-button view">
                            <Eye size={16} />
                            <span>View</span>
                          </Link>
                          <button className="action-button edit">
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <Link to={`/campaigns/${campaign.id}/withdraw`} className="action-button withdraw">
                            <Wallet size={18} />
                            <span>Withdraw</span>
                          </Link>
                          <button className="action-button delete" onClick={() => handleDeleteCampaign(campaign.id)}>
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <div className="donations-tab">
              <div className="tab-header">
                <h2>My Donations</h2>
                <div className="tab-actions">
                  <select className="filter-select">
                    <option value="all">All Donations</option>
                    <option value="recent">Recent</option>
                    <option value="large">Largest Amount</option>
                  </select>
                </div>
              </div>

              {userDonations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <CreditCard size={48} />
                  </div>
                  <h3>No donations yet</h3>
                  <p>Support a cause you care about and make a difference</p>
                  <Link to="/campaigns">
                    <Button className="primary-button">Browse Campaigns</Button>
                  </Link>
                </div>
              ) : (
                <div className="donations-container">
                  <div className="donations-summary">
                    <div className="summary-card">
                      <h3>Total Donated</h3>
                      <p className="summary-amount">{formatCurrency(dashboardStats.totalDonated)}</p>
                    </div>
                    <div className="summary-card">
                      <h3>Campaigns Supported</h3>
                      <p className="summary-count">{userDonations.length}</p>
                    </div>
                  </div>

                  <div className="donations-list">
                    {userDonations.map((donation) => (
                      <div key={donation.id} className="donation-card">
                        <div className="donation-info">
                          <h4 className="donation-campaign">{donation.campaignTitle}</h4>
                          <div className="donation-details">
                            <span className="donation-amount">{formatCurrency(donation.amount)}</span>
                            <span className="donation-date">
                              {new Date(donation.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="donation-actions">
                          <button className="receipt-button">
                            <Download size={14} />
                            <span>Receipt</span>
                          </button>
                          <Link to={`/campaigns/${donation.campaignId}`} className="view-campaign-button">
                            <Eye size={14} />
                            <span>View Campaign</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
