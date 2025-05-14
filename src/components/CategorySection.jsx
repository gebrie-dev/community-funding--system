import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./CategorySection.css";

const categories = [
  {
    id: 1,
    name: "Education",
    description:
      "Support educational initiatives and help students achieve their academic goals.",
    icon: "/images/categories/education-icon.png",
  },
  {
    id: 2,
    name: "Healthcare",
    description:
      "Contribute to medical research and healthcare access for those in need.",
    icon: "/images/categories/medical-icon.png",
  },
  {
    id: 3,
    name: "Social Impact",
    description:
      "Support environmental conservation and sustainable development projects.",
    icon: "/images/categories/social-impact-icon.png",
  },
  {
    id: 4,
    name: "Emergency",
    description:
      "Fund innovative tech projects and digital solutions for social impact.",
    icon: "/images/categories/emergency-icon.png",
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
                <img
                  src={category.icon}
                  alt={`Icon for ${category.name} category`}
                />
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
