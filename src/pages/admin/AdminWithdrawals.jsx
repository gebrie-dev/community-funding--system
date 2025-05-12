import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminTable from "../../components/admin/AdminTable"
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react'
import "./AdminWithdrawals.css"

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Mock data fetch
    const fetchWithdrawals = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        const mockWithdrawals = [
          { 
            id: 1, 
            campaignTitle: "Help in Disaster in Juba", 
            requester: "John Doe", 
            amount: 5000, 
            requestDate: "2023-06-15",
            status: "pending",
            paymentMethod: "Bank Transfer",
            accountDetails: "XXXX-XXXX-1234"
          },
          { 
            id: 2, 
            campaignTitle: "Displaced from Jambo", 
            requester: "Sarah Smith", 
            amount: 3500, 
            requestDate: "2023-06-14",
            status: "approved",
            paymentMethod: "PayPal",
            accountDetails: "sarah.smith@example.com"
          },
          { 
            id: 3, 
            campaignTitle: "Education for Children", 
            requester: "Michael Brown", 
            amount: 2000, 
            requestDate: "2023-06-13",
            status: "pending",
            paymentMethod: "Bank Transfer",
            accountDetails: "XXXX-XXXX-5678"
          },
          { 
            id: 4, 
            campaignTitle: "Community Garden Project", 
            requester: "Emma Wilson", 
            amount: 1500, 
            requestDate: "2023-06-12",
            status: "rejected",
            paymentMethod: "Mobile Money",
            accountDetails: "+1234567890"
          },
          { 
            id: 5, 
            campaignTitle: "Clean Water Initiative", 
            requester: "David Johnson", 
            amount: 7500, 
            requestDate: "2023-06-10",
            status: "approved",
            paymentMethod: "Bank Transfer",
            accountDetails: "XXXX-XXXX-9012"
          },
          { 
            id: 6, 
            campaignTitle: "Medical Support for Children", 
            requester: "Lisa Chen", 
            amount: 4000, 
            requestDate: "2023-06-08",
            status: "pending",
            paymentMethod: "PayPal",
            accountDetails: "lisa.chen@example.com"
          },
        ]
        
        setWithdrawals(mockWithdrawals)
        setFilteredWithdrawals(mockWithdrawals)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
        setLoading(false)
      }
    }
    
    fetchWithdrawals()
  }, [])

  useEffect(() => {
    // Filter withdrawals based on search term and status filter
    const filtered = withdrawals.filter(withdrawal => {
      const matchesSearch = withdrawal.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           withdrawal.requester.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredWithdrawals(filtered)
  }, [searchTerm, statusFilter, withdrawals])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
  }

  const handleApproveWithdrawal = (id) => {
    setWithdrawals(prevWithdrawals => 
      prevWithdrawals.map(withdrawal => 
        withdrawal.id === id ? { ...withdrawal, status: 'approved' } : withdrawal
      )
    )
  }

  const handleRejectWithdrawal = (id) => {
    setWithdrawals(prevWithdrawals => 
      prevWithdrawals.map(withdrawal => 
        withdrawal.id === id ? { ...withdrawal, status: 'rejected' } : withdrawal
      )
    )
  }

  const columns = [
    { header: "Campaign", accessor: "campaignTitle" },
    { header: "Requester", accessor: "requester" },
    { 
      header: "Amount", 
      accessor: "amount",
      cell: (value) => `$${value.toLocaleString()}`
    },
    { 
      header: "Request Date", 
      accessor: "requestDate",
      cell: (value) => new Date(value).toLocaleDateString()
    },
    { header: "Payment Method", accessor: "paymentMethod" },
    { 
      header: "Status", 
      accessor: "status",
      cell: (value) => {
        let statusClass = ""
        switch (value) {
          case "approved":
            statusClass = "status-approved"
            break
          case "pending":
            statusClass = "status-pending"
            break
          case "rejected":
            statusClass = "status-rejected"
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
                title="Approve Withdrawal"
                onClick={() => handleApproveWithdrawal(row.id)}
              >
                <CheckCircle size={16} />
              </button>
              <button 
                className="action-button reject" 
                title="Reject Withdrawal"
                onClick={() => handleRejectWithdrawal(row.id)}
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="admin-withdrawals">
        <div className="withdrawals-header">
          <h1>Withdrawal Requests</h1>
          <div className="withdrawals-actions">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search withdrawals..." 
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
                  className={`filter-option ${statusFilter === "pending" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("pending")}
                >
                  Pending
                </button>
                <button 
                  className={`filter-option ${statusFilter === "approved" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("approved")}
                >
                  Approved
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
        
        <div className="withdrawal-summary">
          <div className="summary-card pending">
            <h3>Pending</h3>
            <p className="amount">
              ${withdrawals.filter(w => w.status === "pending")
                .reduce((sum, w) => sum + w.amount, 0)
                .toLocaleString()}
            </p>
            <p className="count">
              {withdrawals.filter(w => w.status === "pending").length} requests
            </p>
          </div>
          
          <div className="summary-card approved">
            <h3>Approved</h3>
            <p className="amount">
              ${withdrawals.filter(w => w.status === "approved")
                .reduce((sum, w) => sum + w.amount, 0)
                .toLocaleString()}
            </p>
            <p className="count">
              {withdrawals.filter(w => w.status === "approved").length} requests
            </p>
          </div>
          
          <div className="summary-card rejected">
            <h3>Rejected</h3>
            <p className="amount">
              ${withdrawals.filter(w => w.status === "rejected")
                .reduce((sum, w) => sum + w.amount, 0)
                .toLocaleString()}
            </p>
            <p className="count">
              {withdrawals.filter(w => w.status === "rejected").length} requests
            </p>
          </div>
        </div>
        
        <AdminTable 
          columns={columns} 
          data={filteredWithdrawals} 
          loading={loading}
          emptyMessage="No withdrawal requests found"
        />
      </div>
    </AdminLayout>
  )
}

export default AdminWithdrawals
