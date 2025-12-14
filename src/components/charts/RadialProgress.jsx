import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export default function RadialProgress({ value, maxValue = 100, color = '#10b981', size = 140, label = '', sublabel = '' }) {
  const percentage = Math.round((value / maxValue) * 100);
  
  const data = [
    {
      name: label,
      value: percentage,
      fill: color,
    },
  ];

  return (
    <div className="relative inline-flex items-center justify-center">
      <RadialBarChart
        width={size}
        height={size}
        cx={size / 2}
        cy={size / 2}
        innerRadius={size * 0.35}
        outerRadius={size * 0.5}
        barSize={size * 0.08}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: '#f3f4f6' }}
          dataKey="value"
          cornerRadius={size * 0.05}
          fill={color}
        />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
        {sublabel && <p className="text-xs text-gray-500 font-medium">{sublabel}</p>}
      </div>
    </div>
  );
}
