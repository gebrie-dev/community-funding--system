// src/pages/CampaignsPage.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CampaignCard from "../components/CampaignCard";
import SearchBar from "../components/SearchBar";
import { Filter } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { api } from "../utils/api"; // Import API utility
import { API_ENDPOINTS } from "../config/api"; // Import API endpoints
import "./CampaignsPage.css";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const categories = [
    { id: "all", name: "All Campaigns" },
    { id: "medical", name: "Medical" },
    { id: "social-impact", name: "Social Impact" },
    { id: "emergency", name: "Emergency" },
    { id: "education", name: "Education" },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching campaigns from:", API_ENDPOINTS.CAMPAIGNS);
        const response = await api.get(API_ENDPOINTS.CAMPAIGNS);
        // Normalize category to lowercase for frontend consistency
        const normalizedCampaigns = response.map((campaign) => ({
          ...campaign,
          category: campaign.category ? campaign.category.toLowerCase() : "",
        }));
        console.log("Fetched campaigns:", normalizedCampaigns);
        setCampaigns(normalizedCampaigns);
        setFilteredCampaigns(normalizedCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterCampaigns(term, activeCategory);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    filterCampaigns(searchTerm, category);
  };

  const filterCampaigns = (term, category) => {
    let filtered = campaigns;

    // Filter by search term
    if (term.trim()) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title?.toLowerCase().includes(term.toLowerCase()) ||
          campaign.description?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.category === category
      );
    }

    setFilteredCampaigns(filtered);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={`campaigns-page ${darkMode ? "dark" : ""}`}>
      <Navbar />
      <div className="campaigns-page-container">
        <div className="campaigns-page-header">
          <h1>All Campaigns</h1>
          <p>Browse and support causes that matter to you</p>
        </div>

        <div className="campaigns-search-filter">
          <SearchBar onSearch={handleSearch} />
          <button className="filter-toggle" onClick={toggleFilter}>
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>

        <div className={`filter-container ${isFilterOpen ? "open" : ""}`}>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-filter ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <h3>Loading campaigns...</h3>
          </div>
        ) : error ? (
          <div className="error">
            <h3>Error</h3>
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="no-campaigns">
            <h3>No campaigns found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button
              className="reset-filters"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
                setFilteredCampaigns(campaigns);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <ol className="campaigns-grid">
            {filteredCampaigns.map((campaign) => (
              <li key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;