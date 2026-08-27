import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

export const ThemeToggle = ({ theme, onToggle, setTheme }) => {
  const getThemeInfo = () => {
    if (theme === 'aurora') {
      return { label: 'Aurora Night', icon: Sparkles, next: 'Light' };
    }
    if (theme === 'light') {
      return { label: 'Daylight', icon: Sun, next: 'Midnight' };
    }
    return { label: 'Midnight', icon: Moon, next: 'Aurora' };
  };

  const current = getThemeInfo();
  const IconComponent = current.icon;

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={onToggle}
      className={`theme-toggle-btn icon-btn theme-${theme}`}
      title={`Theme: ${current.label} (Click to switch to ${current.next})`}
      aria-label={`Current theme: ${current.label}. Click to switch theme`}
    >
      <IconComponent size={19} className="theme-icon" />
      <span className="theme-mode-tag">{current.label}</span>
    </button>
  );
};

export default ThemeToggle;
