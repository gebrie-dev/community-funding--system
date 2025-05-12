// src/components/CategorySection.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./CategorySection.css";

const categories = [
  {
    id: 1,
    name: "Education",
    description:
      "Support educational initiatives and help students achieve their academic goals.",
    icon: "/icons/education.svg",
  },
  {
    id: 2,
    name: "Healthcare",
    description:
      "Contribute to medical research and healthcare access for those in need.",
    icon: "/icons/healthcare.svg",
  },
  {
    id: 3,
    name: "Environment",
    description:
      "Support environmental conservation and sustainable development projects.",
    icon: "/icons/environment.svg",
  },
  {
    id: 4,
    name: "Technology",
    description:
      "Fund innovative tech projects and digital solutions for social impact.",
    icon: "/icons/technology.svg",
  },
];

const CategorySection = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className={`category-section ${isDarkMode ? "dark" : ""}`}>
      <div className="category-container">
        <h2 className="category-heading">Explore Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className="category-card"
            >
              <div className="category-icon">
                <img src={category.icon} alt={category.name} />
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
