import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./CategorySection.css";

const categories = [
  {
    id: 1,
    name: "Education",
    description:
      "Support educational initiatives and help students achieve their academic goals.",
    image: "/images/categories/education-icon.png",
    path: "/campaigns/education",
  },
  {
    id: 2,
    name: "Healthcare",
    description:
      "Contribute to medical research and healthcare access for those in need.",
    image: "/images/categories/medical-icon.png",
    path: "/campaigns/healthcare",
  },
  {
    id: 3,
    name: "Social Impact",
    description:
      "Support environmental conservation and sustainable development projects.",
    image: "/images/categories/social-impact-icon.png",
    path: "/campaigns/social",
  },
  {
    id: 4,
    name: "Emergency",
    description:
      "Fund innovative tech projects and digital solutions for social impact.",
    image: "/images/categories/emergency-icon.png",
    path: "/campaigns/emergency",
  },
];

const CategorySection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`category-section ${darkMode ? "dark" : ""}`}>
      <div className="category-container">
        <div className="category-header">
          <h2 className={`category-heading ${darkMode ? "dark" : ""}`}>
            Explore Categories
          </h2>
          <p className={`category-subheading ${darkMode ? "dark" : ""}`}>
            Discover and support causes that matter to you
          </p>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={category.path}
              key={category.id}
              className={`category-card ${darkMode ? "dark" : ""}`}
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
              </div>
              <div className="category-content">
                <h3 className={`category-name ${darkMode ? "dark" : ""}`}>
                  {category.name}
                </h3>
                <p className={`category-description ${darkMode ? "dark" : ""}`}>
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
