import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
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
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [userCampaignExist, setUserCampaignExist] = useState(false);
  const [userDonations, setUserDonations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

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
          });

          setUserDonations([
            {
              id: 1,
              campaignTitle: 'Clean Water Initiative for Remote Villages',
              campaignId: 101,
              amount: 250,
              date: '2024-01-20',
              receipt: 'DON-2024-001',
              status: 'completed',
            },
            {
              id: 2,
              campaignTitle: 'Educational Supplies for Orphanage',
              campaignId: 102,
              amount: 150,
              date: '2024-01-18',
              receipt: 'DON-2024-002',
              status: 'completed',
            },
            {
              id: 3,
              campaignTitle: 'Emergency Food Distribution',
              campaignId: 103,
              amount: 100,
              date: '2024-01-15',
              receipt: 'DON-2024-003',
              status: 'completed',
            },
            {
              id: 4,
              campaignTitle: 'Disaster Relief Fund',
              campaignId: 104,
              amount: 300,
              date: '2024-01-12',
              receipt: 'DON-2024-004',
              status: 'completed',
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        localStorage.getItem("user_id")? setUserCampaignExist(true): setUserCampaignExist(false);
        const res = await fetch(`http://127.0.0.1:8000/api/campaigns/${localStorage.getItem("user_id")? localStorage.getItem("user_id"): 0}/`);
        const data = await res.json();
        setUserCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
    console.log('userCampaigns: ', userCampaigns);
  }, []);

  const handleWithdraw = (campaignId) => {
    // This will be connected to backend API
    console.log(`Withdrawing funds for campaign ${campaignId}`);
    // Add withdrawal logic here
  };

  const handleDeleteCampaign = (campaignId) => {
    // This will be connected to backend API
    console.log(`Deleting campaign ${campaignId}`);
    // Add delete logic here
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={16} className="status-icon active" />;
      case 'COMPLETED':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'PENDING':
        return <Clock size={16} className="status-icon pending" />;
      case 'REJECTED':
        return <XCircle size={16} className="status-icon rejected" />;
      default:
        return <AlertCircle size={16} className="status-icon" />;
    }
  };
  const getCampaignStatus = (endingDate) => {
    const end = new Date(endingDate);
    const today = new Date();

    if (end < today) {
      return 'Campaign ended';
    }

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days left`;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, {currentUser?.first_name || 'User'}!</h1>
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
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} />
            <span>Overview</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            <FileText size={18} />
            <span>My Campaigns</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <CreditCard size={18} />
            <span>My Donations</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
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
                    <span className="stat-change positive">
                      +12% this month
                    </span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>{dashboardStats.totalSupporters}</h3>
                    <p>Total Supporters</p>
                    <span className="stat-change positive">
                      +8 new supporters
                    </span>
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
                        <strong>New donation received</strong> - $50 for
                        "Emergency Relief for Flood Victims"
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
                        <strong>New supporter joined</strong> - "Building New
                        School" campaign
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
                        <strong>Campaign completed</strong> - "Medical Treatment
                        for Children" reached its goal
                      </p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
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
                  <p>
                    Start making a difference by creating your first campaign
                  </p>
                  <Link to="/create-campaign">
                    <Button className="primary-button">
                      <Plus size={18} />
                      Create Your First Campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="campaigns-grid">
                  {userCampaignExist && userCampaigns.map((campaign) => (
                    
                    <div key={campaign.id} className="campaign-card">
                      
                      <div className="-image">
                        <img
                          src={`http://localhost:8000${campaign.image}`}
                          alt={campaign.title}
                          className={`loaded`}
                        />
                      </div>

                      <div className="campaign-content">
                        <div className="campaign-category">
                          {campaign.category}
                        </div>
                        <h3 className="campaign-title">{campaign.title}</h3>

                        <div className="campaign-progress">
                          <div className="progress-info">
                            <span className="raised">
                              {formatCurrency(
                                parseFloat(campaign.percentage_funded) *
                                  parseFloat(campaign.goal_amount)
                              )}
                            </span>
                            <span className="goal">
                              of {formatCurrency(campaign.goal_amount)}
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(
                                  parseFloat(campaign.percentage_funded),
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div
                          className="campaign-stats"
                          style={{ paddingTop: '10px' }}
                        >
                          <div className="stat">
                            <Users size={14} />
                            <span>{0} supporters</span>
                          </div>
                          <div className="stat">
                            <Clock size={14} />
                            <span>
                              {getCampaignStatus(campaign.ending_date)}
                            </span>
                          </div>

                          <div className={`status-badge ${campaign.status}`}>
                            {getStatusIcon(campaign.status)}
                            <span>
                              {campaign.status.charAt(0).toUpperCase() +
                                campaign.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="campaign-actions">
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            className="action-button view"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </Link>
                          <button className="action-button edit">
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <Link
                            to={`/campaigns/${campaign.id}/withdraw`}
                            className="action-button withdraw"
                          >
                            <Wallet size={18} />
                            <span>Withdraw</span>
                          </Link>
                          <button
                            className="action-button delete"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                          >
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

          {activeTab === 'donations' && (
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
                      <p className="summary-amount">
                        {formatCurrency(dashboardStats.totalDonated)}
                      </p>
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
                          <h4 className="donation-campaign">
                            {donation.campaignTitle}
                          </h4>
                          <div className="donation-details">
                            <span className="donation-amount">
                              {formatCurrency(donation.amount)}
                            </span>
                            <span className="donation-date">
                              {new Date(donation.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="donation-actions">
                          <button className="receipt-button">
                            <Download size={14} />
                            <span>Receipt</span>
                          </button>
                          <Link
                            to={`/campaigns/${donation.campaignId}`}
                            className="view-campaign-button"
                          >
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
  );
};

export default DashboardPage;
