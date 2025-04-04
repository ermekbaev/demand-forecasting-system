import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesDataPoint {
  date: Date;
  value: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  height?: number;
  dateFormat?: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  xAxisLabel = 'Дата',
  yAxisLabel = 'Количество',
  title,
  height = 400,
  dateFormat = 'DD.MM.YY'
}) => {
  // Трансформация данных для Recharts
  const chartData = data.map(item => ({
    date: item.date,
    value: item.value,
    // Форматирование даты для отображения
    formattedDate: formatDate(item.date, dateFormat)
  }));

  // Функция для форматирования даты
  function formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const shortYear = year.slice(-2);

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('YY', shortYear);
  }

  // Получение минимального и максимального значения для оси Y с небольшим отступом
  const minValue = Math.floor(Math.min(...data.map(item => item.value)) * 0.9);
  const maxValue = Math.ceil(Math.max(...data.map(item => item.value)) * 1.1);

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate" 
              label={{ 
                value: xAxisLabel, 
                position: 'insideBottomRight', 
                offset: -10 
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[minValue, maxValue]}
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft' 
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, yAxisLabel]}
              labelFormatter={(label) => `Дата: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Значение"
              stroke={themeColors.teal}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart;