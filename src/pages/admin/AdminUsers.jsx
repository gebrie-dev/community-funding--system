import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminTable from "../../components/admin/AdminTable"
import { Search, Filter, Eye, UserX, Lock, Unlock } from 'lucide-react'
import "./AdminUsers.css"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Mock data fetch
    const fetchUsers = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        const mockUsers = [
          { 
            id: 1, 
            name: "John Doe", 
            email: "john.doe@example.com", 
            role: "user", 
            status: "active",
            campaigns: 2,
            donations: 5,
            joinedAt: "2023-01-15"
          },
          { 
            id: 2, 
            name: "Sarah Smith", 
            email: "sarah.smith@example.com", 
            role: "user", 
            status: "active",
            campaigns: 1,
            donations: 12,
            joinedAt: "2023-02-20"
          },
          { 
            id: 3, 
            name: "Michael Brown", 
            email: "michael.brown@example.com", 
            role: "user", 
            status: "active",
            campaigns: 3,
            donations: 0,
            joinedAt: "2023-03-10"
          },
          { 
            id: 4, 
            name: "Emma Wilson", 
            email: "emma.wilson@example.com", 
            role: "user", 
            status: "active",
            campaigns: 1,
            donations: 8,
            joinedAt: "2023-04-05"
          },
          { 
            id: 5, 
            name: "David Johnson", 
            email: "david.johnson@example.com", 
            role: "admin", 
            status: "active",
            campaigns: 0,
            donations: 15,
            joinedAt: "2022-12-01"
          },
          { 
            id: 6, 
            name: "Lisa Chen", 
            email: "lisa.chen@example.com", 
            role: "user", 
            status: "blocked",
            campaigns: 4,
            donations: 2,
            joinedAt: "2023-01-30"
          },
          { 
            id: 7, 
            name: "Robert Miller", 
            email: "robert.miller@example.com", 
            role: "user", 
            status: "blocked",
            campaigns: 1,
            donations: 0,
            joinedAt: "2023-02-15"
          },
        ]
        
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search term and status filter
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredUsers(filtered)
  }, [searchTerm, statusFilter, users])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
  }

  const handleBlockUser = (id) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, status: 'blocked' } : user
      )
    )
  }

  const handleUnblockUser = (id) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, status: 'active' } : user
      )
    )
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { 
      header: "Role", 
      accessor: "role",
      cell: (value) => (
        <span className={`role-badge ${value === "admin" ? "role-admin" : "role-user"}`}>
          {value}
        </span>
      )
    },
    { header: "Campaigns", accessor: "campaigns" },
    { header: "Donations", accessor: "donations" },
    { 
      header: "Joined", 
      accessor: "joinedAt",
      cell: (value) => new Date(value).toLocaleDateString()
    },
    { 
      header: "Status", 
      accessor: "status",
      cell: (value) => {
        let statusClass = value === "active" ? "status-active" : "status-blocked"
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
          {row.status === "active" ? (
            <button 
              className="action-button block" 
              title="Block User"
              onClick={() => handleBlockUser(row.id)}
            >
              <Lock size={16} />
            </button>
          ) : (
            <button 
              className="action-button unblock" 
              title="Unblock User"
              onClick={() => handleUnblockUser(row.id)}
            >
              <Unlock size={16} />
            </button>
          )}
          <button className="action-button delete" title="Delete User">
            <UserX size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="users-header">
          <h1>Manage Users</h1>
          <div className="users-actions">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search users..." 
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
                  className={`filter-option ${statusFilter === "blocked" ? "active" : ""}`}
                  onClick={() => handleStatusFilter("blocked")}
                >
                  Blocked
                </button>
              </div>
            </div>
          </div>
        )}
        
        <AdminTable 
          columns={columns} 
          data={filteredUsers} 
          loading={loading}
          emptyMessage="No users found"
        />
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
