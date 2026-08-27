import React from 'react';
import { CloudSun, Search, MapPin } from 'lucide-react';

export const EmptyState = ({ onSelectCity }) => {
  const quickCities = [
    { name: 'Udupi', country: 'India' },
    { name: 'Bengaluru', country: 'India' },
    { name: 'Mumbai', country: 'India' },
    { name: 'London', country: 'UK' },
    { name: 'Tokyo', country: 'Japan' },
  ];

  return (
    <div className="empty-state-container glass-card">
      <div className="empty-visual">
        <CloudSun size={72} className="empty-illustration-icon" />
      </div>

      <h2 className="empty-state-title">Search for a City to View Live Weather</h2>
      <p className="empty-state-subtitle">
        Get real-time temperatures, hourly forecast trajectories, 7-day outlooks, UV index, and air quality metrics.
      </p>

      <div className="quick-suggestions-block">
        <span className="quick-label">Popular Locations:</span>
        <div className="quick-buttons-row">
          {quickCities.map((city) => (
            <button
              key={city.name}
              type="button"
              className="quick-city-btn"
              onClick={() => onSelectCity(city.name)}
            >
              <MapPin size={13} />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
