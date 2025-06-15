import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useData } from '@/Context/DataContext';
import Link from 'next/link';
import { ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';

// Типы для данных графика
interface ChartDataPoint {
  date: string;
  value: number;
  type: 'исторические' | 'прогноз';
}

const ForecastWidget: React.FC = () => {
  const { currentForecast } = useData();
  
  // Если нет прогноза, предлагаем создать
  if (!currentForecast) {
    return (
      <div className="h-full bg-gray-100 rounded flex items-center justify-center flex-col">
        <p className="text-black mb-4">Создайте прогноз для отображения данных</p>
        <Link 
          href="/dashboard/forecasting"
          className="px-4 py-2 rounded-md text-white hover:bg-opacity-90"
          style={{ backgroundColor: themeColors.teal }}
        >
          Перейти к прогнозированию
        </Link>
      </div>
    );
  }

  // Подготовка данных для графика
  const formatDateForChart = (date: Date | string): string => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };
  
  // Объединяем исторические и прогнозные данные
  const prepareChartData = (): ChartDataPoint[] => {
    const chartData: ChartDataPoint[] = [];
    
    if (currentForecast.originalData && Array.isArray(currentForecast.originalData)) {
      // Берем только последние 10 исторических точек для компактности
      const historicalPoints = (currentForecast.originalData as TimeSeriesPoint[])
        .slice(-10)
        .map(point => ({
          date: formatDateForChart(point.date),
          value: point.value,
          type: 'исторические' as const
        }));
        
      chartData.push(...historicalPoints);
    }
    
    if (currentForecast.forecastData && Array.isArray(currentForecast.forecastData)) {
      const forecastPoints = (currentForecast.forecastData as TimeSeriesPoint[])
        .map(point => ({
          date: formatDateForChart(point.date),
          value: point.value,
          type: 'прогноз' as const
        }));
      
      chartData.push(...forecastPoints);
    }
    
    return chartData;
  };
  
  const chartData = prepareChartData();
  
  // Получаем дату разделения между историческими данными и прогнозом
  const getDividerDate = (): string | null => {
    if (!currentForecast.originalData || !Array.isArray(currentForecast.originalData) || currentForecast.originalData.length === 0) {
      return null;
    }
    
    const lastHistoricalPoint = currentForecast.originalData[currentForecast.originalData.length - 1] as TimeSeriesPoint;
    return formatDateForChart(lastHistoricalPoint.date);
  };
  
  const dividerDate = getDividerDate();
  
  // Определяем метод прогнозирования для отображения
  const getMethodName = (method: string | undefined): string => {
    if (!method) return 'Автоматический выбор';
    if (method === 'linear') return 'Линейная регрессия';
    if (method.includes('exp_smoothing')) {
      if (method.includes('simple')) return 'Простое экспоненциальное сглаживание';
      if (method.includes('holt_winters')) return 'Тройное сглаживание (Холта-Винтерса)';
      if (method.includes('holt')) return 'Двойное сглаживание (Холта)';
      return 'Экспоненциальное сглаживание';
    }
    if (method === 'arima') return 'ARIMA';
    return method;
  };
  
  return (
    <div className="h-64 flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Метод: {getMethodName(currentForecast.method)}
        </span>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Точность: {(currentForecast.accuracy * 100).toFixed(1)}%
        </span>
      </div>
      
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickMargin={5}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickMargin={5}
            />
            <Tooltip 
              formatter={(value, name) => [value, name === 'value' ? 'Значение' : name]}
              labelFormatter={(label) => `Дата: ${label}`}
              contentStyle={{ fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Значение"
              stroke={themeColors.teal}
              activeDot={{ r: 4 }}
              dot={{ r: 2 }}
              strokeWidth={2}
            />
            {dividerDate && (
              <ReferenceLine
                x={dividerDate}
                stroke="#666"
                strokeDasharray="3 3"
                label={{ value: 'Сегодня', position: 'top', fontSize: 10, fill: '#666' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 flex justify-end">
        <Link 
          href="/dashboard/forecasting"
          className="text-xs"
          style={{ color: themeColors.teal }}
        >
          Подробнее →
        </Link>
      </div>
    </div>
  );
};

export default ForecastWidget;