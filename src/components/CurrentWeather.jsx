import React, { useState } from 'react';
import {
  Heart,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin,
  Compass,
  Mountain,
  Navigation,
  Check,
  Globe,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp, formatLocationDate, formatLocationTime } from '../utils/weatherUtils';

export const CurrentWeather = ({
  weatherData,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);

  if (!weatherData || !weatherData.current) return null;

  const { location, current } = weatherData;

  const formattedDate = formatLocationDate(location.localTime || new Date());
  const formattedTime = formatLocationTime(location.localTime || new Date());

  const handleCopyCoords = (e) => {
    e.stopPropagation();
    if (location.lat && location.lon) {
      navigator.clipboard.writeText(`${location.lat}, ${location.lon}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="current-weather-hero glass-card" aria-label="Current Weather">
      <div className="hero-top">
        <div className="location-info">
          {/* GPS Live Precision Badge */}
          {location.isGPS && (
            <div className="gps-live-tag">
              <Navigation size={12} className="gps-pulse-icon" />
              <span>Precise GPS Location</span>
              {location.accuracy && <small>• ±{location.accuracy}m</small>}
            </div>
          )}

          <div className="city-title-wrapper">
            <MapPin size={24} className="location-pin-icon" />
            <h1 className="city-name" id="current-city-name">
              {location.name}
            </h1>
            <button
              type="button"
              id="favorite-toggle-btn"
              onClick={onToggleFavorite}
              className={`favorite-action-btn ${isFavorite ? 'is-fav' : ''}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart
                size={22}
                className={`fav-icon ${isFavorite ? 'fill-rose text-rose' : ''}`}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Full Precise Address */}
          <p className="country-name" title={location.fullAddress}>
            {location.fullAddress || [location.region, location.country].filter(Boolean).join(', ')}
          </p>

          {/* Coordinates & Elevation Chips */}
          <div className="geo-precision-chips">
            {location.coordinatesFormatted && (
              <button
                type="button"
                className="coord-chip"
                onClick={handleCopyCoords}
                title="Click to copy exact coordinates"
              >
                {copied ? <Check size={12} className="text-emerald" /> : <Compass size={12} />}
                <span>{location.coordinatesFormatted}</span>
                {copied && <span className="copied-text">Copied!</span>}
              </button>
            )}

            {location.elevation !== null && location.elevation !== undefined && (
              <span className="elevation-chip" title="Elevation above sea level">
                <Mountain size={12} />
                <span>{location.elevation} m alt</span>
              </span>
            )}
          </div>

          <div className="time-badge">
            <Clock size={14} />
            <span>{formattedTime}</span>
            <span className="dot-separator">•</span>
            <span>{formattedDate}</span>
            {location.timezoneFormatted && (
              <>
                <span className="dot-separator">•</span>
                <span className="tz-label">{location.timezoneFormatted}</span>
              </>
            )}
          </div>
        </div>

        <div className="condition-visual">
          <div className="hero-icon-container">
            <WeatherIcon name={current.iconType} size={88} className="hero-weather-icon" />
          </div>
          <span className="condition-badge">{current.conditionText}</span>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="temperature-section">
          <div className="main-temp-wrapper">
            <span className="main-temp" id="current-temp-value">
              {formatTemp(current.tempC, unit, false)}
            </span>
            <span className="main-unit">°{unit}</span>
          </div>

          <div className="temp-details">
            <p className="feels-like">
              Feels like <span className="highlight-temp">{formatTemp(current.feelsLikeC, unit)}</span>
            </p>
            <div className="hi-low-temps">
              <span className="temp-hi" title="High temperature">
                <ArrowUp size={14} className="hi-icon" />
                H {formatTemp(current.tempMaxC, unit)}
              </span>
              <span className="temp-low" title="Low temperature">
                <ArrowDown size={14} className="low-icon" />
                L {formatTemp(current.tempMinC, unit)}
              </span>
            </div>
          </div>
        </div>

        <div className="hero-atmosphere-pill">
          <div className="pill-item">
            <span className="pill-label">Humidity</span>
            <span className="pill-value">{current.humidity}%</span>
          </div>
          <div className="pill-divider"></div>
          <div className="pill-item">
            <span className="pill-label">Wind</span>
            <span className="pill-value">{unit === 'F' ? `${current.windMph} mph` : `${current.windKph} km/h`} {current.windDir}</span>
          </div>
          <div className="pill-divider"></div>
          <div className="pill-item">
            <span className="pill-label">UV Index</span>
            <span className="pill-value" style={{ color: current.uvCategory?.color || 'inherit' }}>
              {current.uvIndex} ({current.uvCategory?.label || 'Low'})
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;
