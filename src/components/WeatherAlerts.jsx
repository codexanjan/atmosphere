import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';

export const WeatherAlerts = ({ alerts = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const hasAlerts = alerts && alerts.length > 0;

  return (
    <section className="weather-alerts-section" aria-label="Weather Alerts">
      {hasAlerts ? (
        <div className="alerts-container">
          {alerts.map((alert) => {
            const isExpanded = expandedId === alert.id;
            const severityClass = (alert.severity || '').toLowerCase();

            return (
              <div
                key={alert.id}
                className={`alert-card glass-card severity-${severityClass}`}
              >
                <div className="alert-card-header" onClick={() => toggleExpand(alert.id)}>
                  <div className="alert-title-wrap">
                    <AlertTriangle size={20} className="alert-warning-icon" />
                    <div>
                      <h4 className="alert-headline">{alert.title}</h4>
                      <span className="alert-severity-pill">{alert.severity} Alert</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="alert-expand-btn"
                    aria-label={isExpanded ? 'Collapse alert' : 'Expand alert'}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                <div className="alert-meta-row">
                  {alert.area && (
                    <span className="alert-meta-item">
                      <MapPin size={13} /> {alert.area}
                    </span>
                  )}
                  {alert.end && (
                    <span className="alert-meta-item">
                      <Clock size={13} /> Until {alert.end}
                    </span>
                  )}
                </div>

                {isExpanded && alert.description && (
                  <div className="alert-body">
                    <p className="alert-description">{alert.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-alerts-card glass-card">
          <div className="no-alerts-content">
            <ShieldCheck size={20} className="shield-safe-icon" />
            <span className="no-alerts-text">No active weather alerts for this location</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default WeatherAlerts;
