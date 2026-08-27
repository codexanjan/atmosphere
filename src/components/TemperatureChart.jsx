import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatTemp } from '../utils/weatherUtils';

export const TemperatureChart = ({ hourly = [], unit = 'C', theme = 'dark' }) => {
  if (!hourly || hourly.length === 0) return null;

  // Prepare chart data (first 16 hours for optimal chart readability)
  const chartData = hourly.slice(0, 16).map((h) => ({
    time: h.timeDisplay,
    temp: unit === 'F' ? h.tempF : h.tempC,
    condition: h.conditionText,
    rainProb: h.rainProb,
  }));

  const temps = chartData.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip glass-card">
          <p className="tooltip-time">{data.time}</p>
          <p className="tooltip-temp">
            {data.temp}°{unit}
          </p>
          <p className="tooltip-condition">{data.condition}</p>
        </div>
      );
    }
    return null;
  };

  const isLight = theme === 'light';
  const strokeColor = '#38bdf8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const textColor = isLight ? '#64748b' : '#94a3b8';

  return (
    <div className="chart-card glass-card">
      <div className="chart-header">
        <h3 className="chart-title">Temperature Trend (°{unit})</h3>
        <span className="chart-subtitle">Next 16 Hours</span>
      </div>

      <div className="chart-wrapper" style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis
              dataKey="time"
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[minTemp, maxTemp]}
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tempGradient)"
              dot={{ r: 3, fill: '#38bdf8', strokeWidth: 1, stroke: '#fff' }}
              activeDot={{ r: 5, fill: '#38bdf8', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;
