import React from 'react';
import { History, X, Trash2 } from 'lucide-react';

export const RecentSearches = ({
  recentSearches = [],
  onSelectCity,
  onRemoveCity,
  onClearAll,
}) => {
  if (!recentSearches || recentSearches.length === 0) return null;

  return (
    <div className="recent-searches-bar">
      <div className="recents-header">
        <div className="recents-title">
          <History size={14} />
          <span>Recent Searches</span>
        </div>
        {recentSearches.length > 1 && (
          <button
            type="button"
            className="clear-all-recents-btn"
            onClick={onClearAll}
            title="Clear all recent searches"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="recent-chips-track">
        {recentSearches.map((item) => (
          <div
            key={item.name}
            className="recent-chip glass-card"
            onClick={() => onSelectCity(item.query || item.name)}
            role="button"
            tabIndex="0"
          >
            <span className="recent-chip-label">{item.name}</span>
            <button
              type="button"
              className="recent-chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCity(item.name);
              }}
              title={`Remove ${item.name} from recent searches`}
              aria-label={`Remove ${item.name}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
