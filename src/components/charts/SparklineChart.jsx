import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function SparklineChart({ data = [], color = '#10b981', height = 60 }) {
  if (!data || data.length === 0) {
    // Generate dummy data for visual consistency
    data = Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 100 }));
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color})`}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
