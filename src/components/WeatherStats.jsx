import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Cloud,
  Thermometer,
  CloudRain,
  Compass,
} from 'lucide-react';
import {
  formatWind,
  formatVisibility,
  formatPressure,
  formatPrecipitation,
  formatTemp,
} from '../utils/weatherUtils';

export const WeatherStats = ({ weatherData, unit }) => {
  if (!weatherData || !weatherData.current) return null;

  const { current } = weatherData;

  // Visibility quality descriptor
  const getVisibilityNote = (km) => {
    if (km >= 10) return 'Perfect clear visibility';
    if (km >= 6) return 'Good standard visibility';
    if (km >= 3) return 'Moderate haze';
    return 'Low visibility / Fog';
  };

  // Pressure descriptor
  const getPressureNote = (mb) => {
    if (mb > 1020) return 'High pressure (Fair)';
    if (mb < 1005) return 'Low pressure (Stormy)';
    return 'Normal atmospheric pressure';
  };

  // Cloud cover descriptor
  const getCloudNote = (pct) => {
    if (pct <= 10) return 'Clear skies';
    if (pct <= 40) return 'Partly cloudy';
    if (pct <= 75) return 'Mostly cloudy';
    return 'Overcast skies';
  };

  return (
    <section className="weather-stats-section" aria-label="Detailed Weather Statistics">
      <h2 className="section-title">Weather Conditions</h2>

      <div className="stats-grid">
        {/* Humidity Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-humidity">
              <Droplets size={18} />
            </div>
            <span className="stat-label">Humidity</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{current.humidity}%</span>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill fill-humidity" style={{ width: `${current.humidity}%` }}></div>
            </div>
          </div>
          <span className="stat-subtext">The dew point is {formatTemp(current.dewPointC, unit)}</span>
        </div>

        {/* Wind Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-wind">
              <Wind size={18} />
            </div>
            <span className="stat-label">Wind</span>
          </div>
          <div className="stat-body">
            <div className="wind-val-wrapper">
              <span className="stat-value">{formatWind(current.windKph, unit)}</span>
              <span className="wind-direction-badge">
                <Compass size={14} style={{ transform: `rotate(${current.windDegree}deg)` }} />
                {current.windDir}
              </span>
            </div>
          </div>
          <span className="stat-subtext">Direction {current.windDegree}° • {current.windDir}</span>
        </div>

        {/* UV Index Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-uv">
              <Sun size={18} />
            </div>
            <span className="stat-label">UV Index</span>
          </div>
          <div className="stat-body">
            <div className="uv-val-wrapper">
              <span className="stat-value">{current.uvIndex}</span>
              <span
                className="uv-badge"
                style={{
                  backgroundColor: `${current.uvCategory?.color}20`,
                  color: current.uvCategory?.color || '#10b981',
                  borderColor: `${current.uvCategory?.color}40`,
                }}
              >
                {current.uvCategory?.label || 'Low'}
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, (current.uvIndex / 11) * 100)}%`,
                  backgroundColor: current.uvCategory?.color || '#10b981',
                }}
              ></div>
            </div>
          </div>
          <span className="stat-subtext">{current.uvCategory?.advice || 'No protection required'}</span>
        </div>

        {/* Visibility Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-visibility">
              <Eye size={18} />
            </div>
            <span className="stat-label">Visibility</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{formatVisibility(current.visibilityKm, unit)}</span>
          </div>
          <span className="stat-subtext">{getVisibilityNote(current.visibilityKm)}</span>
        </div>

        {/* Pressure Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-pressure">
              <Gauge size={18} />
            </div>
            <span className="stat-label">Pressure</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{formatPressure(current.pressureMb, unit)}</span>
          </div>
          <span className="stat-subtext">{getPressureNote(current.pressureMb)}</span>
        </div>

        {/* Cloud Cover Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-cloud">
              <Cloud size={18} />
            </div>
            <span className="stat-label">Cloud Cover</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{current.cloudCover}%</span>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill fill-cloud" style={{ width: `${current.cloudCover}%` }}></div>
            </div>
          </div>
          <span className="stat-subtext">{getCloudNote(current.cloudCover)}</span>
        </div>

        {/* Dew Point Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-dew">
              <Thermometer size={18} />
            </div>
            <span className="stat-label">Dew Point</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{formatTemp(current.dewPointC, unit)}</span>
          </div>
          <span className="stat-subtext">Moisture condensation temperature</span>
        </div>

        {/* Precipitation Card */}
        <div className="stat-card glass-card">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-precip">
              <CloudRain size={18} />
            </div>
            <span className="stat-label">Precipitation</span>
          </div>
          <div className="stat-body">
            <span className="stat-value">{formatPrecipitation(current.precipMm, unit)}</span>
          </div>
          <span className="stat-subtext">
            {current.precipMm > 0 ? 'Precipitation observed today' : 'No rain observed in last hr'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default WeatherStats;
