import {
  getWeatherConditionMeta,
  getUVCategory,
  getAQICategory,
  calculateSunProgress,
  formatCoordinates,
  formatTimezoneOffset,
  calculateMoonPhase,
} from '../utils/weatherUtils';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

/**
 * Check if input string is exact coordinate pair (e.g. "13.9299, 75.5681" or "13.9299N, 75.5681E")
 */
export const parseCoordinates = (input) => {
  if (!input || typeof input !== 'string') return null;
  const cleaned = input.trim();
  const coordRegex = /^(-?\d+(\.\d+)?)\s*[, ]\s*(-?\d+(\.\d+)?)$/;
  const match = cleaned.match(coordRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[3]);
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return { lat, lon };
    }
  }
  return null;
};

/**
 * Normalized data structure transformer for WeatherAPI.com responses
 */
const transformWeatherApiResponse = (data, extraMeta = {}) => {
  const loc = data.location || {};
  const cur = data.current || {};
  const forecastDays = data.forecast?.forecastday || [];
  const todayForecast = forecastDays[0] || {};
  const isDay = cur.is_day === 1 ? 1 : 0;

  const conditionMeta = getWeatherConditionMeta(cur.condition?.text || '', isDay);

  // Process Hourly Forecast (next 24 hours)
  const allHours = [];
  forecastDays.forEach((day) => {
    (day.hour || []).forEach((h) => {
      allHours.push(h);
    });
  });

  const nowEpoch = loc.localtime_epoch || Math.floor(Date.now() / 1000);
  const currentHourIdx = allHours.findIndex((h) => h.time_epoch >= nowEpoch - 1800);
  const startIdx = Math.max(0, currentHourIdx >= 0 ? currentHourIdx : 0);
  const next24Hours = allHours.slice(startIdx, startIdx + 24);

  const hourly = next24Hours.map((h, index) => {
    const hHour = new Date(h.time.replace(' ', 'T')).getHours();
    const hMeta = getWeatherConditionMeta(h.condition?.text || '', h.is_day);
    const ampm = hHour >= 12 ? 'PM' : 'AM';
    const displayHour = hHour % 12 === 0 ? 12 : hHour % 12;

    return {
      time: h.time,
      timeDisplay: index === 0 ? 'Now' : `${displayHour} ${ampm}`,
      hour: hHour,
      tempC: Math.round(h.temp_c),
      tempF: Math.round(h.temp_f),
      conditionText: h.condition?.text || '',
      iconType: hMeta.icon,
      rainProb: h.chance_of_rain !== undefined ? Number(h.chance_of_rain) : 0,
      precipMm: h.precip_mm || 0,
      humidity: h.humidity,
      windKph: Math.round(h.wind_kph),
      windDir: h.wind_dir,
      uvIndex: Math.round(h.uv || 0),
      isCurrentHour: index === 0,
    };
  });

  // Process 7-day Daily Forecast
  const daily = forecastDays.map((d, idx) => {
    const dayMeta = getWeatherConditionMeta(d.day?.condition?.text || '', 1);
    const dateObj = new Date(d.date + 'T00:00:00');
    const dayName =
      idx === 0
        ? 'Today'
        : idx === 1
        ? 'Tomorrow'
        : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);

    return {
      date: d.date,
      dayName,
      formattedDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
        dateObj
      ),
      conditionText: d.day?.condition?.text || '',
      iconType: dayMeta.icon,
      maxTempC: Math.round(d.day?.maxtemp_c),
      maxTempF: Math.round(d.day?.maxtemp_f),
      minTempC: Math.round(d.day?.mintemp_c),
      minTempF: Math.round(d.day?.mintemp_f),
      rainProb: d.day?.daily_chance_of_rain || 0,
      precipMm: d.day?.totalprecip_mm || 0,
      uvIndex: Math.round(d.day?.uv || 0),
      sunrise: d.astro?.sunrise || '',
      sunset: d.astro?.sunset || '',
      moonPhase: d.astro?.moon_phase || '',
      moonIllumination: d.astro?.moon_illumination || '',
    };
  });

  // Process Air Quality
  let airQuality = null;
  if (cur.air_quality) {
    const epaIndex = cur.air_quality['us-epa-index'] || 1;
    const aqiApproximations = [0, 35, 75, 125, 175, 250, 350];
    const aqiVal = aqiApproximations[epaIndex] || 45;
    const aqiCat = getAQICategory(aqiVal);

    airQuality = {
      aqi: aqiVal,
      epaIndex,
      category: aqiCat.label,
      color: aqiCat.color,
      description: aqiCat.description,
      pm25: cur.air_quality.pm2_5 ? Number(cur.air_quality.pm2_5.toFixed(1)) : null,
      pm10: cur.air_quality.pm10 ? Number(cur.air_quality.pm10.toFixed(1)) : null,
      no2: cur.air_quality.no2 ? Number(cur.air_quality.no2.toFixed(1)) : null,
      o3: cur.air_quality.o3 ? Number(cur.air_quality.o3.toFixed(1)) : null,
      co: cur.air_quality.co ? Number(cur.air_quality.co.toFixed(1)) : null,
      so2: cur.air_quality.so2 ? Number(cur.air_quality.so2.toFixed(1)) : null,
    };
  }

  // Alerts
  const alerts = (data.alerts?.alert || []).map((a, i) => ({
    id: `alert-${i}`,
    title: a.headline || a.event || 'Weather Advisory',
    severity: a.severity || 'Moderate',
    urgency: a.urgency || 'Expected',
    start: a.effective || '',
    end: a.expires || '',
    description: a.desc || a.instruction || '',
    area: a.areas || loc.name,
  }));

  const sunrise = todayForecast.astro?.sunrise || '06:00 AM';
  const sunset = todayForecast.astro?.sunset || '06:30 PM';
  const sunProgress = calculateSunProgress(sunrise, sunset, loc.localtime?.split(' ')[1]);
  const moonInfo = calculateMoonPhase(new Date());

  const lat = loc.lat;
  const lon = loc.lon;

  return {
    location: {
      name: extraMeta.preciseName || loc.name || 'Unknown',
      locality: extraMeta.locality || loc.name || '',
      district: extraMeta.district || '',
      region: extraMeta.region || loc.region || '',
      country: extraMeta.country || loc.country || '',
      fullAddress: extraMeta.fullAddress || [loc.name, loc.region, loc.country].filter(Boolean).join(', '),
      lat,
      lon,
      coordinatesFormatted: formatCoordinates(lat, lon),
      accuracy: extraMeta.accuracy || null,
      elevation: extraMeta.elevation || null,
      localTime: loc.localtime || '',
      timezone: loc.tz_id || '',
      timezoneFormatted: loc.tz_id || 'UTC',
      isGPS: Boolean(extraMeta.isGPS),
      isDay,
    },
    current: {
      tempC: Math.round(cur.temp_c),
      tempF: Math.round(cur.temp_f),
      feelsLikeC: Math.round(cur.feelslike_c),
      feelsLikeF: Math.round(cur.feelslike_f),
      tempMaxC: todayForecast.day ? Math.round(todayForecast.day.maxtemp_c) : Math.round(cur.temp_c + 3),
      tempMaxF: todayForecast.day ? Math.round(todayForecast.day.maxtemp_f) : Math.round(cur.temp_f + 5),
      tempMinC: todayForecast.day ? Math.round(todayForecast.day.mintemp_c) : Math.round(cur.temp_c - 4),
      tempMinF: todayForecast.day ? Math.round(todayForecast.day.mintemp_f) : Math.round(cur.temp_f - 7),
      conditionText: cur.condition?.text || 'Clear',
      conditionCode: cur.condition?.code,
      iconType: conditionMeta.icon,
      theme: conditionMeta.theme,
      humidity: cur.humidity || 0,
      windKph: Math.round(cur.wind_kph || 0),
      windMph: Math.round(cur.wind_mph || 0),
      windDir: cur.wind_dir || 'N',
      windDegree: cur.wind_degree || 0,
      uvIndex: Math.round(cur.uv || 0),
      uvCategory: getUVCategory(cur.uv),
      visibilityKm: cur.vis_km !== undefined ? cur.vis_km : 10,
      visibilityMiles: cur.vis_miles !== undefined ? cur.vis_miles : 6.2,
      pressureMb: cur.pressure_mb || 1013,
      pressureIn: cur.pressure_in || 29.92,
      cloudCover: cur.cloud || 0,
      dewPointC: cur.dewpoint_c !== undefined ? Math.round(cur.dewpoint_c) : Math.round(cur.temp_c - (100 - cur.humidity) / 5),
      dewPointF: cur.dewpoint_f !== undefined ? Math.round(cur.dewpoint_f) : Math.round(cur.temp_f - ((100 - cur.humidity) / 5) * 1.8),
      precipMm: cur.precip_mm || 0,
      precipIn: cur.precip_in || 0,
    },
    hourly,
    daily,
    astro: {
      sunrise,
      sunset,
      dayLength: '12h 30m',
      sunProgressPercent: sunProgress,
      moonPhaseName: todayForecast.astro?.moon_phase || moonInfo.name,
      moonIllumination: todayForecast.astro?.moon_illumination || moonInfo.illumination,
    },
    airQuality,
    alerts,
    provider: 'WeatherAPI',
    lastUpdated: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date()),
  };
};

/**
 * Open-Meteo Free API fallback transformer
 */
const fetchOpenMeteoData = async (lat, lon, locationInfo = {}) => {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Open-Meteo request failed (${weatherRes.status})`);
  }

  const wData = await weatherRes.json();
  const aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

  const current = wData.current || {};
  const hourlyRaw = wData.hourly || {};
  const dailyRaw = wData.daily || {};

  const isDay = current.is_day === 1 ? 1 : 0;
  const currentConditionMeta = getWeatherConditionMeta(current.weather_code, isDay);

  // Hourly (next 24 hours from current local hour)
  const hourlyTimes = hourlyRaw.time || [];
  const nowIsoPrefix = current.time ? current.time.slice(0, 13) : '';
  let startIdx = hourlyTimes.findIndex((t) => t.startsWith(nowIsoPrefix));
  if (startIdx === -1) startIdx = 0;

  const hourly = [];
  const count = Math.min(24, hourlyTimes.length - startIdx);
  for (let i = 0; i < count; i++) {
    const idx = startIdx + i;
    const timeStr = hourlyTimes[idx];
    const dateObj = new Date(timeStr);
    const hour = dateObj.getHours();
    const isHourDay = hour >= 6 && hour < 19 ? 1 : 0;
    const hMeta = getWeatherConditionMeta(hourlyRaw.weather_code?.[idx], isHourDay);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    const tempC = hourlyRaw.temperature_2m?.[idx] ?? 20;

    hourly.push({
      time: timeStr,
      timeDisplay: i === 0 ? 'Now' : `${displayHour} ${ampm}`,
      hour,
      tempC: Math.round(tempC),
      tempF: Math.round((tempC * 9) / 5 + 32),
      conditionText: hMeta.name,
      iconType: hMeta.icon,
      rainProb: hourlyRaw.precipitation_probability?.[idx] ?? 0,
      precipMm: hourlyRaw.precipitation?.[idx] ?? 0,
      humidity: hourlyRaw.relative_humidity_2m?.[idx] ?? 50,
      windKph: Math.round(hourlyRaw.wind_speed_10m?.[idx] ?? 0),
      uvIndex: Math.round(hourlyRaw.uv_index?.[idx] ?? 0),
      isCurrentHour: i === 0,
    });
  }

  // Daily (7 days)
  const dailyDates = dailyRaw.time || [];
  const daily = [];
  for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
    const dateStr = dailyDates[i];
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayMeta = getWeatherConditionMeta(dailyRaw.weather_code?.[i], 1);
    const dayName =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);

    const maxC = dailyRaw.temperature_2m_max?.[i] ?? 25;
    const minC = dailyRaw.temperature_2m_min?.[i] ?? 18;

    const sunriseIso = dailyRaw.sunrise?.[i] || '';
    const sunsetIso = dailyRaw.sunset?.[i] || '';

    const formatSunTime = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    };

    daily.push({
      date: dateStr,
      dayName,
      formattedDate: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
        dateObj
      ),
      conditionText: dayMeta.name,
      iconType: dayMeta.icon,
      maxTempC: Math.round(maxC),
      maxTempF: Math.round((maxC * 9) / 5 + 32),
      minTempC: Math.round(minC),
      minTempF: Math.round((minC * 9) / 5 + 32),
      rainProb: dailyRaw.precipitation_probability_max?.[i] ?? 0,
      precipMm: dailyRaw.precipitation_sum?.[i] ?? 0,
      uvIndex: Math.round(dailyRaw.uv_index_max?.[i] ?? 0),
      sunrise: formatSunTime(sunriseIso),
      sunset: formatSunTime(sunsetIso),
    });
  }

  // Air Quality
  let airQuality = null;
  if (aqiData && aqiData.current) {
    const aqiCur = aqiData.current;
    const aqiVal = Math.round(aqiCur.us_aqi ?? 40);
    const aqiCat = getAQICategory(aqiVal);

    airQuality = {
      aqi: aqiVal,
      category: aqiCat.label,
      color: aqiCat.color,
      description: aqiCat.description,
      pm25: aqiCur.pm2_5 !== undefined ? Number(aqiCur.pm2_5.toFixed(1)) : null,
      pm10: aqiCur.pm10 !== undefined ? Number(aqiCur.pm10.toFixed(1)) : null,
      no2: aqiCur.nitrogen_dioxide !== undefined ? Number(aqiCur.nitrogen_dioxide.toFixed(1)) : null,
      o3: aqiCur.ozone !== undefined ? Number(aqiCur.ozone.toFixed(1)) : null,
      co: aqiCur.carbon_monoxide !== undefined ? Number(aqiCur.carbon_monoxide.toFixed(1)) : null,
      so2: aqiCur.sulphur_dioxide !== undefined ? Number(aqiCur.sulphur_dioxide.toFixed(1)) : null,
    };
  }

  const curTempC = current.temperature_2m ?? 20;
  const curFeelsC = current.apparent_temperature ?? curTempC;
  const curPressure = current.surface_pressure ?? 1013;
  const curWindKph = current.wind_speed_10m ?? 0;
  const curHumidity = current.relative_humidity_2m ?? 60;
  const curDewPointC = hourlyRaw.dew_point_2m?.[startIdx] ?? Math.round(curTempC - (100 - curHumidity) / 5);
  const curVisibilityMeters = hourlyRaw.visibility?.[startIdx] ?? 10000;
  const curUv = hourlyRaw.uv_index?.[startIdx] ?? dailyRaw.uv_index_max?.[0] ?? 4;

  const sunriseFormatted = daily[0]?.sunrise || '06:00 AM';
  const sunsetFormatted = daily[0]?.sunset || '06:30 PM';
  const sunProgress = calculateSunProgress(sunriseFormatted, sunsetFormatted, current.time?.split('T')[1]);
  const moonInfo = calculateMoonPhase(new Date());

  // Wind direction to cardinal
  const degreesToCardinal = (deg) => {
    const val = Math.floor(deg / 22.5 + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[val % 16];
  };

  const elevation = wData.elevation !== undefined ? Math.round(wData.elevation) : null;
  const timezoneFormatted = formatTimezoneOffset(wData.utc_offset_seconds, wData.timezone);

  return {
    location: {
      name: locationInfo.name || 'Selected Location',
      locality: locationInfo.locality || locationInfo.name || '',
      district: locationInfo.district || '',
      region: locationInfo.admin1 || locationInfo.region || '',
      country: locationInfo.country || '',
      fullAddress: locationInfo.fullAddress || [locationInfo.name, locationInfo.region, locationInfo.country].filter(Boolean).join(', '),
      lat,
      lon,
      coordinatesFormatted: formatCoordinates(lat, lon),
      accuracy: locationInfo.accuracy || null,
      elevation,
      localTime: current.time ? current.time.replace('T', ' ') : '',
      timezone: wData.timezone || 'UTC',
      timezoneFormatted,
      isGPS: Boolean(locationInfo.isGPS),
      isDay,
    },
    current: {
      tempC: Math.round(curTempC),
      tempF: Math.round((curTempC * 9) / 5 + 32),
      feelsLikeC: Math.round(curFeelsC),
      feelsLikeF: Math.round((curFeelsC * 9) / 5 + 32),
      tempMaxC: daily[0]?.maxTempC ?? Math.round(curTempC + 4),
      tempMaxF: daily[0]?.maxTempF ?? Math.round(((curTempC + 4) * 9) / 5 + 32),
      tempMinC: daily[0]?.minTempC ?? Math.round(curTempC - 4),
      tempMinF: daily[0]?.minTempF ?? Math.round(((curTempC - 4) * 9) / 5 + 32),
      conditionText: currentConditionMeta.name,
      conditionCode: current.weather_code,
      iconType: currentConditionMeta.icon,
      theme: currentConditionMeta.theme,
      humidity: Math.round(curHumidity),
      windKph: Math.round(curWindKph),
      windMph: Math.round(curWindKph * 0.621371),
      windDir: degreesToCardinal(current.wind_direction_10m || 0),
      windDegree: current.wind_direction_10m || 0,
      uvIndex: Math.round(curUv),
      uvCategory: getUVCategory(curUv),
      visibilityKm: Number((curVisibilityMeters / 1000).toFixed(1)),
      visibilityMiles: Number(((curVisibilityMeters / 1000) * 0.621371).toFixed(1)),
      pressureMb: Math.round(curPressure),
      pressureIn: Number((curPressure * 0.02953).toFixed(2)),
      cloudCover: Math.round(current.cloud_cover ?? 0),
      dewPointC: Math.round(curDewPointC),
      dewPointF: Math.round((curDewPointC * 9) / 5 + 32),
      precipMm: current.precipitation ?? 0,
      precipIn: Number(((current.precipitation ?? 0) * 0.0393701).toFixed(2)),
    },
    hourly,
    daily,
    astro: {
      sunrise: sunriseFormatted,
      sunset: sunsetFormatted,
      dayLength: '12h 30m',
      sunProgressPercent: sunProgress,
      moonPhaseName: moonInfo.name,
      moonIllumination: moonInfo.illumination,
    },
    airQuality,
    alerts: [],
    provider: 'Open-Meteo Precision',
    lastUpdated: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date()),
  };
};

/**
 * Detect user's current city & coordinates via client IP (Zero-permission fallback)
 */
export const detectUserIPLocation = async () => {
  // Try 1: BigDataCloud client geolocator (free, HTTPS, CORS-friendly)
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const city = data.city || data.locality || data.principalSubdivision || 'Detected Location';
        return {
          name: city,
          locality: data.locality || city,
          region: data.principalSubdivision || '',
          country: data.countryName || '',
          lat: data.latitude,
          lon: data.longitude,
          isIP: true,
        };
      }
    }
  } catch (err) {
    console.warn('BigDataCloud IP detection fallback', err);
  }

  // Try 2: ipwho.is (fast, HTTPS, CORS-friendly)
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && data.latitude && data.longitude) {
        return {
          name: data.city || data.region || 'Detected Location',
          locality: data.city || '',
          region: data.region || '',
          country: data.country || '',
          lat: data.latitude,
          lon: data.longitude,
          isIP: true,
        };
      }
    }
  } catch (err) {
    console.warn('ipwho.is detection fallback', err);
  }

  return null;
};

/**
 * Ultra-precise Reverse Geocoding using BigDataCloud + OpenStreetMap Nominatim
 */
export const reverseGeocode = async (lat, lon, accuracy = null) => {
  // Strategy 1: BigDataCloud (fastest, high reliability for local Indian and global cities like Udupi, Manipal, etc.)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const locality = data.locality && data.locality !== cityName ? data.locality : '';
      const region = data.principalSubdivision || '';
      const country = data.countryName || '';

      const parts = [locality, cityName, region, country].filter(Boolean);
      const uniqueParts = [...new Set(parts)];

      return {
        name: cityName,
        locality: locality || cityName,
        district: '',
        region,
        country,
        fullAddress: uniqueParts.join(', '),
        lat,
        lon,
        accuracy,
        isGPS: true,
      };
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode error', err);
  }

  // Strategy 2: OpenStreetMap Nominatim for exact address granularity (suburb, city, district, state)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=16&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.state_district ||
        addr.county ||
        addr.suburb ||
        addr.village ||
        'Selected Location';
      const locality = addr.suburb || addr.neighbourhood || addr.residential || '';
      const district = addr.state_district || addr.county || '';
      const region = addr.state || addr.province || '';
      const country = addr.country || '';

      const parts = [locality, cityName, district, region, country].filter(Boolean);
      const uniqueParts = [...new Set(parts)];

      return {
        name: cityName,
        locality: locality || cityName,
        district,
        region,
        country,
        fullAddress: uniqueParts.join(', '),
        lat,
        lon,
        accuracy,
        isGPS: true,
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode fallback', err);
  }

  return {
    name: 'Precise GPS Location',
    locality: '',
    district: '',
    region: '',
    country: '',
    fullAddress: formatCoordinates(lat, lon),
    lat,
    lon,
    accuracy,
    isGPS: true,
  };
};

/**
 * Search locations autocomplete with multi-tier search (WeatherAPI -> Open-Meteo -> Nominatim)
 */
export const searchLocations = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim();

  // Check if query is exact coordinates
  const coords = parseCoordinates(trimmed);
  if (coords) {
    return [
      {
        id: `coord-${coords.lat}-${coords.lon}`,
        name: `Coordinates: ${formatCoordinates(coords.lat, coords.lon)}`,
        region: 'Exact GPS Position',
        country: '',
        lat: coords.lat,
        lon: coords.lon,
        query: `${coords.lat}, ${coords.lon}`,
        isCoord: true,
      },
    ];
  }

  // Strategy 1: WeatherAPI if key is available
  if (WEATHER_API_KEY) {
    try {
      const res = await fetch(
        `${WEATHER_API_BASE}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(trimmed)}`
      );
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) {
          return list.map((item) => ({
            id: item.id || `${item.lat},${item.lon}`,
            name: item.name,
            region: item.region,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
            query: `${item.name}, ${item.country}`,
          }));
        }
      }
    } catch (e) {
      console.warn('WeatherAPI search failed, falling back to Open-Meteo', e);
    }
  }

  // Strategy 2: Open-Meteo Geocoding Search
  // If user entered "City, Country" or "Locality, City, State", query the primary token
  const primaryName = trimmed.includes(',') ? trimmed.split(',')[0].trim() : trimmed;
  const secondaryFilter = trimmed.includes(',')
    ? trimmed.split(',').slice(1).join(' ').trim().toLowerCase()
    : '';

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        primaryName
      )}&count=10&language=en&format=json`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        let list = data.results.map((r) => ({
          id: `${r.id || r.latitude}-${r.longitude}`,
          name: r.name,
          region: r.admin1 || '',
          country: r.country || '',
          lat: r.latitude,
          lon: r.longitude,
          query: `${r.name}${r.country ? `, ${r.country}` : ''}`,
        }));

        if (secondaryFilter) {
          list = list.sort((a, b) => {
            const aMatch =
              (a.country && a.country.toLowerCase().includes(secondaryFilter)) ||
              (a.region && a.region.toLowerCase().includes(secondaryFilter));
            const bMatch =
              (b.country && b.country.toLowerCase().includes(secondaryFilter)) ||
              (b.region && b.region.toLowerCase().includes(secondaryFilter));
            return bMatch - aMatch;
          });
        }

        return list;
      }
    }
  } catch (error) {
    console.warn('Open-Meteo search failed, trying Nominatim', error);
  }

  // Strategy 3: OpenStreetMap Nominatim Search (handles full address strings, landmarks, suburbs)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&limit=6&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (res.ok) {
      const list = await res.json();
      if (list && list.length > 0) {
        return list.map((item) => {
          const addr = item.address || {};
          const name =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            item.name ||
            item.display_name.split(',')[0];
          const region = addr.state || addr.province || '';
          const country = addr.country || '';

          return {
            id: `nom-${item.place_id}`,
            name,
            region,
            country,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            query: item.display_name,
          };
        });
      }
    }
  } catch (err) {
    console.error('All geocoding search strategies failed:', err);
  }

  return [];
};

/**
 * Get weather by city name / search query / coordinates string
 */
export const getWeatherByCity = async (cityName) => {
  if (!cityName || !cityName.trim()) {
    throw new Error('Please enter a city name.');
  }

  const query = cityName.trim();

  // Check if searching direct coordinates (e.g. "13.9299, 75.5681")
  const coords = parseCoordinates(query);
  if (coords) {
    return getWeatherByCoordinates(coords.lat, coords.lon);
  }

  // Try WeatherAPI if key is available
  if (WEATHER_API_KEY) {
    try {
      const res = await fetch(
        `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
          query
        )}&days=7&aqi=yes&alerts=yes`
      );
      if (res.ok) {
        const data = await res.json();
        return transformWeatherApiResponse(data);
      }
    } catch (e) {
      console.warn('WeatherAPI forecast failed, trying geocoding fallback', e);
    }
  }

  // Search locations using our multi-tier geocoder
  const locations = await searchLocations(query);
  if (!locations || locations.length === 0) {
    throw new Error(`Location "${cityName}" not found. Please try searching another city name.`);
  }

  const target = locations[0];
  return fetchOpenMeteoData(target.lat, target.lon, target);
};

/**
 * Get weather by latitude and longitude coordinates (e.g. GPS Location)
 */
export const getWeatherByCoordinates = async (lat, lon, accuracy = null) => {
  if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
    throw new Error('Invalid coordinates provided.');
  }

  const locationInfo = await reverseGeocode(lat, lon, accuracy);

  // Try WeatherAPI if key is available
  if (WEATHER_API_KEY) {
    try {
      const res = await fetch(
        `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=yes`
      );
      if (res.ok) {
        const data = await res.json();
        return transformWeatherApiResponse(data, locationInfo);
      }
    } catch (e) {
      console.warn('WeatherAPI coordinate fetch failed, falling back to Open-Meteo', e);
    }
  }

  // Fallback: Open-Meteo
  return fetchOpenMeteoData(lat, lon, locationInfo);
};
