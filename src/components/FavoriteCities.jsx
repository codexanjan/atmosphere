import React from 'react';
import { Heart, Trash2, X, Plus, MapPin } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherUtils';

export const FavoriteCities = ({
  favorites = [],
  isOpen,
  onClose,
  onSelectCity,
  onRemoveFavorite,
  currentCityName,
  isCurrentFavorite,
  onToggleFavorite,
  unit,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="favorites-drawer-overlay" onClick={onClose} role="dialog" aria-label="Favorite Locations">
      <div className="favorites-drawer glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Heart size={20} className="text-rose" fill="currentColor" />
            <h3 className="drawer-title">Favorite Locations</h3>
            <span className="favorites-count-tag">{favorites.length}</span>
          </div>

          <button
            type="button"
            className="drawer-close-btn icon-btn"
            onClick={onClose}
            aria-label="Close favorites drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action to add/remove current active location */}
        {currentCityName && (
          <div className="drawer-current-action">
            <button
              type="button"
              className={`current-fav-toggle-btn ${isCurrentFavorite ? 'is-favorited' : ''}`}
              onClick={onToggleFavorite}
            >
              {isCurrentFavorite ? (
                <>
                  <Heart size={16} fill="currentColor" className="text-rose" />
                  <span>Saved: {currentCityName}</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Add {currentCityName} to Favorites</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="favorites-list">
          {favorites.length === 0 ? (
            <div className="favorites-empty-state">
              <Heart size={42} className="empty-fav-icon" />
              <p className="empty-title">No favorite locations yet</p>
              <p className="empty-subtitle">
                Click the heart icon on any city to bookmark it for rapid access.
              </p>
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.name}
                className="favorite-city-card glass-card"
                onClick={() => {
                  onSelectCity(fav.query || fav.name);
                  onClose();
                }}
              >
                <div className="fav-card-left">
                  <div className="fav-city-title">
                    <MapPin size={16} className="fav-pin" />
                    <span className="fav-name">{fav.name}</span>
                  </div>
                  <span className="fav-country">{fav.country || fav.region}</span>
                  {fav.conditionText && (
                    <span className="fav-condition">{fav.conditionText}</span>
                  )}
                </div>

                <div className="fav-card-right">
                  <div className="fav-weather-preview">
                    {fav.iconType && <WeatherIcon name={fav.iconType} size={24} />}
                    {fav.tempC !== undefined && (
                      <span className="fav-temp">{formatTemp(fav.tempC, unit)}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="fav-delete-btn"
                    title={`Remove ${fav.name} from favorites`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(fav.name);
                    }}
                    aria-label={`Remove ${fav.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default FavoriteCities;
