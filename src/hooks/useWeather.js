import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getWeatherByCity,
  getWeatherByCoordinates,
  detectUserIPLocation,
} from '../services/weatherApi';
import {
  getStoredFavorites,
  saveStoredFavorites,
  getStoredRecentSearches,
  addRecentSearchItem,
  removeRecentSearchItem,
  clearAllRecentSearches,
  getStoredUnit,
  saveStoredUnit,
  getStoredTheme,
  saveStoredTheme,
} from '../utils/storage';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // User preferences
  const [unit, setUnitState] = useState(() => getStoredUnit());
  const [theme, setThemeState] = useState(() => getStoredTheme());
  const [favorites, setFavorites] = useState(() => getStoredFavorites());
  const [recentSearches, setRecentSearches] = useState(() => getStoredRecentSearches());

  // Keep track of last fetched target
  const lastQueryRef = useRef({ type: 'city', value: 'Udupi' });

  // Update unit
  const setUnit = useCallback((newUnit) => {
    setUnitState(newUnit);
    saveStoredUnit(newUnit);
  }, []);

  // Update theme
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    saveStoredTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  // Toggle theme (cycles between dark -> aurora -> light)
  const toggleTheme = useCallback(() => {
    const themeCycle = {
      dark: 'aurora',
      aurora: 'light',
      light: 'dark',
    };
    const next = themeCycle[theme] || 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  // Toggle unit
  const toggleUnit = useCallback(() => {
    const next = unit === 'C' ? 'F' : 'C';
    setUnit(next);
  }, [unit, setUnit]);

  // Set initial theme in document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch weather by city name
  const fetchWeather = useCallback(async (cityName, saveToHistory = true) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(cityName);
      setWeatherData(data);
      lastQueryRef.current = { type: 'city', value: cityName };

      if (saveToHistory && data.location?.name) {
        const historyItem = {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          query: cityName,
        };
        const updated = addRecentSearchItem(historyItem);
        if (updated) setRecentSearches(updated);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      let msg = err.message || 'Unable to load weather data. Please try again.';
      if (!navigator.onLine) {
        msg = 'Check your internet connection and try again.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weather by GPS coordinates with accuracy
  const fetchWeatherByCoords = useCallback(async (lat, lon, accuracy = null) => {
    setLoading(true);
    setError(null);
    setIsLocating(true);

    try {
      const data = await getWeatherByCoordinates(lat, lon, accuracy);
      setWeatherData(data);
      lastQueryRef.current = { type: 'coords', lat, lon, accuracy };

      if (data.location?.name) {
        const historyItem = {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          query: `${lat}, ${lon}`,
        };
        const updated = addRecentSearchItem(historyItem);
        if (updated) setRecentSearches(updated);
      }
    } catch (err) {
      console.error('Coordinate weather fetch error:', err);
      setError(err.message || 'Unable to load weather for your location.');
    } finally {
      setLoading(false);
      setIsLocating(false);
    }
  }, []);

  // Trigger GPS Geolocation with high accuracy
  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        fetchWeatherByCoords(latitude, longitude, Math.round(accuracy));
      },
      (geoError) => {
        setIsLocating(false);
        let message = 'Location access was denied. Search for a city instead.';
        if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          message = 'Location information is unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          message = 'Location request timed out. Please search manually.';
        }
        setError(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }, [fetchWeatherByCoords]);

  // Refresh current data
  const refreshWeather = useCallback(() => {
    if (lastQueryRef.current.type === 'coords') {
      fetchWeatherByCoords(lastQueryRef.current.lat, lastQueryRef.current.lon, lastQueryRef.current.accuracy);
    } else {
      fetchWeather(lastQueryRef.current.value || 'Udupi', false);
    }
  }, [fetchWeather, fetchWeatherByCoords]);

  // Favorites management
  const isCurrentFavorite = Boolean(
    weatherData?.location?.name &&
      favorites.some(
        (f) =>
          f.name.toLowerCase() === weatherData.location.name.toLowerCase() ||
          (f.query && f.query.toLowerCase() === weatherData.location.name.toLowerCase())
      )
  );

  const toggleFavorite = useCallback(() => {
    if (!weatherData?.location?.name) return;

    const cityName = weatherData.location.name;
    const exists = favorites.some((f) => f.name.toLowerCase() === cityName.toLowerCase());

    let updated;
    if (exists) {
      updated = favorites.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase());
    } else {
      const newFav = {
        name: cityName,
        country: weatherData.location.country,
        region: weatherData.location.region,
        tempC: weatherData.current.tempC,
        tempF: weatherData.current.tempF,
        conditionText: weatherData.current.conditionText,
        iconType: weatherData.current.iconType,
        query: `${cityName}, ${weatherData.location.country}`,
      };
      updated = [newFav, ...favorites];
    }

    setFavorites(updated);
    saveStoredFavorites(updated);
  }, [weatherData, favorites]);

  const removeFavorite = useCallback((name) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.name.toLowerCase() !== name.toLowerCase());
      saveStoredFavorites(updated);
      return updated;
    });
  }, []);

  // Recent searches removal
  const handleRemoveRecentSearch = useCallback((name) => {
    const updated = removeRecentSearchItem(name);
    setRecentSearches(updated);
  }, []);

  const handleClearAllRecents = useCallback(() => {
    clearAllRecentSearches();
    setRecentSearches([]);
  }, []);

  // Initial load: High-precision Geolocation -> IP Location detection -> Fallback
  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
      // 1. Try High-accuracy GPS first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (isMounted) {
              const { latitude, longitude, accuracy } = pos.coords;
              fetchWeatherByCoords(latitude, longitude, Math.round(accuracy));
            }
          },
          async () => {
            // 2. If GPS permission denied or prompt pending, detect via user IP
            if (!isMounted) return;
            try {
              const ipLoc = await detectUserIPLocation();
              if (isMounted && ipLoc && ipLoc.lat && ipLoc.lon) {
                fetchWeatherByCoords(ipLoc.lat, ipLoc.lon);
                return;
              }
            } catch (err) {
              console.warn('IP fallback error', err);
            }

            // 3. Fallback to saved favorite / recent or Udupi
            if (isMounted) {
              const fallbackCity = favorites[0]?.name || recentSearches[0]?.name || 'Udupi';
              fetchWeather(fallbackCity);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          }
        );
      } else {
        // No geolocation support in browser, detect via IP
        try {
          const ipLoc = await detectUserIPLocation();
          if (isMounted && ipLoc && ipLoc.lat && ipLoc.lon) {
            fetchWeatherByCoords(ipLoc.lat, ipLoc.lon);
            return;
          }
        } catch (err) {
          console.warn('IP fallback error', err);
        }

        if (isMounted) {
          const fallbackCity = favorites[0]?.name || recentSearches[0]?.name || 'Udupi';
          fetchWeather(fallbackCity);
        }
      }
    };

    initializeLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
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
    fetchWeatherByCoords,
    requestCurrentLocation,
    refreshWeather,
    toggleFavorite,
    removeFavorite,
    removeRecentSearch: handleRemoveRecentSearch,
    clearAllRecentSearches: handleClearAllRecents,
    clearError: () => setError(null),
  };
};
