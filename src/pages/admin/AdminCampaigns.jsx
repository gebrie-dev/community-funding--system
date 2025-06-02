import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../config/api';
import './AdminCampaigns.css';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching campaigns from:', API_ENDPOINTS.ALL_CAMPAIGN);
        const response = await api.get(API_ENDPOINTS.ALL_CAMPAIGN);
        console.log('Raw API response:', response);

        const campaignsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        if (campaignsData.length === 0) {
          console.warn('No campaigns found in response');
        }

        const normalizedCampaigns = campaignsData.map((campaign) => {
          const rawStatus = campaign.status
            ? campaign.status.toLowerCase()
            : '';
          const normalizedStatus =
            rawStatus === 'approved'
              ? 'active'
              : ['pending', 'rejected', 'flagged'].includes(rawStatus)
              ? rawStatus
              : 'unknown';

          const documentUrl = campaign.document
            ? campaign.document.startsWith('http')
              ? campaign.document
              : `${BASE_URL}${campaign.document}`
            : null;

          console.log(`Campaign ID ${campaign.id} document:`, documentUrl);

          return {
            id: campaign.id || 0,
            title: campaign.title || '',
            creator: `${campaign.created_by?.first_name || ''} ${
              campaign.created_by?.last_name || ''
            }`.trim(),
            category: campaign.category ? campaign.category.toLowerCase() : '',
            raised:
              parseFloat(campaign.total_usd) ||
              parseFloat(campaign.total_birr) ||
              0,
            goal: parseFloat(campaign.goal_amount) || 0,
            status: normalizedStatus,
            createdAt: campaign.created_at
              ? campaign.created_at.split('T')[0]
              : 'N/A',
            endDate: campaign.ending_date || 'N/A',
            description: campaign.description || '',
            location: campaign.location || '',
            percentage_funded: parseFloat(campaign.percentage_funded) || 0,
            starting_date: campaign.starting_date || 'N/A',
            image: campaign.image || null,
            document: documentUrl,
          };
        });

        console.log('Fetched campaigns:', normalizedCampaigns);
        setCampaigns(normalizedCampaigns);
        setFilteredCampaigns(normalizedCampaigns);
      } catch (err) {
        console.error('Error fetching campaigns:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    const filtered = campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setFilteredCampaigns(filtered);
  }, [searchTerm, statusFilter, campaigns]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleApproveCampaign = async (id) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.changestatus}${id}/`, {
        status: 'APPROVED',
      });
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: 'active' } : campaign
        )
      );
      setSuccessMessage('Campaign approved successfully!');
      setTimeout(() => setSuccessMessage(''), 2500); // Hide after 3 seconds
    } catch (error) {
      setError('Failed to approve campaign. Please try again.');
    }
  };

  const handleRejectCampaign = async (id) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.changestatus}${id}/`, {
        status: 'REJECTED',
      });
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: 'rejected' } : campaign
        )
      );
      setSuccessMessage('Campaign rejected successfully!');
      setTimeout(() => setSuccessMessage(''), 2500); // Hide after 3 seconds
    } catch (error) {
      setError('Failed to reject campaign. Please try again.');
    }
  };

  const handleFlagCampaign = async (id) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.changestatus}${id}/`, {
        status: 'FLAGGED',
      });
      console.log('Flag response:', response.data);
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, status: 'flagged' } : campaign
        )
      );
    } catch (error) {
      console.error('Error flagging campaign:', error);
      setError('Failed to flag campaign. Please try again.');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Creator', accessor: 'creator' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Raised',
      accessor: 'raised',
      cell: (value, row) =>
        `$${value.toLocaleString()} of $${row.goal.toLocaleString()}`,
    },
    {
      header: 'Progress',
      accessor: 'progress',
      cell: (_, row) => {
        const progress = row.goal > 0 ? (row.raised / row.goal) * 100 : 0;
        return (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <span>{progress.toFixed(0)}%</span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        let statusClass = '';
        switch (value) {
          case 'active':
            statusClass = 'status-active';
            break;
          case 'pending':
            statusClass = 'status-pending';
            break;
          case 'rejected':
            statusClass = 'status-rejected';
            break;
          case 'flagged':
            statusClass = 'status-flagged';
            break;
          default:
            statusClass = 'status-unknown';
        }
        return value;
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="action-buttons">
          <a
            href={row.document || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`action-button view ${!row.document ? 'disabled' : ''}`}
            title="View Document"
            onClick={(e) => !row.document && e.preventDefault()}
          >
            <Eye size={16} />
          </a>
          {row.status === 'pending' && (
            <>
              <button
                className="action-button approve"
                title="Approve Campaign"
                onClick={() => handleApproveCampaign(row.id)}
              >
                <CheckCircle size={16} />
              </button>
              <button
                className="action-button reject"
                title="Reject Campaign"
                onClick={() => handleRejectCampaign(row.id)}
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          {/* {row.status !== 'flagged' && row.status !== 'rejected' && (
            <button
              className="action-button flag"
              title="Flag Campaign"
              onClick={() => handleFlagCampaign(row.id)}
            >
              <AlertTriangle size={16} />
            </button>
          )} */}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-campaigns">
        <div className="campaigns-header">
          <h1>Manage Campaigns</h1>
          <div className="campaigns-actions">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <button
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {showFilters && (
          <div className="filter-options">
            <div className="filter-group">
              <h3>Status</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-option ${
                    statusFilter === 'all' ? 'active' : ''
                  }`}
                  onClick={() => handleStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-option ${
                    statusFilter === 'active' ? 'active' : ''
                  }`}
                  onClick={() => handleStatusFilter('active')}
                >
                  Active
                </button>
                <button
                  className={`filter-option ${
                    statusFilter === 'pending' ? 'active' : ''
                  }`}
                  onClick={() => handleStatusFilter('pending')}
                >
                  Pending
                </button>
                <button
                  className={`filter-option ${
                    statusFilter === 'flagged' ? 'active' : ''
                  }`}
                  onClick={() => handleStatusFilter('flagged')}
                >
                  Flagged
                </button>
                <button
                  className={`filter-option ${
                    statusFilter === 'rejected' ? 'active' : ''
                  }`}
                  onClick={() => handleStatusFilter('rejected')}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
        )}

        <AdminTable
          columns={columns}
          data={filteredCampaigns}
          loading={loading}
          emptyMessage="No campaigns found"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCampaigns;
