
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import {
  Heart,
  Share2,
  Calendar,
  DollarSign,
  ShieldAlert,
  Users,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react"
import "./CampaignDetailsPage.css"

const CampaignDetailsPage = () => {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [donationAmount, setDonationAmount] = useState(50)
  const [isSaved, setIsSaved] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(`http://localhost:8000/api/campaigns/${id}/`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch campaign details")
        }
        const data = await response.json()
        // if (data.status !== "APPROVED") {
        //   throw new Error("Campaign is not available")
        // }

        // Calculate days left based on ending_date
        const endDate = new Date(data.ending_date)
        const today = new Date()
        const timeDiff = endDate - today
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
        // console.log("response", data)
        
        // Map API data to expected campaign structure
        setCampaign({
          id: data.id,
          title: data.title,
          description: data.description,
          longDescription: data.description,
          image: data.image,
          raised: Math.floor(Math.random() * data.goal * 0.7), // Simulated for demo
          goal: Number.parseFloat(data.goal),
          daysLeft: daysLeft > 0 ? daysLeft : 0,
          backers: Math.floor(Math.random() * 200) + 10, // Simulated for demo
          category: data.category || "General",
          location: "Global", // Fallback
          updates: [], // API doesn't provide updates
          organizer: {
            name: `Campaign ${data.id}`,
            image: "/placeholder.svg?height=60&width=60",
            verified: Math.random() > 0.5,
          },
        })
        // console.log("campain", campaign)
      } catch (error) {
        console.error("Error fetching campaign:", error)
        setError(error.message || "An error occurred while fetching campaign details.")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [id])

  const handleDonate = () => {
    navigate(`/campaigns/${id}/payment`, { state: { amount: donationAmount } })
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    // Add API call to save/unsave campaign
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="campaign-details-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="campaign-details-page">
        <Navbar />
        <div className="error-container">
          <div className="error-message">
            <ShieldAlert size={24} />
            <h2>Campaign Not Found</h2>
            <p>{error || "The campaign you're looking for doesn't exist or has been removed."}</p>
          </div>
          <Link to="/campaigns">
            <Button className="back-button">
              <ArrowLeft size={18} />
              Browse Campaigns
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100)

  return (
    <div className="campaign-details-page">
      <Navbar />

      <div className="campaign-details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/campaigns" className="breadcrumb-link">
            <ArrowLeft size={16} />
            Back to Campaigns
          </Link>
        </div>

        {/* Campaign Header */}
        <div className="campaign-header">
          <div className="header-content">
            <div className="campaign-meta">
              <span className="category-badge">{campaign.category}</span>
              <div className="meta-info">
                <MapPin size={14} />
                <span>{campaign.location}</span>
              </div>
            </div>
            <h1 className="campaign-title">{campaign.title}</h1>
          </div>

          <div className="campaign-actions">
            <button className={`action-button ${isSaved ? "saved" : ""}`} onClick={handleSave}>
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
            <button className="action-button" onClick={handleShare}>
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="campaign-content">
          {/* Main Content */}
          <div className="campaign-main">
            {/* Campaign Image */}
            <div className="campaign-image-container">
              <img
                src={`http://localhost:8000${campaign.image}`}
                alt={campaign.title}
                className={`campaign-image ${imageLoaded ? "loaded" : ""}`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && <div className="image-skeleton"></div>}
            </div>

            {/* Organizer Info */}
            <div className="campaign-organizer">
              <div className="organizer-info">
                <img
                  src={campaign.organizer.image || "/placeholder.svg"}
                  alt={campaign.organizer.name}
                  onError={(e) => (e.target.src = "/placeholder.svg?height=60&width=60")}
                />
                <div className="organizer-details">
                  <p className="organizer-label">Organized by</p>
                  <h3 className="organizer-name">{campaign.organizer.name}</h3>
                </div>
              </div>
              {campaign.organizer.verified && (
                <div className="verified-badge">
                  <CheckCircle size={16} />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Campaign Description */}
            <div className="campaign-description">
              <h2>About this campaign</h2>
              <div className="description-content">
                <p>{campaign.longDescription}</p>
              </div>
            </div>

            {/* Updates Section */}
            {campaign.updates.length > 0 && (
              <div className="campaign-updates">
                <h2>Campaign Updates</h2>
                <div className="updates-list">
                  {campaign.updates.map((update, index) => (
                    <div key={index} className="update-item">
                      <div className="update-header">
                        <div className="update-date">
                          <Clock size={14} />
                          {new Date(update.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="update-content">{update.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="campaign-sidebar">
            {/* Donation Card */}
            <div className="donation-card">
              <div className="progress-section">
                <div className="progress-stats">
                  <div className="raised-amount">{formatCurrency(campaign.raised)}</div>
                  <div className="goal-text">raised of {formatCurrency(campaign.goal)} goal</div>
                </div>

                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="campaign-metrics">
                  <div className="metric">
                    <Users size={16} />
                    <div className="metric-info">
                      <span className="metric-value">{campaign.backers}</span>
                      <span className="metric-label">supporters</span>
                    </div>
                  </div>
                  <div className="metric">
                    <Calendar size={16} />
                    <div className="metric-info">
                      <span className="metric-value">{campaign.daysLeft}</span>
                      <span className="metric-label">days left</span>
                    </div>
                  </div>
                  <div className="metric">
                    <TrendingUp size={16} />
                    <div className="metric-info">
                      <span className="metric-value">{progress.toFixed(0)}%</span>
                      <span className="metric-label">funded</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="donation-section">
                <h3>Support this campaign</h3>
                <div className="amount-options">
                  {[25, 50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      className={`amount-option ${donationAmount === amount ? "selected" : ""}`}
                      onClick={() => setDonationAmount(amount)}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                <div className="custom-amount-container">
                  <input
                    type="number"
                    className="custom-amount"
                    placeholder="Enter custom amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    min="1"
                  />
                </div>

                <button
                  className="donate-button"
                  onClick={handleDonate}
                  disabled={campaign.daysLeft === 0 || !donationAmount}
                >
                  <DollarSign size={18} />
                  <span>{campaign.daysLeft === 0 ? "Campaign Ended" : `Donate ${formatCurrency(donationAmount)}`}</span>
                </button>

                <div className="donation-footer">
                  <div className="security-info">
                    <CheckCircle size={14} />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="tax-info">
                    <span>Your donation may be tax-deductible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Card */}
            <div className="share-card">
              <h3>Help spread the word</h3>
              <p>Share this campaign with your network</p>
              <div className="share-buttons">
                <button className="share-button facebook">
                  <span>Facebook</span>
                </button>
                <button className="share-button twitter">
                  <span>Twitter</span>
                </button>
                <button className="share-button email">
                  <span>Email</span>
                </button>
                <button className="share-button copy">
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailsPage
