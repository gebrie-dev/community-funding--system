import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import "./CampaignCard.css";

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);

  // Function to handle navigation to PaymentMethodPage
  const handleSupportClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/campaigns/${campaign.id}/payment`);
  };

  // Function to handle navigation to campaign details
  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/campaigns/${campaign.id}`);
  };

  // Function to handle save/bookmark toggle
  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Here you can add API call to save/unsave campaign
    console.log(`Campaign ${campaign.id} ${isSaved ? "unsaved" : "saved"}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="campaign-card">
      <div className="campaign-image-container">
        <Link to={`/campaigns/${campaign.id}`} className="campaign-link">
          <img
            src={`http://localhost:8000${campaign.image}`}
            alt={campaign.title}
            className={`campaign-image ${imageLoaded ? "loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && <div className="image-skeleton"></div>}
        </Link>

        {/* Category Badge */}
        <span className="campaign-category">{campaign.category}</span>

        {/* Save/Bookmark Button */}
        <button
          className={`save-button ${isSaved ? "saved" : ""}`}
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Remove from saved" : "Save campaign"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="campaign-content">
        <Link to={`/campaigns/${campaign.id}`} className="campaign-title-link">
          <h3 className="campaign-title">{campaign.title}</h3>
        </Link>

        <p className="campaign-description">
          {campaign.description.length > 100
            ? `${campaign.description.slice(0, 100)}...`
            : campaign.description}
        </p>

        {/* Progress Section */}
        <div className="campaign-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="progress-info">
            <div className="progress-amounts">
              <span className="amount-raised">
                {formatCurrency(campaign.raised)}
              </span>
              <span className="amount-goal">
                {" "}
                raised of {formatCurrency(campaign.goal)}
              </span>
            </div>
            <span className="progress-percentage">{progress.toFixed(0)}%</span>
          </div>

          {/* Additional Stats */}
          {(campaign.backers || campaign.daysLeft) && (
            <div className="progress-stats">
              {campaign.backers && (
                <div className="stat">
                  <svg
                    className="stat-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>{campaign.backers} backers</span>
                </div>
              )}
              {campaign.daysLeft && (
                <div className="stat">
                  <svg
                    className="stat-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{campaign.daysLeft} days left</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="campaign-actions">
        <Button
          onClick={handleViewDetails}
          className="view-details-button"
          variant="outline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Details
        </Button>

        <Button onClick={handleSupportClick} className="support-button">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Fund
        </Button>
      </div>
    </div>
  );
};

export default CampaignCard;
