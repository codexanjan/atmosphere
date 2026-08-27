// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'weather_app_favorites_v1',
  RECENT_SEARCHES: 'weather_app_recent_searches_v1',
  UNIT: 'weather_app_unit_v1',
  THEME: 'weather_app_theme_v1',
  CUSTOM_API_KEY: 'weather_app_api_key_v1',
};

// Safe JSON parser
const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Favorites
export const getStoredFavorites = () => {
  return safeParse(localStorage.getItem(STORAGE_KEYS.FAVORITES), []);
};

export const saveStoredFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
};

export const isCityInFavorites = (cityName, favorites = getStoredFavorites()) => {
  if (!cityName) return false;
  const target = cityName.toLowerCase().trim();
  return favorites.some(
    (f) => f.name.toLowerCase().trim() === target || (f.query && f.query.toLowerCase().trim() === target)
  );
};

// Recent searches
export const getStoredRecentSearches = () => {
  return safeParse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES), [
    { name: 'Udupi', country: 'India', query: 'Udupi' },
    { name: 'Bengaluru', country: 'India', query: 'Bengaluru' },
    { name: 'Mumbai', country: 'India', query: 'Mumbai' },
    { name: 'London', country: 'United Kingdom', query: 'London' },
  ]);
};

export const saveStoredRecentSearches = (searches) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches.slice(0, 10)));
  } catch (e) {
    console.error('Failed to save recent searches to localStorage', e);
  }
};

export const addRecentSearchItem = (item) => {
  if (!item || !item.name) return;
  const existing = getStoredRecentSearches();
  const filtered = existing.filter(
    (s) => s.name.toLowerCase().trim() !== item.name.toLowerCase().trim()
  );
  const updated = [item, ...filtered].slice(0, 10);
  saveStoredRecentSearches(updated);
  return updated;
};

export const removeRecentSearchItem = (name) => {
  const existing = getStoredRecentSearches();
  const updated = existing.filter((s) => s.name.toLowerCase().trim() !== name.toLowerCase().trim());
  saveStoredRecentSearches(updated);
  return updated;
};

export const clearAllRecentSearches = () => {
  saveStoredRecentSearches([]);
  return [];
};

// Unit preference (°C vs °F)
export const getStoredUnit = () => {
  return localStorage.getItem(STORAGE_KEYS.UNIT) || 'C';
};

export const saveStoredUnit = (unit) => {
  try {
    localStorage.setItem(STORAGE_KEYS.UNIT, unit);
  } catch (e) {
    console.error('Failed to save unit to localStorage', e);
  }
};

// Theme preference (dark vs light vs system)
export const getStoredTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved) return saved;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

export const saveStoredTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme to localStorage', e);
  }
};
