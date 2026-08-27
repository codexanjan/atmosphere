import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

export const RainChart = ({ hourly = [], theme = 'dark' }) => {
  if (!hourly || hourly.length === 0) return null;

  const chartData = hourly.slice(0, 16).map((h) => ({
    time: h.timeDisplay,
    rainProb: h.rainProb,
    precipMm: h.precipMm,
    condition: h.conditionText,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip glass-card">
          <p className="tooltip-time">{data.time}</p>
          <p className="tooltip-temp" style={{ color: '#0ea5e9' }}>
            Rain Chance: {data.rainProb}%
          </p>
          {data.precipMm > 0 && <p className="tooltip-condition">{data.precipMm} mm expected</p>}
        </div>
      );
    }
    return null;
  };

  const isLight = theme === 'light';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const textColor = isLight ? '#64748b' : '#94a3b8';

  return (
    <div className="chart-card glass-card">
      <div className="chart-header">
        <h3 className="chart-title">Precipitation Probability (%)</h3>
        <span className="chart-subtitle">Next 16 Hours</span>
      </div>

      <div className="chart-wrapper" style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis
              dataKey="time"
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="rainProb" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.rainProb > 50 ? '#0284c7' : entry.rainProb > 20 ? '#38bdf8' : '#93c5fd'}
                  fillOpacity={entry.rainProb > 0 ? 0.85 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RainChart;
