import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Loading weather information">
      {/* Hero Card Skeleton */}
      <div className="skeleton-hero glass-card shimmer-fx">
        <div className="skeleton-row">
          <div className="skeleton-box skeleton-title"></div>
          <div className="skeleton-circle skeleton-hero-icon"></div>
        </div>
        <div className="skeleton-box skeleton-subtitle"></div>
        <div className="skeleton-box skeleton-temp-big"></div>
        <div className="skeleton-box skeleton-pills"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="skeleton-section-title skeleton-box"></div>
      <div className="skeleton-stats-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-stat-card glass-card shimmer-fx">
            <div className="skeleton-box skeleton-stat-icon"></div>
            <div className="skeleton-box skeleton-stat-val"></div>
            <div className="skeleton-box skeleton-stat-sub"></div>
          </div>
        ))}
      </div>

      {/* Hourly Skeleton */}
      <div className="skeleton-section-title skeleton-box"></div>
      <div className="skeleton-hourly-track">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-hourly-card glass-card shimmer-fx">
            <div className="skeleton-box skeleton-hour-time"></div>
            <div className="skeleton-circle skeleton-hour-icon"></div>
            <div className="skeleton-box skeleton-hour-temp"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="skeleton-charts-grid">
        <div className="skeleton-chart-card glass-card shimmer-fx"></div>
        <div className="skeleton-chart-card glass-card shimmer-fx"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
