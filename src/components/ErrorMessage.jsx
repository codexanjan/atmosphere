import React from 'react';
import { AlertCircle, RotateCcw, X, MapPin } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry, onSearchCity, onDismiss }) => {
  if (!message) return null;

  const popularCities = ['Udupi', 'Bengaluru', 'Mumbai', 'London', 'Tokyo'];

  return (
    <div className="error-card glass-card" role="alert">
      <div className="error-header">
        <div className="error-title-wrap">
          <AlertCircle size={22} className="error-icon" />
          <h3 className="error-heading">Something went wrong</h3>
        </div>
        {onDismiss && (
          <button
            type="button"
            className="error-dismiss-btn"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <p className="error-message-text">{message}</p>

      <div className="error-actions">
        {onRetry && (
          <button type="button" className="error-retry-btn" onClick={onRetry}>
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
        )}

        {onSearchCity && (
          <div className="error-suggestions">
            <span className="suggestions-label">Or explore:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                className="city-suggestion-chip"
                onClick={() => onSearchCity(city)}
              >
                <MapPin size={12} />
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
