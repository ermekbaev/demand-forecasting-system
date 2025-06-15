import React from 'react';
import Sparkline, { SparklinePoint } from './Sparkline';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  sparklineData?: SparklinePoint[];
  color?: string;
  icon?: React.ReactNode;
  suffix?: string;
}

/**
 * Компонент статистической карточки с возможностью отображения
 * числового значения, процента изменения и мини-графика тенденции
 */
const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  sparklineData, 
  color = '#622347',
  icon,
  suffix = ''
}) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <div className="card relative overflow-hidden">
      <h3 className="text-lg font-medium mb-2" style={{ color }}>{title}</h3>
      <div className="flex items-end justify-between mb-2">
        <p className="text-3xl font-bold" style={{ color }}>
          {value}{suffix}
        </p>
        {change !== undefined && (
          <span 
            className={`text-sm font-medium px-2 py-1 rounded ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-12 mt-2">
          <Sparkline data={sparklineData} color={color} />
        </div>
      )}
      {icon && (
        <div className="absolute top-3 right-3 opacity-10">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;