import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminTable from "../../components/admin/AdminTable"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import "./AdminCampaigns.css"

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Mock data fetch
    const fetchCampaigns = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        const mockCampaigns = [
          { 
            id: 1, 
            title: "Help in Disaster in Juba", 
            creator: "John Doe", 
            category: "Emergency", 
            raised: 12500, 
            goal: 25000, 
            status: "active",
            createdAt: "2023-05-15",
            endDate: "2023-07-15"
          },
          { 
            id: 2, 
            title: "Displaced from Jambo", 
            creator: "Sarah Smith", 
            category: "Emergency", 
            raised: 8750, 
            goal: 15000, 
            status: "active",
            createdAt: "2023-06-01",
            endDate: "2023-08-01"
          },
          { 
            id: 3, 
            title: "Education for Children", 
            creator: "Michael Brown", 
            category: "Education", 
            raised: 5200, 
            goal: 10000, 
            status: "pending",
            createdAt: "2023-06-10",
            endDate: "2023-09-10"
          },
          { 
            id: 4, 
            title: "Community Garden Project", 
            creator: "Emma Wilson", 
            category: "Community", 
            raised: 3000, 
            goal: 7500, 
            status: "pending",
            createdAt: "2023-06-12",
            endDate: "2023-08-12"
          },
          { 
            id: 5, 
            title: "Suspicious Campaign", 
            creator: "Anonymous", 
            category: "Medical", 
            raised: 500, 
            goal: 50000, 
            status: "flagged",
            createdAt: "2023-06-14",
            endDate: "2023-09-14"
          },
          { 
            id: 6, 
            title: "Clean Water Initiative", 
            creator: "David Johnson", 
            category: "Social Impact", 
            raised: 15000, 
            goal: 20000, 
            status: "active",
            createdAt: "2023-05-20",
            endDate: "2023-07-20"
          },
          { 
            id: 7, 
            title: "Medical Support for Children", 
            creator: "Lisa Chen", 
            category: "Medical", 
            raised: 7500, 
            goal: 12000, 
            status: "rejected",
            createdAt: "2023-06-05",
            endDate: "2023-08-05"
          },
        ]
        
        setCampaigns(mockCampaigns)
        setFilteredCampaigns(mockCampaigns)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
        setLoading(false)
      }
    }
    
    fetchCampaigns()
  }, [])

  useEffect(() => {
    // Filter campaigns based on search term and status filter
    const filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           campaign.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredCampaigns(filtered)
  }, [searchTerm, statusFilter, campaigns])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
  }

  const handleApproveCampaign = (id) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === id ? { ...campaign, status: 'active' } : campaign
      )
    )
  }

  const handleRejectCampaign = (id) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === id ? { ...campaign, status: 'rejected' } : campaign
      )
    )
  }

  const handleFlagCampaign = (id) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === id ? { ...campaign, status: 'flagged' } : campaign
      )
    )
  }

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Creator", accessor: "creator" },
    { header: "Category", accessor: "category" },
    { 
      header: "Raised", 
      accessor: "raised",
      cell: (value, row) => `$${value.toLocaleString()} of $${row.goal.toLocaleString()}`
    },
    { 
      header: "Progress", 
      accessor: "progress",
      cell: (_, row) => {
        const progress = (row.raised / row.goal) * 100
        return (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <span>{progress.toFixed(0)}%</span>
          </div>
        )
      }
    },
    { 
      header: "Status", 
      accessor: "status",
      cell: (value) => {
        let statusClass = ""
        switch (value) {
          case "active":
            statusClass = "status-active"
            break
          case "pending":
            statusClass = "status-pending"
            break
          case "rejected":
            statusClass = "status-rejected"
            break
          case "flagged":
            statusClass = "status-flagged"
            break
          default:
            statusClass = ""
        }
        
        return <span className={`status-badge ${statusClass}`}>{value}</span>
      }
    },
    { 
      header: "Actions", 
      accessor: "actions",
      cell: (_, row) => (
        <div className="action-buttons">
          <button className="action-button view" title="View Details">
            <Eye size={16} />
          </button>
          {row.status === "pending" && (
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
          {row.status !== "flagged" && row.status !== "rejected" && (
            <button 
              className="action-button flag" 
              title="Flag Campaign"
              onClick={() => handleFlagCampaign(row.id)}
            >
              <AlertTriangle size={16} />
            </button>
          )}
        </div>
      )
    }
  ]

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
        
        {showFilters && (
          <div className="filter-options">
            <div className="filter-group">
              <h3>Status</h3>
              <div className="filter-buttons">
                <button 
                  className={`filter-option ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("all")}
                >
                  All
                </button>
                <button 
                  className={`filter-option ${statusFilter === "active" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("active")}
                >
                  Active
                </button>
                <button 
                  className={`filter-option ${statusFilter === "pending" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("pending")}
                >
                  Pending
                </button>
                <button 
                  className={`filter-option ${statusFilter === "flagged" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("flagged")}
                >
                  Flagged
                </button>
                <button 
                  className={`filter-option ${statusFilter === "rejected" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("rejected")}
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
  )
}

export default AdminCampaigns
