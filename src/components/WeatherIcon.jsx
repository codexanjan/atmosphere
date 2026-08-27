import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Snowflake,
  Wind,
  CloudRainWind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ShieldAlert,
} from 'lucide-react';

const iconMap = {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Snowflake,
  Wind,
  CloudRainWind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ShieldAlert,
};

export const WeatherIcon = ({ name = 'Sun', size = 24, className = '', ...props }) => {
  const IconComponent = iconMap[name] || Sun;
  return <IconComponent size={size} className={`weather-icon ${className}`} {...props} />;
};

export default WeatherIcon;
