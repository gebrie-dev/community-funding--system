"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import CampaignCard from "../components/CampaignCard"
import CategorySection from "../components/CategorySection"
import {
  Heart,
  Users,
  Clock,
  Shield,
  CreditCard,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import ChatBot from "../components/ChatBot"
import { api } from "../utils/api"
import { API_ENDPOINTS } from "../config/api"
import "./HomePage.css"

const HomePage = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { darkMode } = useTheme()

  // Fetch campaigns from the API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching campaigns from:", API_ENDPOINTS.CAMPAIGNS)
        const response = await api.get(API_ENDPOINTS.CAMPAIGNS)
        // Normalize category to lowercase for frontend consistency
        const normalizedCampaigns = response.map((campaign) => ({
          ...campaign,
          category: campaign.category ? campaign.category.toLowerCase() : "",
        }))
        console.log("Fetched campaigns:", normalizedCampaigns)

        // Get only the first 3 campaigns for the featured section
        setFeaturedCampaigns(normalizedCampaigns.slice(0, 3))
      } catch (err) {
        console.error("Error fetching campaigns:", err)
        setError("Failed to load campaigns. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`home-page ${darkMode ? "dark" : ""}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Award size={16} />
              <span>Trusted by 45,000+ donors worldwide</span>
            </div>
            <h1>Raise Funds for Causes That Matter!</h1>
            <p>
              Join a growing community dedicated to supporting important causes. Your change makes a difference today.
            </p>
            <div className="hero-actions">
              <Link to="/create-campaign">
                <Button className="cta-button">Start Your Campaign</Button>
              </Link>
              <Link to="/campaigns">
                <Button className="secondary-button">Explore Causes</Button>
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-container">
              <img src="/images/community-funding.png" alt="Community Impact" className="hero-image" />
              <div className="floating-card card-1">
                <div className="card-icon">
                  <Heart size={20} />
                </div>
                <div className="card-content">
                  <span className="card-number">2.5M+</span>
                  <span className="card-label">Lives Impacted</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">
                  <Users size={20} />
                </div>
                <div className="card-content">
                  <span className="card-number">1.2K+</span>
                  <span className="card-label">Active Campaigns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Trusted by thousands of donors and campaign creators worldwide</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>100% Secure</h3>
              <p>
                Bank-level security with 256-bit SSL encryption. Your donations are protected and reach their
                destination safely.
              </p>
              <div className="feature-badge">
                <CheckCircle size={14} />
                <span>Verified Secure</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>Instant Impact</h3>
              <p>
                Funds are transferred quickly to campaign creators, ensuring immediate help for those who need it most.
              </p>
              <div className="feature-badge">
                <CheckCircle size={14} />
                <span>Fast Processing</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Global Community</h3>
              <p>
                Join thousands of compassionate individuals making a difference in communities across Ethiopia and
                beyond.
              </p>
              <div className="feature-badge">
                <CheckCircle size={14} />
                <span>45K+ Members</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Proven Results</h3>
              <p>
                98% of campaigns reach their goals with our platform's powerful tools and engaged community support.
              </p>
              <div className="feature-badge">
                <CheckCircle size={14} />
                <span>98% Success</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Campaigns */}
      <section className="campaigns-section">
        <div className="campaigns-container">
          <div className="section-header">
            <h2>Featured Campaigns</h2>
            <p>Discover inspiring stories and support causes that matter</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading campaigns...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-message">
                <Shield size={24} />
                <h3>Couldn't load campaigns</h3>
                <p>{error}</p>
              </div>
              <Button className="retry-button" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : featuredCampaigns.length === 0 ? (
            <div className="no-campaigns">
              <h3>No campaigns available</h3>
              <p>Check back soon for new campaigns</p>
            </div>
          ) : (
            <div className="campaigns-grid">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}

          <div className="campaigns-cta">
            <Link to="/campaigns">
              <Button className="view-all-button">
                View All Campaigns
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="success-story-section">
        <div className="success-story-container">
          <div className="success-story-content">
            <div className="success-story-text">
              <div className="story-badge">
                <Star size={16} />
                <span>Success Story</span>
              </div>
              <h3>Thanks to this platform, I funded my medical bills in just two weeks!</h3>
              <div className="story-author">
                <div className="author-info">
                  <h4>Sarah Tadesse</h4>
                  <p>Mother of 3, Addis Ababa</p>
                </div>
                <div className="story-stats">
                  <div className="story-stat">
                    <span className="stat-number">$15,000</span>
                    <span className="stat-label">Raised in 10 days</span>
                  </div>
                  <div className="story-stat">
                    <span className="stat-number">340</span>
                    <span className="stat-label">Supporters</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="success-story-image">
              <img src="/images/testimonial.png" alt="Success Story" />
              <div className="story-overlay">
                <div className="play-button">
                  <Play size={24} />
                </div>
                <span>Watch Sarah's Story</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our platform</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <div className="faq-icon">
                <CreditCard size={24} />
              </div>
              <div className="faq-content">
                <h3>What payment methods do you accept?</h3>
                <p>We accept Chapa, PayPal, and all major credit cards. All transactions are secure and encrypted.</p>
                <Link to="/faq" className="learn-more">
                  Learn more about payments <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">
                <Shield size={24} />
              </div>
              <div className="faq-content">
                <h3>How do you verify campaigns?</h3>
                <p>All campaigns undergo thorough verification including identity checks and documentation review.</p>
                <Link to="/faq" className="learn-more">
                  Learn more about verification <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">
                <Users size={24} />
              </div>
              <div className="faq-content">
                <h3>How do I start a campaign?</h3>
                <p>Create an account, click "Start Your Campaign", and follow our simple step-by-step guide.</p>
                <Link to="/faq" className="learn-more">
                  Learn more about campaigns <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">
                <Clock size={24} />
              </div>
              <div className="faq-content">
                <h3>How long do campaigns run?</h3>
                <p>Campaigns can run for up to 60 days, with options to extend or create new ones if needed.</p>
                <Link to="/faq" className="learn-more">
                  Learn more about timing <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
          <div className="faq-cta">
            <p>Still have questions?</p>
            <Link to="/faq" className="view-all-faq">
              View All FAQs
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of people who are already creating positive change in their communities.</p>
            <div className="cta-actions">
              <Link to="/create-campaign">
                <Button className="cta-primary">
                  Start Your Campaign
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/campaigns">
                <Button className="cta-secondary">Explore Campaigns</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ChatBot />
    </div>
  )
}

export default HomePage
