import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Тип данных для спарклайна
export interface SparklinePoint {
  value: number;
  index: number;
}

interface SparklineProps {
  data: SparklinePoint[];
  color: string;
  height?: number;
  width?: string | number;
  showTooltip?: boolean;
  valueSuffix?: string;
}

/**
 * Компонент спарклайна для отображения мини-графиков тенденций
 */
const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color, 
  height = 50, 
  width = '100%',
  showTooltip = true,
  valueSuffix = ''
}) => {
  if (!data || data.length === 0) {
    return null;
  }
  
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        {showTooltip && (
          <Tooltip
            formatter={(value: number) => [`${value}${valueSuffix}`, '']}
            labelFormatter={() => ''}
            contentStyle={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '4px', 
              border: 'none',
              fontSize: '12px',
              padding: '4px 8px'
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;