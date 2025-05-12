// src/context/ThemeContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check user preference
    const savedTheme = localStorage.getItem("communityFundingTheme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else if (prefersDark) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }

    // Save preference
    localStorage.setItem("communityFundingTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const setTheme = (theme) => {
    setDarkMode(theme === "dark");
  };

  const value = {
    darkMode,
    toggleDarkMode,
    setTheme,
    theme: darkMode ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
