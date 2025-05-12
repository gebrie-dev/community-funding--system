import { useState } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import { Calendar, Download, FileText, BarChart, PieChart, TrendingUp } from 'lucide-react'
import "./AdminReports.css"

const AdminReports = () => {
  const [reportType, setReportType] = useState("financial")
  const [dateRange, setDateRange] = useState("week")
  const [format, setFormat] = useState("pdf")
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = () => {
    setLoading(true)
    
    // Simulate report generation
    setTimeout(() => {
      setLoading(false)
      alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the last ${dateRange} generated in ${format.toUpperCase()} format`)
    }, 1500)
  }

  return (
    <AdminLayout>
      <div className="admin-reports">
        <h1>Reports Generation</h1>
        
        <div className="reports-container">
          <div className="report-options">
            <div className="option-group">
              <h2>Report Type</h2>
              <div className="report-types">
                <div 
                  className={`report-type ${reportType === "financial" ? "active" : ""}`}
                  onClick={() => setReportType("financial")}
                >
                  <BarChart size={24} />
                  <h3>Financial Report</h3>
                  <p>Donations, withdrawals, and platform fees</p>
                </div>
                
                <div 
                  className={`report-type ${reportType === "campaign" ? "active" : ""}`}
                  onClick={() => setReportType("campaign")}
                >
                  <PieChart size={24} />
                  <h3>Campaign Report</h3>
                  <p>Campaign performance and statistics</p>
                </div>
                
                <div 
                  className={`report-type ${reportType === "user" ? "active" : ""}`}
                  onClick={() => setReportType("user")}
                >
                  <TrendingUp size={24} />
                  <h3>User Activity Report</h3>
                  <p>User registrations and engagement</p>
                </div>
              </div>
            </div>
            
            <div className="option-group">
              <h2>Time Period</h2>
              <div className="date-range-options">
                <button 
                  className={`date-range-option ${dateRange === "day" ? "active" : ""}`}
                  onClick={() => setDateRange("day")}
                >
                  Today
                </button>
                <button 
                  className={`date-range-option ${dateRange === "week" ? "active" : ""}`}
                  onClick={() => setDateRange("week")}
                >
                  This Week
                </button>
                <button 
                  className={`date-range-option ${dateRange === "month" ? "active" : ""}`}
                  onClick={() => setDateRange("month")}
                >
                  This Month
                </button>
                <button 
                  className={`date-range-option ${dateRange === "quarter" ? "active" : ""}`}
                  onClick={() => setDateRange("quarter")}
                >
                  This Quarter
                </button>
                <button 
                  className={`date-range-option ${dateRange === "year" ? "active" : ""}`}
                  onClick={() => setDateRange("year")}
                >
                  This Year
                </button>
                <button 
  className={`date-range-option ${dateRange === "custom" ? "active" : ""}`}
  onClick={() => setDateRange("custom")}
>
  Custom Range
</button>

              </div>
              
              {dateRange === "custom" && (
                <div className="custom-date-range">
                  <div className="date-input-group">
                    <label>Start Date</label>
                    <div className="date-input">
                      <Calendar size={16} />
                      <input type="date" />
                    </div>
                  </div>
                  <div className="date-input-group">
                    <label>End Date</label>
                    <div className="date-input">
                      <Calendar size={16} />
                      <input type="date" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="option-group">
              <h2>Format</h2>
              <div className="format-options">
                <button 
                  className={`format-option ${format === "pdf" ? "active" : ""}`}
                  onClick={() => setFormat("pdf")}
                >
                  <FileText size={20} />
                  <span>PDF</span>
                </button>
                <button 
                  className={`format-option ${format === "excel" ? "active" : ""}`}
                  onClick={() => setFormat("excel")}
                >
                  <FileText size={20} />
                  <span>Excel</span>
                </button>
                <button 
                  className={`format-option ${format === "csv" ? "active" : ""}`}
                  onClick={() => setFormat("csv")}
                >
                  <FileText size={20} />
                  <span>CSV</span>
                </button>
              </div>
            </div>
            
            <button 
              className="generate-report-button"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <Download size={18} />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
          
          <div className="report-preview">
            <div className="preview-header">
              <h2>Report Preview</h2>
            </div>
            <div className="preview-content">
              <div className="preview-placeholder">
                {reportType === "financial" && (
                  <div className="financial-preview">
                    <h3>Financial Report Preview</h3>
                    <p>Time Period: {dateRange === "custom" ? "Custom Range" : `This ${dateRange}`}</p>
                    <div className="preview-chart">
                      <BarChart size={32} />
                      <p>Financial data visualization would appear here</p>
                    </div>
                    <div className="preview-data">
                      <div className="data-row">
                        <span>Total Donations:</span>
                        <span>$45,250</span>
                      </div>
                      <div className="data-row">
                        <span>Total Withdrawals:</span>
                        <span>$32,100</span>
                      </div>
                      <div className="data-row">
                        <span>Platform Fees:</span>
                        <span>$2,262.50</span>
                      </div>
                      <div className="data-row">
                        <span>Net Revenue:</span>
                        <span>$10,887.50</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {reportType === "campaign" && (
                  <div className="campaign-preview">
                    <h3>Campaign Report Preview</h3>
                    <p>Time Period: {dateRange === "custom" ? "Custom Range" : `This ${dateRange}`}</p>
                    <div className="preview-chart">
                      <PieChart size={32} />
                      <p>Campaign data visualization would appear here</p>
                    </div>
                    <div className="preview-data">
                      <div className="data-row">
                        <span>Total Campaigns:</span>
                        <span>48</span>
                      </div>
                      <div className="data-row">
                        <span>New Campaigns:</span>
                        <span>12</span>
                      </div>
                      <div className="data-row">
                        <span>Successful Campaigns:</span>
                        <span>18</span>
                      </div>
                      <div className="data-row">
                        <span>Average Success Rate:</span>
                        <span>37.5%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {reportType === "user" && (
                  <div className="user-preview">
                    <h3>User Activity Report Preview</h3>
                    <p>Time Period: {dateRange === "custom" ? "Custom Range" : `This ${dateRange}`}</p>
                    <div className="preview-chart">
                      <TrendingUp size={32} />
                      <p>User activity visualization would appear here</p>
                    </div>
                    <div className="preview-data">
                      <div className="data-row">
                        <span>Total Users:</span>
                        <span>1,243</span>
                      </div>
                      <div className="data-row">
                        <span>New Registrations:</span>
                        <span>87</span>
                      </div>
                      <div className="data-row">
                        <span>Active Users:</span>
                        <span>856</span>
                      </div>
                      <div className="data-row">
                        <span>Engagement Rate:</span>
                        <span>68.9%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
    
  )
}

export default AdminReports
