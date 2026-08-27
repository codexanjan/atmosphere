# 🌤️ Atmosphere — Modern Weather Intelligence Dashboard

A production-grade, highly responsive, and feature-rich weather forecasting application built with **React**, **Vite**, **Lucide Icons**, and **Recharts**.

Atmosphere provides real-time atmospheric measurements, 24-hour hourly tracks, 7-day extended forecasts, interactive temperature & precipitation charts, air quality metrics (AQI & pollutants), sunrise/sunset solar trajectory arcs, severe weather alerts, favorite locations management, and search history with persistent storage.

---

## ✨ Features

- **🔍 Smart City & Location Search**: Search any city, state, or country worldwide with debounced autocomplete suggestions and full keyboard navigation.
- **📍 GPS Geolocation ("My Location")**: Instant 1-click device geolocation lookup with permission error handling and fallback.
- **🌡️ Current Weather Hero**: Displays real-time temperature, condition badge, animated weather icon, "feels-like" temperature, local time & date in location's timezone, and daily high/low.
- **📊 8 Detailed Weather Metric Cards**:
  - **Humidity** (%) with dew point reference
  - **Wind** (speed + cardinal direction + compass degree)
  - **UV Index** with color-coded risk category & sun safety recommendations
  - **Visibility** (km / mi) with atmospheric clarity rating
  - **Pressure** (hPa / inHg) with barometric condition
  - **Cloud Cover** (%)
  - **Dew Point** (°C / °F)
  - **Precipitation** (mm / in)
- **⏱️ 24-Hour Hourly Forecast**: Smooth horizontally scrollable carousel with time, weather icons, temperatures, and rain probabilities.
- **📅 7-Day Extended Forecast**: Daily forecast list with condition badges, rain chance, and proportional temperature range gradient bars.
- **📈 Interactive Weather Charts (Recharts)**:
  - **Temperature Trend**: Smooth gradient area chart across upcoming hours.
  - **Precipitation Probability**: Hourly rain chance (%) and volume bar chart.
- **🌅 Solar Cycle & Sun Arc**: Visual solar trajectory tracker with calculated daylight duration, sunrise time, and sunset time.
- **🍃 Air Quality Index (AQI)**: US EPA AQI score, health status category, and pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO).
- **⚠️ Severe Weather Alerts**: Real-time storm and safety warnings or clean "No active alerts" badge.
- **❤️ Favorite Locations**: Bookmark favorite cities with quick preview cards, live weather stats, and persistent `localStorage` storage.
- **🕒 Recent Searches**: Quick-access history chips with one-click reload and history clearing.
- **🔄 Instant Unit Conversion**: Seamless toggle between Celsius (°C) and Fahrenheit (°F) across all metrics and charts without full page reloading.
- **🌓 Dark & Light Modes**: Seamless CSS custom properties theme engine with system preference auto-detection and persistence.
- **🎨 Dynamic Atmospheric Ambience**: Subtle background shifts reflecting live weather conditions (Clear Day, Clear Night, Rain, Thunderstorm, Snow, Fog).
- **⚡ Dual-Engine Weather API Architecture**:
  - Out-of-the-box support for **WeatherAPI.com** (`VITE_WEATHER_API_KEY`).
  - Seamless zero-config automatic fallback to **Open-Meteo API** (guaranteeing instant out-of-the-box functionality without requiring an API key).

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS with CSS Custom Properties, Glassmorphism & Responsive Grid
- **Storage**: Browser `localStorage`

---

## 📂 Project Structure

```
weather-app/
├── public/
│   └── favicon.svg              # App Favicon
├── src/
│   ├── components/
│   │   ├── AirQuality.jsx       # AQI score & pollutant levels
│   │   ├── AtmosphereCanvas.jsx # Dynamic particle weather canvas
│   │   ├── CurrentWeather.jsx   # Main weather hero card
│   │   ├── DailyForecast.jsx    # 7-day forecast cards
│   │   ├── EmptyState.jsx       # Welcome & popular city prompts
│   │   ├── ErrorMessage.jsx     # Friendly error recovery card
│   │   ├── FavoriteCities.jsx   # Bookmarked cities drawer
│   │   ├── Footer.jsx           # Data attribution & metadata
│   │   ├── Header.jsx           # App navigation & actions
│   │   ├── HourlyForecast.jsx   # 24-hour horizontal track
│   │   ├── LoadingSkeleton.jsx  # Shimmer loading placeholders
│   │   ├── LocationButton.jsx   # Geolocation trigger button
│   │   ├── RainChart.jsx        # Precipitation probability chart
│   │   ├── RecentSearches.jsx   # Search history chips
│   │   ├── SearchBar.jsx        # Search with debounced autocomplete
│   │   ├── SunriseSunset.jsx    # Solar trajectory & daylight card
│   │   ├── TemperatureChart.jsx # Recharts hourly temperature area
│   │   ├── ThemeToggle.jsx      # Light / Dark theme switch
│   │   ├── UnitToggle.jsx       # Celsius / Fahrenheit switch
│   │   ├── WeatherAlerts.jsx    # Advisory & warning card
│   │   ├── WeatherIcon.jsx      # Lucide dynamic icon renderer
│   │   └── WeatherStats.jsx     # 8 detailed condition metric cards
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Local storage reactive hook
│   │   └── useWeather.js        # Core weather state & data hook
│   ├── services/
│   │   └── weatherApi.js        # WeatherAPI + Open-Meteo unified service
│   ├── utils/
│   │   ├── storage.js           # Storage helpers for favorites & recents
│   │   └── weatherUtils.js      # Unit conversions, condition & AQI mappers
│   ├── App.jsx                  # Main dashboard layout
│   ├── index.css                # Global design system & theme tokens
│   └── main.jsx                 # React root entry point
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** / **pnpm**

### 2. Installation

Clone or open the project directory and install dependencies:

```bash
npm install
```

### 3. Environment Configuration (Optional)

Atmosphere comes with an automatic **Open-Meteo** dual-engine fallback that works immediately without any API key.

If you wish to use [WeatherAPI.com](https://www.weatherapi.com/):
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Insert your free WeatherAPI.com key:
   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

### 4. Running Locally

Start the Vite development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port specified in terminal).

### 5. Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production bundle locally:

```bash
npm run preview
```

---

## 📱 Responsive Testing & Accessibility

The design is fully mobile-first and tested across:
- Mobile devices (320px, 375px, 425px)
- Tablets (768px, 1024px)
- Laptops and high-DPI desktop screens (1440px+)

Includes ARIA attributes, semantic landmarks, high color contrast, keyboard-accessible dropdowns, and responsive charts.

---

## 👨‍💻 Author

**Anjan Shetty**
- GitHub: [@codexanjan](https://github.com/codexanjan)

---

## 📄 License

MIT License © Atmosphere Weather. Built with ❤️ by [Anjan Shetty](https://github.com/codexanjan).
