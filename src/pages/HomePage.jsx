// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CampaignCard from "../components/CampaignCard";
import SearchBar from "../components/SearchBar";
import CategorySection from "../components/CategorySection";
import { Heart, Users, Clock } from "lucide-react";
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
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-column">
            <div className="faq-item">
              <h3>How do I start a campaign?</h3>
              <p>
                Simply sign up, click on "Launch Campaign", fill in the details
                about your cause, add images or videos, set a funding goal, and
                publish!
              </p>
            </div>
            <div className="faq-item">
              <h3>How does the funding process work?</h3>
              <p>
                When people donate to your campaign, funds are securely held
                until the campaign ends. Once completed, the funds are
                transferred to your account minus a small platform fee.
              </p>
            </div>
            <div className="faq-item">
              <h3>What is your fee structure?</h3>
              <p>
                We charge a 5% platform fee on the funds you raise. Payment
                processors may charge an additional 2.9% + $0.30 per
                transaction.
              </p>
            </div>
          </div>
          <div className="faq-column">
            <div className="faq-item">
              <h3>Is there a time limit on campaigns?</h3>
              <p>
                You can choose to run your campaign for up to 60 days. If you
                need more time, you can always extend your campaign or create a
                new one.
              </p>
            </div>
            <div className="faq-item">
              <h3>How do donors know their donations are secure?</h3>
              <p>
                We use industry-standard encryption and security measures to
                protect all transactions. We also verify campaign creators and
                provide updates to donors.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I donate anonymously?</h3>
              <p>
                Yes! During the donation process, you'll have the option to hide
                your name and donation amount from public view.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <h2>Our Amazing Superheroes Behind the Scenes</h2>
        <p>
          We are a committed team dedicated to making community funding
          accessible to everyone.
        </p>
      </section>

      <section className="contact-section">
        <div className="contact-card">
          <h3>Do you have any questions?</h3>
          <p>Feel free to reach out to us</p>
          <Button className="contact-button">Contact Us</Button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">Community Funding</Link>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/campaigns">Campaigns</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Community Funding. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
