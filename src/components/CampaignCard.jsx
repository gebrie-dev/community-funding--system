"use client"

import { Link, useNavigate } from "react-router-dom"
import { Users, Tag, Clock, Heart, DollarSign } from "lucide-react"
import Button from "./Button"
import "./CampaignCard.css"

const CampaignCard = ({ campaign }) => {
  const { id, title, description, image, raised, goal, daysLeft, category, donors } = campaign
  const navigate = useNavigate()

  const progress = (raised / goal) * 100
  const formattedProgress = Math.min(100, progress).toFixed(0)

  // Handle donate button click
  const handleDonateClick = (e) => {
    e.preventDefault()
    navigate(`/payment-method?campaignId=${id}&title=${encodeURIComponent(title)}`)
  }

  return (
    <div className="campaign-card">
      <div className="campaign-image">
        <img src={image || "/placeholder.svg?height=200&width=400"} alt={title} />
        {category && (
          <div className="campaign-category">
            <Tag size={12} />
            <span>{category}</span>
          </div>
        )}
        <div className="campaign-badge">
          <Heart size={12} />
          <span>Featured</span>
        </div>
      </div>

      <div className="campaign-content">
        <h3 className="campaign-title">{title}</h3>
        <p className="campaign-description">{description}</p>

        <div className="campaign-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${formattedProgress}%` }}></div>
          </div>

          <div className="progress-info">
            <div className="progress-percentage">{formattedProgress}% Funded</div>
            <div className="progress-amount">${raised.toLocaleString()} raised</div>
          </div>
        </div>

        <div className="progress-stats">
          <div className="stat">
            <div className="stat-icon">
              <DollarSign size={14} />
            </div>
            <div className="stat-info">
              <span className="stat-value">${goal.toLocaleString()}</span>
              <span className="stat-label">Goal</span>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon">
              <Clock size={14} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{daysLeft}</span>
              <span className="stat-label">Days Left</span>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon">
              <Users size={14} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{donors || Math.floor(raised / 100)}</span>
              <span className="stat-label">Donors</span>
            </div>
          </div>
        </div>

        <div className="campaign-actions">
          <Link to={`/campaign/${id}`} className="view-details-button">
            View Details
          </Link>
          <Button className="donate-button" onClick={handleDonateClick}>
            Support This Cause
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CampaignCard
