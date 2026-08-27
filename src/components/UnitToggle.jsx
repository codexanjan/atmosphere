import React from 'react';

export const UnitToggle = ({ unit, onToggle, setUnit }) => {
  return (
    <div className="unit-toggle-container" role="radiogroup" aria-label="Temperature unit selection">
      <button
        type="button"
        id="unit-celsius-btn"
        className={`unit-toggle-btn ${unit === 'C' ? 'active' : ''}`}
        onClick={() => setUnit ? setUnit('C') : onToggle()}
        aria-checked={unit === 'C'}
        role="radio"
        title="Celsius"
      >
        °C
      </button>
      <button
        type="button"
        id="unit-fahrenheit-btn"
        className={`unit-toggle-btn ${unit === 'F' ? 'active' : ''}`}
        onClick={() => setUnit ? setUnit('F') : onToggle()}
        aria-checked={unit === 'F'}
        role="radio"
        title="Fahrenheit"
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;
