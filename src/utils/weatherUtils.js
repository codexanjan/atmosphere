// Temperature conversion
export const celsiusToFahrenheit = (celsius) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return null;
  return Math.round((celsius * 9) / 5 + 32);
};

export const formatTemp = (celsius, unit = 'C', showDegree = true) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  const val = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${val}${showDegree ? '°' : ''}`;
};

export const formatTempWithUnit = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  const val = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${val}°${unit}`;
};

// Wind conversion & formatting
export const kmhToMph = (kmh) => {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return null;
  return Math.round(kmh * 0.621371);
};

export const formatWind = (kph, unit = 'C', direction = '') => {
  if (kph === null || kph === undefined || isNaN(kph)) return '--';
  const speed = unit === 'F' ? `${kmhToMph(kph)} mph` : `${Math.round(kph)} km/h`;
  return direction ? `${speed} ${direction}` : speed;
};

// Visibility
export const formatVisibility = (km, unit = 'C') => {
  if (km === null || km === undefined || isNaN(km)) return '--';
  if (unit === 'F') {
    const miles = (km * 0.621371).toFixed(1);
    return `${miles} mi`;
  }
  return `${km.toFixed(1)} km`;
};

// Pressure
export const formatPressure = (mb, unit = 'C') => {
  if (mb === null || mb === undefined || isNaN(mb)) return '--';
  if (unit === 'F') {
    const inHg = (mb * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${Math.round(mb)} hPa`;
};

// Precipitation
export const formatPrecipitation = (mm, unit = 'C') => {
  if (mm === null || mm === undefined || isNaN(mm)) return '0 mm';
  if (unit === 'F') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
};

// UV Index category and color
export const getUVCategory = (uv) => {
  if (uv === null || uv === undefined || isNaN(uv)) {
    return { label: 'Low', category: 'low', color: '#10b981', advice: 'No protection required' };
  }
  const val = Number(uv);
  if (val <= 2) {
    return { label: 'Low', category: 'low', color: '#10b981', advice: 'Safe to stay outside' };
  } else if (val <= 5) {
    return { label: 'Moderate', category: 'moderate', color: '#f59e0b', advice: 'Seek shade during midday' };
  } else if (val <= 7) {
    return { label: 'High', category: 'high', color: '#f97316', advice: 'Wear hat, sunscreen & sunglasses' };
  } else if (val <= 10) {
    return { label: 'Very High', category: 'very-high', color: '#ef4444', advice: 'Avoid sun exposure around noon' };
  } else {
    return { label: 'Extreme', category: 'extreme', color: '#a855f7', advice: 'Take full precautions, stay indoors' };
  }
};

// Air Quality Index (US EPA AQI) category and color
export const getAQICategory = (aqi) => {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return { label: 'Unknown', category: 'unknown', color: '#94a3b8', description: 'Air quality data unavailable' };
  }
  const val = Math.round(Number(aqi));
  if (val <= 50) {
    return { label: 'Good', category: 'good', color: '#10b981', description: 'Air quality is satisfactory and poses little to no risk.' };
  } else if (val <= 100) {
    return { label: 'Moderate', category: 'moderate', color: '#eab308', description: 'Acceptable quality, sensitive individuals may experience mild effects.' };
  } else if (val <= 150) {
    return { label: 'Unhealthy for Sensitive Groups', category: 'sensitive', color: '#f97316', description: 'Members of sensitive groups may experience health effects.' };
  } else if (val <= 200) {
    return { label: 'Unhealthy', category: 'unhealthy', color: '#ef4444', description: 'Some members of the general public may experience health effects.' };
  } else if (val <= 300) {
    return { label: 'Very Unhealthy', category: 'very-unhealthy', color: '#8b5cf6', description: 'Health alert: The risk of health effects is increased for everyone.' };
  } else {
    return { label: 'Hazardous', category: 'hazardous', color: '#881337', description: 'Health warning of emergency conditions: Everyone is likely to be affected.' };
  }
};

// Weather condition mapping
export const getWeatherConditionMeta = (codeOrText, isDay = 1) => {
  const text = (typeof codeOrText === 'string' ? codeOrText : '').toLowerCase();
  const code = typeof codeOrText === 'number' ? codeOrText : null;

  // WMO code mapping (for Open-Meteo fallback)
  if (code !== null) {
    if (code === 0) {
      return isDay
        ? { icon: 'Sun', name: 'Clear Sky', theme: 'clear-day' }
        : { icon: 'Moon', name: 'Clear Night', theme: 'clear-night' };
    }
    if (code === 1 || code === 2) {
      return isDay
        ? { icon: 'CloudSun', name: 'Partly Cloudy', theme: 'cloudy-day' }
        : { icon: 'CloudMoon', name: 'Partly Cloudy', theme: 'cloudy-night' };
    }
    if (code === 3) {
      return { icon: 'Cloud', name: 'Overcast', theme: 'cloudy' };
    }
    if ([45, 48].includes(code)) {
      return { icon: 'CloudFog', name: 'Foggy', theme: 'fog' };
    }
    if ([51, 53, 55, 56, 57].includes(code)) {
      return { icon: 'CloudDrizzle', name: 'Drizzle', theme: 'rain' };
    }
    if ([61, 63, 65, 80, 81, 82].includes(code)) {
      return { icon: 'CloudRain', name: 'Rain', theme: 'rain' };
    }
    if ([66, 67, 71, 73, 75, 77, 85, 86].includes(code)) {
      return { icon: 'Snowflake', name: 'Snow', theme: 'snow' };
    }
    if ([95, 96, 99].includes(code)) {
      return { icon: 'CloudLightning', name: 'Thunderstorm', theme: 'thunderstorm' };
    }
  }

  // Text matching
  if (text.includes('thunder') || text.includes('storm') || text.includes('lightning')) {
    return { icon: 'CloudLightning', name: 'Thunderstorm', theme: 'thunderstorm' };
  }
  if (text.includes('snow') || text.includes('blizzard') || text.includes('sleet') || text.includes('ice') || text.includes('flurries')) {
    return { icon: 'Snowflake', name: 'Snow', theme: 'snow' };
  }
  if (text.includes('heavy rain') || text.includes('torrential') || text.includes('downpour')) {
    return { icon: 'CloudRainWind', name: 'Heavy Rain', theme: 'rain' };
  }
  if (text.includes('rain') || text.includes('shower') || text.includes('drizzle')) {
    return { icon: 'CloudRain', name: 'Rain', theme: 'rain' };
  }
  if (text.includes('fog') || text.includes('mist') || text.includes('haze') || text.includes('smoke')) {
    return { icon: 'CloudFog', name: 'Foggy / Hazy', theme: 'fog' };
  }
  if (text.includes('overcast') || text.includes('cloudy')) {
    return { icon: 'Cloud', name: 'Cloudy', theme: 'cloudy' };
  }
  if (text.includes('partly cloudy') || text.includes('scattered clouds')) {
    return isDay
      ? { icon: 'CloudSun', name: 'Partly Cloudy', theme: 'cloudy-day' }
      : { icon: 'CloudMoon', name: 'Partly Cloudy', theme: 'cloudy-night' };
  }
  if (text.includes('sunny') || text.includes('clear')) {
    return isDay
      ? { icon: 'Sun', name: 'Sunny', theme: 'clear-day' }
      : { icon: 'Moon', name: 'Clear Sky', theme: 'clear-night' };
  }
  if (text.includes('wind') || text.includes('breezy') || text.includes('gale')) {
    return { icon: 'Wind', name: 'Windy', theme: 'cloudy' };
  }

  return isDay
    ? { icon: 'Sun', name: 'Clear', theme: 'clear-day' }
    : { icon: 'Moon', name: 'Clear', theme: 'clear-night' };
};

// Date and Time Formatting
export const formatLocationDate = (dateStrOrTime) => {
  if (!dateStrOrTime) return '';
  const date = new Date(dateStrOrTime);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatLocationTime = (timeStrOrDate) => {
  if (!timeStrOrDate) return '';
  const date = new Date(timeStrOrDate);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const getDayName = (dateStr, isToday = false) => {
  if (isToday) return 'Today';
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
};

export const getShortDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

// Format latitude and longitude nicely
export const formatCoordinates = (lat, lon) => {
  if (lat === null || lat === undefined || lon === null || lon === undefined) return '';
  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (isNaN(latNum) || isNaN(lonNum)) return '';

  const latDir = latNum >= 0 ? 'N' : 'S';
  const lonDir = lonNum >= 0 ? 'E' : 'W';

  return `${Math.abs(latNum).toFixed(4)}° ${latDir}, ${Math.abs(lonNum).toFixed(4)}° ${lonDir}`;
};

// Format UTC offset seconds to GMT string (e.g. +19800s -> "GMT+05:30")
export const formatTimezoneOffset = (offsetSeconds, timezoneName) => {
  if (offsetSeconds === undefined || offsetSeconds === null) {
    return timezoneName || 'UTC';
  }
  const totalMins = Math.round(offsetSeconds / 60);
  const sign = totalMins >= 0 ? '+' : '-';
  const absMins = Math.abs(totalMins);
  const hrs = Math.floor(absMins / 60);
  const mins = absMins % 60;
  const formatted = `GMT${sign}${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  return timezoneName ? `${timezoneName} (${formatted})` : formatted;
};

// Astronomical Moon Phase Calculator
export const calculateMoonPhase = (date = new Date()) => {
  const d = new Date(date);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  const day = d.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = Math.floor(a / 4);
  const c = 2 - a + b;
  const e = Math.floor(365.25 * (year + 4716));
  const f = Math.floor(30.6001 * (month + 1));
  const jd = c + day + e + f - 1524.5;

  const daysSinceNew = (jd - 2451549.5) % 29.53058867;
  const phaseIndex = daysSinceNew < 0 ? daysSinceNew + 29.53058867 : daysSinceNew;
  const illumination = Math.round((1 - Math.cos((phaseIndex / 29.53058867) * 2 * Math.PI)) * 50);

  if (phaseIndex < 1.84566) return { name: 'New Moon', icon: 'Moon', illumination, phase: 'new' };
  if (phaseIndex < 5.53699) return { name: 'Waxing Crescent', icon: 'Moon', illumination, phase: 'waxing-crescent' };
  if (phaseIndex < 9.22831) return { name: 'First Quarter', icon: 'Moon', illumination, phase: 'first-quarter' };
  if (phaseIndex < 12.91963) return { name: 'Waxing Gibbous', icon: 'Moon', illumination, phase: 'waxing-gibbous' };
  if (phaseIndex < 16.61096) return { name: 'Full Moon', icon: 'Moon', illumination, phase: 'full' };
  if (phaseIndex < 20.30228) return { name: 'Waning Gibbous', icon: 'Moon', illumination, phase: 'waning-gibbous' };
  if (phaseIndex < 23.99361) return { name: 'Last Quarter', icon: 'Moon', illumination, phase: 'last-quarter' };
  if (phaseIndex < 27.68493) return { name: 'Waning Crescent', icon: 'Moon', illumination, phase: 'waning-crescent' };
  return { name: 'New Moon', icon: 'Moon', illumination, phase: 'new' };
};

// Sun position progress percentage (0 - 100)
export const calculateSunProgress = (sunriseStr, sunsetStr, currentTimeStr) => {
  try {
    const parseTime = (str) => {
      if (!str) return null;
      // Format: "06:12 AM" or "2026-08-26 06:12" or "06:12"
      const match = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = match[3] ? match[3].toUpperCase() : null;

      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    const sunriseMins = parseTime(sunriseStr);
    const sunsetMins = parseTime(sunsetStr);
    const currentMins = currentTimeStr ? parseTime(currentTimeStr) : (() => {
      const now = new Date();
      return now.getHours() * 60 + now.getMinutes();
    })();

    if (sunriseMins === null || sunsetMins === null || currentMins === null) return 50;

    if (currentMins <= sunriseMins) return 0;
    if (currentMins >= sunsetMins) return 100;

    const totalDaylight = sunsetMins - sunriseMins;
    if (totalDaylight <= 0) return 50;

    const elapsed = currentMins - sunriseMins;
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDaylight) * 100)));
  } catch {
    return 50;
  }
};
