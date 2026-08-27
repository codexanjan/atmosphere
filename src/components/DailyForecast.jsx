import React from 'react';
import { Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherUtils';

export const DailyForecast = ({ daily = [], unit }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate week min and max for range bar proportion
  const allMinTemps = daily.map((d) => d.minTempC);
  const allMaxTemps = daily.map((d) => d.maxTempC);
  const overallMin = Math.min(...allMinTemps);
  const overallMax = Math.max(...allMaxTemps);
  const tempRange = Math.max(1, overallMax - overallMin);

  return (
    <section className="daily-forecast-section" aria-label="7-Day Weather Forecast">
      <h2 className="section-title">7-Day Forecast</h2>

      <div className="daily-list">
        {daily.map((day, idx) => {
          // Calculate bar percentage offsets
          const leftPercent = Math.max(0, ((day.minTempC - overallMin) / tempRange) * 100);
          const rightPercent = Math.max(0, ((overallMax - day.maxTempC) / tempRange) * 100);

          return (
            <div key={day.date || idx} className="daily-card glass-card">
              {/* Day & Date */}
              <div className="daily-day-info">
                <span className="daily-name">{day.dayName}</span>
                <span className="daily-date">{day.formattedDate}</span>
              </div>

              {/* Weather Condition */}
              <div className="daily-condition-wrap">
                <WeatherIcon name={day.iconType} size={24} className="daily-weather-icon" />
                <span className="daily-condition-text">{day.conditionText}</span>
              </div>

              {/* Rain Probability */}
              <div className="daily-rain-chance">
                {day.rainProb > 0 ? (
                  <span className="rain-badge">
                    <Droplets size={13} />
                    {day.rainProb}%
                  </span>
                ) : (
                  <span className="rain-badge text-muted">0%</span>
                )}
              </div>

              {/* Temperature Range Bar */}
              <div className="daily-temp-bar-container">
                <span className="temp-val min-val">{formatTemp(day.minTempC, unit)}</span>

                <div className="range-bar-track">
                  <div
                    className="range-bar-segment"
                    style={{
                      left: `${leftPercent}%`,
                      right: `${rightPercent}%`,
                    }}
                  ></div>
                </div>

                <span className="temp-val max-val">{formatTemp(day.maxTempC, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DailyForecast;
