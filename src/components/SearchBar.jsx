import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { searchLocations } from '../services/weatherApi';

export const SearchBar = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectLocation(suggestions[activeIndex]);
      return;
    }
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  // Select location from suggestion
  const selectLocation = (loc) => {
    setQuery(loc.name);
    setIsOpen(false);
    onSearch(loc.query || loc.name);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        selectLocation(suggestions[activeIndex]);
      } else {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className={`search-bar-container ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <Search size={18} className="search-icon-prefix" />
        <input
          type="text"
          id="city-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search city, state, country..."
          aria-label="Search for a city or location"
          autoComplete="off"
          className="search-input"
        />

        {isLoading && <Loader2 size={16} className="search-spinner animate-spin" />}

        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            title="Clear search"
            aria-label="Clear search text"
          >
            <X size={16} />
          </button>
        )}

        <button type="submit" id="search-submit-btn" className="search-submit-btn" aria-label="Search">
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-dropdown" role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={item.id || index}
              role="option"
              aria-selected={activeIndex === index}
              className={`suggestion-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => selectLocation(item)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <MapPin size={16} className="suggestion-icon" />
              <div className="suggestion-text">
                <span className="suggestion-name">{item.name}</span>
                {(item.region || item.country) && (
                  <span className="suggestion-details">
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
