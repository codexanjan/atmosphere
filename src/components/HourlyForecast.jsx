import React, { useRef } from 'react';
import { Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherUtils';

export const HourlyForecast = ({ hourly = [], unit }) => {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="hourly-forecast-section" aria-label="Hourly Forecast">
      <div className="section-header-with-actions">
        <h2 className="section-title">Hourly Forecast (24 Hours)</h2>
        <div className="scroll-controls">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="scroll-btn"
            title="Scroll left"
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="scroll-btn"
            title="Scroll right"
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="hourly-track" ref={scrollRef} tabIndex="0" role="region" aria-label="Hourly forecast cards">
        {hourly.map((item, idx) => {
          const isCurrent = item.isCurrentHour || idx === 0;

          return (
            <div
              key={item.time || idx}
              className={`hourly-card glass-card ${isCurrent ? 'current-hour' : ''}`}
            >
              <span className="hourly-time">{item.timeDisplay}</span>

              <div className="hourly-icon-wrap">
                <WeatherIcon name={item.iconType} size={28} />
              </div>

              <span className="hourly-temp">{formatTemp(item.tempC, unit)}</span>

              <div className={`hourly-rain-prob ${item.rainProb > 0 ? 'has-rain' : ''}`}>
                <Droplets size={12} className="rain-drop-icon" />
                <span>{item.rainProb}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
