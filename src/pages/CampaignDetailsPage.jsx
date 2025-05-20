// src/pages/CampaignDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Heart, Share2, Calendar, Users, DollarSign } from "lucide-react";
import "./CampaignDetailsPage.css";

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState(50);

  useEffect(() => {
    // Mock API call to fetch campaign details
    const fetchCampaign = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setCampaign({
            id,
            title: "Help in Disaster in Juba",
            description:
              "Your donation is needed for victims of flooding in Juba. The recent floods have displaced thousands of families who now need shelter, food, and medical supplies.",
            longDescription:
              "The flooding in Juba has caused widespread devastation, destroying homes, schools, and critical infrastructure. Over 5,000 families have been displaced and are currently living in temporary shelters. Your donation will help provide emergency relief including clean water, food, medical supplies, and temporary shelter. We're working with local organizations to ensure aid reaches those most in need as quickly as possible.",
            image: "/images/flood-disaster.jpg",
            raised: 12500,
            goal: 25000,
            daysLeft: 15,
            backers: 230,
            updates: [
              {
                date: "2025-03-15",
                content:
                  "First shipment of supplies has reached affected areas",
              },
              {
                date: "2025-03-10",
                content: "Emergency response team deployed to assess needs",
              },
            ],
            organizer: {
              name: "Relief International",
              image: "/images/organizer.jpg",
              verified: true,
            },
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="error-container">
        <h2>Campaign not found</h2>
        <p>
          The campaign you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/campaigns">
          <Button>Browse Campaigns</Button>
        </Link>
      </div>
    );
  }

  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <div className="campaign-details-page">
      <Navbar />

      <div className="campaign-details-container">
        <div className="campaign-header">
          <h1>{campaign.title}</h1>

          <div className="campaign-actions">
            <button className="action-button">
              <Heart size={20} />
              <span>Save</span>
            </button>
            <button className="action-button">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="campaign-content">
          <div className="campaign-main">
            <div className="campaign-image-large">
              <img
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
              />
            </div>

            <div className="campaign-organizer">
              <div className="organizer-info">
                <img
                  src={campaign.organizer.image || "/placeholder.svg"}
                  alt={campaign.organizer.name}
                />
                <div>
                  <p>Organized by</p>
                  <h3>{campaign.organizer.name}</h3>
                </div>
              </div>
              {campaign.organizer.verified && (
                <div className="verified-badge">
                  <span>Verified Organizer</span>
                </div>
              )}
            </div>

            <div className="campaign-description">
              <h2>About this campaign</h2>
              <p>{campaign.longDescription}</p>
            </div>

            <div className="campaign-updates">
              <h2>Updates</h2>
              {campaign.updates.map((update, index) => (
                <div key={index} className="update-item">
                  <div className="update-date">
                    {new Date(update.date).toLocaleDateString()}
                  </div>
                  <div className="update-content">{update.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="campaign-sidebar">
            <div className="donation-card">
              <div className="progress-container">
                <div className="progress-stats">
                  <div className="raised-amount">
                    ${campaign.raised.toLocaleString()}
                  </div>
                  <div className="goal-text">
                    raised of ${campaign.goal.toLocaleString()} goal
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="campaign-metrics">
                  <div className="metric">
                    <Users size={18} />
                    <span>{campaign.backers} donors</span>
                  </div>
                  <div className="metric">
                    <Calendar size={18} />
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </div>
              </div>

              <div className="donation-amount">
                <h3>Select donation amount</h3>
                <div className="amount-options">
                  {[20, 50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      className={`amount-option ${
                        donationAmount === amount ? "selected" : ""
                      }`}
                      onClick={() => setDonationAmount(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                  <input
                    type="number"
                    className="custom-amount"
                    placeholder="Custom amount"
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <Link to="/payment-method" className="donate-link">
                <Button className="donate-button">
                  <DollarSign size={18} />
                  <span>Donate Now</span>
                </Button>
              </Link>

              <div className="donation-footer">
                <p>Your donation is tax-deductible</p>
                <p>Secure payment processing</p>
              </div>
            </div>

            <div className="share-card">
              <h3>Spread the word</h3>
              <div className="share-buttons">
                <button className="share-button facebook">Facebook</button>
                <button className="share-button twitter">Twitter</button>
                <button className="share-button email">Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;
