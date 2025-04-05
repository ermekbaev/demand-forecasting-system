import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ReferenceLine,
  LegendType
} from 'recharts';

// Определяем интерфейс для точки временного ряда
export interface TimeSeriesPoint {
  date: Date;
  value: number;
}

interface ForecastChartProps {
  historicalData: TimeSeriesPoint[];
  forecastData: TimeSeriesPoint[];
  confidenceInterval?: {
    upper: TimeSeriesPoint[];
    lower: TimeSeriesPoint[];
    confidence: number;
  };
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  dateFormat?: string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({
  historicalData,
  forecastData,
  confidenceInterval,
  title = 'Прогноз',
  xAxisLabel = 'Дата',
  yAxisLabel = 'Значение',
  height = 400,
  dateFormat = 'DD.MM.YY'
}) => {
  // Форматирование даты для отображения
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const shortYear = year.slice(-2);

    return dateFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('YY', shortYear);
  };

  // Подготовка данных для графика
  const prepareChartData = () => {
    // Преобразуем исторические данные
    const historicalPoints = historicalData.map(item => ({
      date: item.date,
      formattedDate: formatDate(item.date),
      historical: item.value,
      forecast: null,
      upper: null,
      lower: null
    }));

    // Получаем последнюю историческую дату
    const dividerDate = historicalData[historicalData.length - 1].date;
    
    // Преобразуем прогнозные данные
    const forecastPoints = forecastData.map(item => ({
      date: item.date,
      formattedDate: formatDate(item.date),
      historical: null,
      forecast: item.value,
      upper: confidenceInterval ? 
        confidenceInterval.upper.find(p => p.date.getTime() === item.date.getTime())?.value : null,
      lower: confidenceInterval ? 
        confidenceInterval.lower.find(p => p.date.getTime() === item.date.getTime())?.value : null
    }));

    // Объединяем данные и сортируем по дате
    return [...historicalPoints, ...forecastPoints].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  };

  const chartData = prepareChartData();

  // Нахождение минимального и максимального значений для осей
  const allValues = chartData.flatMap(item => [
    item.historical, 
    item.forecast, 
    item.upper, 
    item.lower
  ]).filter(value => value !== null) as number[];

  const minValue = Math.floor(Math.min(...allValues) * 0.9);
  const maxValue = Math.ceil(Math.max(...allValues) * 1.1);
  
  // Последняя дата исторических данных для отображения разделительной линии
  const dividerDate = historicalData[historicalData.length - 1].date;

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
              formatter={(value: any, name: string) => {
                if (name === 'historical') return [`${value}`, 'Исторические данные'];
                if (name === 'forecast') return [`${value}`, 'Прогноз'];
                if (name === 'ci') return [`${value}`, 'Доверительный интервал'];
                return [`${value}`, name];
              }}
              labelFormatter={(label) => `Дата: ${label}`}
            />
            <Legend 
              payload={[
                { value: 'Исторические данные', type: 'line', color: themeColors.bluishGray },
                { value: 'Прогноз', type: 'line', color: themeColors.teal },
                ...(confidenceInterval ? [{ value: `Доверительный интервал (${confidenceInterval.confidence * 100}%)`, type: 'area', color: themeColors.gray }] : [])
              ].map(item => ({
                value: item.value,
                type: item.type as LegendType,
                color: item.color
              }))}
            />
            
            {/* Разделительная линия между историческими данными и прогнозом */}
            <ReferenceLine 
              x={formatDate(dividerDate)} 
              stroke="#666" 
              strokeDasharray="3 3" 
              label={{ value: 'Сегодня', position: 'insideTopRight', fill: '#666', fontSize: 12 }}
            />
            
            {/* Исторические данные */}
            <Line
              type="monotone"
              dataKey="historical"
              name="Исторические данные"
              stroke={themeColors.bluishGray}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            
            {/* Прогноз */}
            <Line
              type="monotone"
              dataKey="forecast"
              name="Прогноз"
              stroke={themeColors.teal}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            
            {/* Доверительный интервал */}
            {confidenceInterval && (
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill={themeColors.gray}
                fillOpacity={0.2}
                name="ci"
              />
            )}
            
            {confidenceInterval && (
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill={themeColors.gray}
                fillOpacity={0.2}
                name="ci"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Статистика прогноза */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Исторический период: {formatDate(historicalData[0].date)} - {formatDate(historicalData[historicalData.length - 1].date)}</p>
        <p>Прогнозный период: {formatDate(forecastData[0].date)} - {formatDate(forecastData[forecastData.length - 1].date)}</p>
      </div>
    </div>
  );
};

export default ForecastChart;