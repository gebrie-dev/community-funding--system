// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CampaignCard from "../components/CampaignCard";
import SearchBar from "../components/SearchBar";
import CategorySection from "../components/CategorySection";
import { Heart, Users, Clock, Shield, CreditCard } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./HomePage.css";

const HomePage = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useTheme();

  useEffect(() => {
    // Mock data for featured campaigns
    const mockCampaigns = [
      {
        id: 1,
        title: "Help in Disaster in Juba",
        description:
          "Your donation is needed for victims of flooding in Juba. Help provide essential supplies.",
        image: "/images/flood-disaster.png",
        raised: 12500,
        goal: 25000,
        daysLeft: 15,
        category: "Emergency",
      },
      {
        id: 2,
        title: "Displaced from Jambo",
        description:
          "Help people displaced by conflict in Jambo region with food, shelter and medical aid.",
        image: "/images/displaced-people.png",
        raised: 8750,
        goal: 15000,
        daysLeft: 21,
        category: "Social Impact",
      },
      {
        id: 3,
        title: "Medical Treatment for Sarah",
        description:
          "Help fund Sarah's critical surgery and post-operative care. Your support can save a life.",
        image: "/images/sarah.png",
        raised: 15000,
        goal: 30000,
        daysLeft: 10,
        category: "Medical",
      },
      {
        id: 4,
        title: "School Building Project",
        description:
          "Help build a new school for children in rural areas who currently have no access to education.",
        image: "/images/school-project.png",
        raised: 20000,
        goal: 50000,
        daysLeft: 45,
        category: "Education",
      },
    ];

    setFeaturedCampaigns(mockCampaigns);
    setFilteredCampaigns(mockCampaigns);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredCampaigns(featuredCampaigns);
      return;
    }

    const filtered = featuredCampaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(term.toLowerCase()) ||
        campaign.description.toLowerCase().includes(term.toLowerCase()) ||
        (campaign.category &&
          campaign.category.toLowerCase().includes(term.toLowerCase()))
    );

    setFilteredCampaigns(filtered);
  };

  return (
    <div className={`home-page ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Raise Funds for Causes That Matter!</h1>
            <p>
              Join a growing community dedicated to supporting important causes.
              Your change makes a difference today.
            </p>
            <div className="hero-actions">
              <Link to="/create-campaign">
                <Button className="cta-button">Launch Campaign</Button>
              </Link>
              <Link to="/campaigns">
                <Button className="secondary-button">Explore Campaigns</Button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/community-funding.png" alt="Community Funding" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="feature">
            <div className="feature-icon">
              <Heart size={32} />
            </div>
            <h3>Make an Impact</h3>
            <p>
              Your contribution directly helps those in need and creates lasting
              change in communities.
            </p>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3>Join a Community</h3>
            <p>
              Connect with like-minded individuals committed to making the world
              a better place.
            </p>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <Clock size={32} />
            </div>
            <h3>Quick & Secure</h3>
            <p>
              Our platform ensures your donations are processed securely and
              reach their destination quickly.
            </p>
          </div>
        </div>
      </section>

      <CategorySection />

      <section className="testimonial-section">
        <div className="testimonial-container">
          <div className="testimonial-content">
            <div className="testimonial-quote">
              <h3>
                Thanks to this platform, I funded my medical bills in just two
                weeks!
              </h3>
              <div className="social-proof">
                <div className="social-icon facebook"></div>
                <div className="social-icon twitter"></div>
                <div className="social-icon instagram"></div>
              </div>
            </div>
            <div className="testimonial-image">
              <img src="/images/testimonial.png" alt="Testimonial" />
              <div className="testimonial-badge">
                <span>Verified Fundraiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="campaigns-section">
        <div className="campaigns-header">
          <h2>Explore Causes</h2>
          <SearchBar onSearch={handleSearch} />
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="no-results">
            <p>No campaigns found matching "{searchTerm}"</p>
            <button onClick={() => handleSearch("")} className="reset-search">
              View all campaigns
            </button>
          </div>
        ) : (
          <div className="campaigns-container">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>

      <section className="faq-section">
        <div className="faq-section-header">
          <h2>Quick Answers</h2>
          <p>Common questions about our platform</p>
        </div>
        <div className="faq-container">
          <div className="faq-row">
            <div className="faq-item">
              <div className="faq-icon">
                <CreditCard size={24} />
              </div>
              <div className="faq-content">
                <h3>What payment methods do you accept?</h3>
                <p>
                  We accept all major credit cards, PayPal, and bank transfers.
                  All transactions are secure and encrypted.
                </p>
                <Link to="/faq" className="learn-more">
                  Learn more about payments →
                </Link>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">
                <Shield size={24} />
              </div>
              <div className="faq-content">
                <h3>How do you verify campaigns?</h3>
                <p>
                  All campaigns undergo a thorough verification process
                  including identity checks and documentation review.
                </p>
                <Link to="/faq" className="learn-more">
                  Learn more about verification →
                </Link>
              </div>
            </div>
          </div>
          <div className="faq-row">
            <div className="faq-item">
              <div className="faq-icon">
                <Users size={24} />
              </div>
              <div className="faq-content">
                <h3>How do I start a campaign?</h3>
                <p>
                  Create an account, click "Launch Campaign", and follow our
                  simple step-by-step guide to get started.
                </p>
                <Link to="/faq" className="learn-more">
                  Learn more about campaigns →
                </Link>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">
                <Clock size={24} />
              </div>
              <div className="faq-content">
                <h3>How long do campaigns run?</h3>
                <p>
                  Campaigns can run for up to 60 days, with options to extend or
                  create new ones if needed.
                </p>
                <Link to="/faq" className="learn-more">
                  Learn more about timing →
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="faq-cta">
          <p>Need more information?</p>
          <Link to="/faq" className="view-all-faq">
            View All FAQs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
