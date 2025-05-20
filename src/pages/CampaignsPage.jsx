// src/pages/CampaignsPage.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CampaignCard from "../components/CampaignCard";
import SearchBar from "../components/SearchBar";
import { Filter } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./CampaignsPage.css";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { darkMode } = useTheme();

  const categories = [
    { id: "all", name: "All Campaigns" },
    { id: "medical", name: "Medical" },
    { id: "social-impact", name: "Social Impact" },
    { id: "emergency", name: "Emergency" },
    { id: "education", name: "Education" },
  ];

  useEffect(() => {
    // Mock data for campaigns
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
        image: "/images/medical-treatment.png",
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

    setCampaigns(mockCampaigns);
    setFilteredCampaigns(mockCampaigns);
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
          campaign.title.toLowerCase().includes(term.toLowerCase()) ||
          campaign.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.category.toLowerCase() === category.toLowerCase()
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

        {filteredCampaigns.length === 0 ? (
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
          <div className="campaigns-grid">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
