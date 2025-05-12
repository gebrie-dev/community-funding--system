import { ArrowUp, ArrowDown } from "lucide-react"
import "./AdminStats.css"

const AdminStats = ({ title, value, icon, change, positive }) => {
  return (
    <div className="admin-stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {change && (
          <div className={`stat-change ${positive ? "positive" : "negative"}`}>
            {positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStats
