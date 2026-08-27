import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';

import Header from './components/Header';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import RecentSearches from './components/RecentSearches';
import FavoriteCities from './components/FavoriteCities';
import CurrentWeather from './components/CurrentWeather';
import WeatherStats from './components/WeatherStats';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import TemperatureChart from './components/TemperatureChart';
import RainChart from './components/RainChart';
import SunriseSunset from './components/SunriseSunset';
import AirQuality from './components/AirQuality';
import WeatherAlerts from './components/WeatherAlerts';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';

export const App = () => {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const {
    weatherData,
    loading,
    error,
    isLocating,
    unit,
    theme,
    favorites,
    recentSearches,
    isCurrentFavorite,
    setUnit,
    toggleUnit,
    setTheme,
    toggleTheme,
    fetchWeather,
    requestCurrentLocation,
    refreshWeather,
    toggleFavorite,
    removeFavorite,
    removeRecentSearch,
    clearAllRecentSearches,
    clearError,
  } = useWeather();

  // Dynamic atmospheric theme class
  const weatherThemeClass = weatherData?.current?.theme
    ? `weather-theme-${weatherData.current.theme}`
    : 'weather-theme-default';

  return (
    <div className={`app-container ${weatherThemeClass} theme-${theme}`}>
      {/* Background Ambience Layers & Canvas */}
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>
      <AtmosphereCanvas weatherTheme={weatherData?.current?.theme || 'default'} theme={theme} />

      {/* App Header */}
      <Header
        onSearch={(city) => fetchWeather(city)}
        onLocationClick={requestCurrentLocation}
        isLocating={isLocating}
        unit={unit}
        toggleUnit={toggleUnit}
        setUnit={setUnit}
        theme={theme}
        toggleTheme={toggleTheme}
        onRefresh={refreshWeather}
        favoritesCount={favorites.length}
        onToggleFavorites={() => setIsFavoritesOpen(!isFavoritesOpen)}
        isFavoritesOpen={isFavoritesOpen}
      />

      {/* Main Dashboard Layout */}
      <main className="main-content-wrapper">
        {/* Recent Searches Chips */}
        <RecentSearches
          recentSearches={recentSearches}
          onSelectCity={(city) => fetchWeather(city)}
          onRemoveCity={removeRecentSearch}
          onClearAll={clearAllRecentSearches}
        />

        {/* Error Notification */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={refreshWeather}
            onSearchCity={(city) => fetchWeather(city)}
            onDismiss={clearError}
          />
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Loaded Weather Dashboard */}
        {!loading && weatherData && (
          <div className="dashboard-grid">
            {/* Primary Hero Section */}
            <div className="dashboard-hero-col">
              <CurrentWeather
                weatherData={weatherData}
                unit={unit}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={toggleFavorite}
              />

              {/* Weather Alerts if present */}
              <WeatherAlerts alerts={weatherData.alerts} />

              {/* Hourly Forecast */}
              <HourlyForecast hourly={weatherData.hourly} unit={unit} />

              {/* Interactive Charts */}
              <div className="charts-grid-row">
                <TemperatureChart hourly={weatherData.hourly} unit={unit} theme={theme} />
                <RainChart hourly={weatherData.hourly} theme={theme} />
              </div>

              {/* Detailed 8-card Weather Statistics */}
              <WeatherStats weatherData={weatherData} unit={unit} />
            </div>

            {/* Secondary Column: 7-Day Outlook & Environment */}
            <div className="dashboard-side-col">
              {/* 7-Day Forecast */}
              <DailyForecast daily={weatherData.daily} unit={unit} />

              {/* Sunrise & Sunset Arc */}
              <SunriseSunset astro={weatherData.astro} />

              {/* Air Quality Index */}
              <AirQuality airQuality={weatherData.airQuality} />
            </div>
          </div>
        )}

        {/* Empty State fallback */}
        {!loading && !weatherData && !error && (
          <EmptyState onSelectCity={(city) => fetchWeather(city)} />
        )}
      </main>

      {/* Favorite Cities Drawer */}
      <FavoriteCities
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectCity={(city) => fetchWeather(city)}
        onRemoveFavorite={removeFavorite}
        currentCityName={weatherData?.location?.name}
        isCurrentFavorite={isCurrentFavorite}
        onToggleFavorite={toggleFavorite}
        unit={unit}
      />

      {/* Footer */}
      <Footer
        lastUpdated={weatherData?.lastUpdated}
        provider={weatherData?.provider || 'Open-Meteo'}
      />
    </div>
  );
};

export default App;
