import React, { useState } from 'react';
import { CloudSun, RotateCw, Heart, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';
import LocationButton from './LocationButton';
import ThemeToggle from './ThemeToggle';
import UnitToggle from './UnitToggle';

export const Header = ({
  onSearch,
  onLocationClick,
  isLocating,
  unit,
  toggleUnit,
  setUnit,
  theme,
  toggleTheme,
  onRefresh,
  favoritesCount = 0,
  onToggleFavorites,
  isFavoritesOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="app-header">
      <div className="header-top-bar">
        {/* Brand Logo */}
        <div className="brand-container" onClick={onLocationClick} style={{ cursor: 'pointer' }} title="Click to detect current location">
          <div className="brand-icon-wrapper">
            <CloudSun className="brand-logo-icon" size={26} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Atmosphere</span>
            <span className="brand-subtitle">Live Weather</span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="desktop-search-wrapper">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          <LocationButton onClick={onLocationClick} isLocating={isLocating} />

          <button
            type="button"
            id="refresh-weather-btn"
            onClick={handleRefreshClick}
            className="icon-btn refresh-btn"
            title="Refresh weather"
            aria-label="Refresh weather data"
          >
            <RotateCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            id="favorites-toggle-btn"
            onClick={onToggleFavorites}
            className={`icon-btn favorites-btn ${isFavoritesOpen ? 'active' : ''}`}
            title="Favorite locations"
            aria-label="Toggle favorite locations"
          >
            <Heart size={18} className={favoritesCount > 0 ? 'text-rose' : ''} />
            {favoritesCount > 0 && <span className="favorites-badge">{favoritesCount}</span>}
          </button>

          <UnitToggle unit={unit} onToggle={toggleUnit} setUnit={setUnit} />

          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar & Controls */}
      <div className={`mobile-search-section ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
        <SearchBar onSearch={(query) => {
          onSearch(query);
          setMobileMenuOpen(false);
        }} />
      </div>
    </header>
  );
};

export default Header;
