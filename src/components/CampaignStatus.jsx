// src/components/CampaignStats.jsx
import { useState, useEffect } from 'react';
import { DollarSign, Users, Clock, TrendingUp } from 'lucide-react';
import './CampaignStats.css';

const CampaignStats = ({ campaign }) => {
  const [donationHistory, setDonationHistory] = useState([]);
  
  useEffect(() => {
    // Mock API call to get donation history
    const fetchDonationHistory = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setDonationHistory([
          { date: '2025-03-01', amount: 500 },
          { date: '2025-03-05', amount: 1200 },
          { date: '2025-03-10', amount: 3000 },
          { date: '2025-03-15', amount: 4500 },
          { date: '2025-03-20', amount: 8000 },
          { date: '2025-03-25', amount: 12500 }
        ]);
      }, 1000);
    };
    
    fetchDonationHistory();
  }, [campaign.id]);
  
  // Calculate daily average
  const calculateDailyAverage = () => {
    if (donationHistory.length < 2) return 0;
    
    const firstDate = new Date(donationHistory[0].date);
    const lastDate = new Date(donationHistory[donationHistory.length - 1].date);
    const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    
    return daysDiff > 0 ? Math.round(campaign.raised / daysDiff) : 0;
  };
  
  const dailyAverage = calculateDailyAverage();
  
  return (
    <div className="campaign-stats-container">
      <h3>Campaign Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <DollarSign size={24} className="stat-icon" />
          <div className="stat-content">
            <h4>Total Raised</h4>
            <p className="stat-value">${campaign.raised.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <Users size={24} className="stat-icon" />
          <div className="stat-content">
            <h4>Total Donors</h4>
            <p className="stat-value">{campaign.backers}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <Clock size={24} className="stat-icon" />
          <div className="stat-content">
            <h4>Days Left</h4>
            <p className="stat-value">{campaign.daysLeft}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={24} className="stat-icon" />
          <div className="stat-content">
            <h4>Daily Average</h4>
            <p className="stat-value">${dailyAverage.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="donation-chart">
        <h4>Donation Progress</h4>
        <div className="chart-container">
          {donationHistory.map((donation, index) => (
            <div 
              key={index} 
              className="chart-bar" 
              style={{ 
                height: `${(donation.amount / campaign.goal) * 100}%`,
                width: `${100 / donationHistory.length}%` 
              }}
            >
              <div className="tooltip">${donation.amount}</div>
            </div>
          ))}
        </div>
        <div className="chart-labels">
          {donationHistory.map((donation, index) => (
            <div 
              key={index} 
              className="chart-label"
              style={{ width: `${100 / donationHistory.length}%` }}
            >
              {new Date(donation.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignStats;