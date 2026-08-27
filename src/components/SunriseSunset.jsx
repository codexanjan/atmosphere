import React from 'react';
import { Sunrise, Sunset, Sun, Moon, Clock, Sparkles } from 'lucide-react';

export const SunriseSunset = ({ astro }) => {
  if (!astro) return null;

  const {
    sunrise,
    sunset,
    dayLength,
    sunProgressPercent = 50,
    moonPhaseName = 'Waxing Crescent',
    moonIllumination = 45,
  } = astro;

  // Calculate arc point coordinates for the sun icon
  const angleRad = (Math.PI * (100 - sunProgressPercent)) / 100;
  const radius = 80;
  const centerX = 100;
  const centerY = 90;
  const sunX = centerX + radius * Math.cos(angleRad);
  const sunY = centerY - radius * Math.sin(angleRad);

  const isNight = sunProgressPercent <= 0 || sunProgressPercent >= 100;

  return (
    <div className="sun-card glass-card" aria-label="Sunrise, Sunset and Moon Phases">
      <div className="sun-card-header">
        <h3 className="section-subtitle">Celestial Cycles</h3>
        {dayLength && (
          <span className="daylength-badge">
            <Clock size={13} />
            Daylight: {dayLength}
          </span>
        )}
      </div>

      <div className="sun-arc-visual">
        <svg viewBox="0 0 200 110" className="sun-arc-svg">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Dotted full trajectory path */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Solid illuminated path up to current progress */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="3.5"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * sunProgressPercent) / 100}
          />

          {/* Horizon line */}
          <line x1="10" y1="90" x2="190" y2="90" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />

          {/* Animated Sun Position */}
          <g transform={`translate(${sunX}, ${sunY})`}>
            <circle r="8" fill="#f59e0b" filter="drop-shadow(0px 0px 8px #f59e0b)" />
            <circle r="4" fill="#fff" />
          </g>
        </svg>

        <div className="sun-progress-label">
          <span>{isNight ? 'Sun is below the horizon' : `${sunProgressPercent}% through solar daylight`}</span>
        </div>
      </div>

      <div className="sun-times-grid">
        <div className="sun-time-item">
          <div className="sun-icon-wrap sunrise-icon">
            <Sunrise size={20} />
          </div>
          <div className="sun-time-details">
            <span className="sun-time-label">Sunrise</span>
            <span className="sun-time-value">{sunrise || '06:00 AM'}</span>
          </div>
        </div>

        <div className="sun-time-item">
          <div className="sun-icon-wrap sunset-icon">
            <Sunset size={20} />
          </div>
          <div className="sun-time-details">
            <span className="sun-time-label">Sunset</span>
            <span className="sun-time-value">{sunset || '06:30 PM'}</span>
          </div>
        </div>
      </div>

      {/* Lunar Cycle Card Breakdown */}
      <div className="lunar-cycle-row">
        <div className="lunar-icon-wrap">
          <Moon size={18} className="moon-cycle-icon" />
        </div>
        <div className="lunar-details">
          <span className="lunar-phase-name">{moonPhaseName}</span>
          <span className="lunar-illumination">{moonIllumination}% Illumination</span>
        </div>
        <span className="lunar-astronomy-badge">
          <Sparkles size={12} />
          Lunar Phase
        </span>
      </div>
    </div>
  );
};

export default SunriseSunset;
