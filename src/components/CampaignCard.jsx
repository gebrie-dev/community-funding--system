"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Tag,
  Clock,
  Heart,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Button from "./Button";
import "./CampaignCard.css";

const CampaignCard = ({ campaign }) => {
  const {
    id,
    title,
    description,
    image,
    raised,
    goal,
    daysLeft,
    category,
    donors,
  } = campaign;
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const progress = (raised / goal) * 100;
  const formattedProgress = Math.min(100, progress).toFixed(0);
  const formattedRaised = raised.toLocaleString();
  const formattedGoal = goal.toLocaleString();
  const donorCount = donors || Math.floor(raised / 100);

  // Handle donate button click
  const handleDonateClick = (e) => {
    e.preventDefault();
    navigate(
      `/payment-method?campaignId=${id}&title=${encodeURIComponent(title)}`
    );
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <article className="campaign-card" role="article">
      <div className="campaign-image">
        {isLoading && <div className="image-skeleton" />}
        <img
          src={imageError ? "/placeholder.svg?height=200&width=400" : image}
          alt={title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={isLoading ? "loading" : ""}
        />
        {category && (
          <div className="campaign-category" role="status">
            <Tag size={14} aria-hidden="true" />
            <span>{category}</span>
          </div>
        )}
        <div className="campaign-badge" role="status">
          <Heart size={14} aria-hidden="true" />
          <span>Featured</span>
        </div>
      </div>

      <div className="campaign-content">
        <h3 className="campaign-title">
          <Link to={`/campaign/${id}`}>{title}</Link>
        </h3>
        <p className="campaign-description">{description}</p>

        <div
          className="campaign-progress"
          role="progressbar"
          aria-valuenow={formattedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${formattedProgress}%` }}
              aria-label={`${formattedProgress}% funded`}
            />
          </div>

          <div className="progress-info">
            <div className="progress-percentage">
              {formattedProgress}% Funded
            </div>
            <div className="progress-amount">${formattedRaised} raised</div>
          </div>
        </div>


        <div className="campaign-actions">
          <Link
            to={`/campaign/${id}`}
            className="view-details-button"
            aria-label={`View details for ${title}`}
          >
            View Details
          </Link>
          <Button
            className="donate-button"
            onClick={handleDonateClick}
            aria-label={`Support ${title}`}
          >
            Support This Cause
          </Button>
        </div>
      </div>
    </article>
  );
};

export default CampaignCard;
