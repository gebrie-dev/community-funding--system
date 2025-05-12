// src/components/SearchBar.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category });
  };
  
  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        <option value="all">All Categories</option>
        <option value="disaster">Disaster Relief</option>
        <option value="education">Education</option>
        <option value="medical">Medical</option>
        <option value="community">Community</option>
        <option value="environment">Environment</option>
      </select>
      
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default SearchBar;