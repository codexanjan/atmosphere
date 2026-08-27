import React from 'react';
import { Wind, Activity, Info } from 'lucide-react';

export const AirQuality = ({ airQuality }) => {
  if (!airQuality || airQuality.aqi === null || airQuality.aqi === undefined) {
    return null; // Graceful hide if not available
  }

  const {
    aqi,
    category,
    color,
    description,
    pm25,
    pm10,
    no2,
    o3,
    co,
    so2,
  } = airQuality;

  const pollutants = [
    { name: 'PM2.5', value: pm25, unit: 'µg/m³', desc: 'Fine particulate' },
    { name: 'PM10', value: pm10, unit: 'µg/m³', desc: 'Coarse particulate' },
    { name: 'O₃', value: o3, unit: 'µg/m³', desc: 'Ground ozone' },
    { name: 'NO₂', value: no2, unit: 'µg/m³', desc: 'Nitrogen dioxide' },
    { name: 'SO₂', value: so2, unit: 'µg/m³', desc: 'Sulfur dioxide' },
    { name: 'CO', value: co, unit: 'µg/m³', desc: 'Carbon monoxide' },
  ].filter((p) => p.value !== null && p.value !== undefined);

  return (
    <div className="aqi-card glass-card" aria-label="Air Quality Index">
      <div className="aqi-header">
        <div className="aqi-title-wrap">
          <Activity size={18} className="aqi-header-icon" />
          <h3 className="section-subtitle">Air Quality Index (AQI)</h3>
        </div>
        <span className="aqi-badge" style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}>
          {category}
        </span>
      </div>

      <div className="aqi-score-section">
        <div className="aqi-score-circle" style={{ borderColor: color }}>
          <span className="aqi-score-number" style={{ color }}>{aqi}</span>
          <span className="aqi-score-label">US AQI</span>
        </div>

        <div className="aqi-summary-text">
          <h4 className="aqi-status-heading">{category} Quality</h4>
          <p className="aqi-desc">{description}</p>
        </div>
      </div>

      {pollutants.length > 0 && (
        <div className="pollutants-grid">
          {pollutants.map((item) => (
            <div key={item.name} className="pollutant-item">
              <span className="pollutant-name">{item.name}</span>
              <span className="pollutant-value">{item.value} <small>{item.unit}</small></span>
              <span className="pollutant-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirQuality;
