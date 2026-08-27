import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export const LocationButton = ({ onClick, isLocating }) => {
  return (
    <button
      type="button"
      id="use-my-location-btn"
      onClick={onClick}
      disabled={isLocating}
      className={`location-btn icon-btn ${isLocating ? 'locating' : ''}`}
      title="Use My Location"
      aria-label="Use My GPS Location"
    >
      {isLocating ? (
        <Loader2 size={18} className="animate-spin text-accent" />
      ) : (
        <MapPin size={18} />
      )}
      <span className="location-btn-text">My Location</span>
    </button>
  );
};

export default LocationButton;
