import React, { useState } from 'react';
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
import { ForecastResult } from '@/lib/Forecast';

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
  forecastInfo?: ForecastResult;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  dateFormat?: string;
  showMethodSelector?: boolean;
}

const ForecastChart: React.FC<ForecastChartProps> = ({
  historicalData,
  forecastData,
  confidenceInterval,
  forecastInfo,
  title = 'Прогноз',
  xAxisLabel = 'Дата',
  yAxisLabel = 'Значение',
  height = 400,
  dateFormat = 'DD.MM.YY',
  showMethodSelector = false
}) => {
  // Добавляем состояние для выбора метода прогнозирования
  const [forecastMethod, setForecastMethod] = useState<'linear' | 'exp_smoothing' | 'arima' | 'auto'>('auto');
  
  // Функция для запуска переобучения модели
  const handleMethodChange = (method: 'linear' | 'exp_smoothing' | 'arima' | 'auto') => {
    setForecastMethod(method);
    // Здесь можно добавить логику для перезапуска прогнозирования с новым методом
    // Например, вызов колбэка onMethodChange, который передается через пропсы
  };

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

  // Отображение имени метода прогнозирования в читаемом виде
  const getMethodName = (method: string): string => {
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-black">{title}</h3>
        
        {showMethodSelector && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Метод прогнозирования:</span>
            <select
              className="py-1 px-3 border border-gray-300 rounded-md text-sm"
              value={forecastMethod}
              onChange={(e) => handleMethodChange(e.target.value as any)}
              style={{ color: themeColors.darkTeal }}
            >
              <option value="auto">Автоматический выбор</option>
              <option value="linear">Линейная регрессия</option>
              <option value="exp_smoothing">Экспоненциальное сглаживание</option>
              <option value="arima">ARIMA</option>
            </select>
          </div>
        )}
      </div>
      
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
      
      {/* Информация о прогнозе */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Исторический период: {formatDate(historicalData[0].date)} - {formatDate(historicalData[historicalData.length - 1].date)}</p>
          <p className="text-gray-600">Прогнозный период: {formatDate(forecastData[0].date)} - {formatDate(forecastData[forecastData.length - 1].date)}</p>
        </div>
        
        {forecastInfo && (
          <>
            <div>
              <p className="text-gray-600">Метод прогнозирования: {getMethodName(forecastInfo.method)}</p>
              <p className="text-gray-600">Точность модели: {(forecastInfo.accuracy * 100).toFixed(2)}%</p>
            </div>
            
            <div>
              {forecastInfo.method === 'linear' && forecastInfo.parameters && (
                <>
                  <p className="text-gray-600">Коэффициент наклона: {forecastInfo.parameters.slope.toFixed(4)}</p>
                  <p className="text-gray-600">Свободный член: {forecastInfo.parameters.intercept.toFixed(4)}</p>
                </>
              )}
              
              {forecastInfo.method.includes('exp_smoothing') && forecastInfo.parameters && (
                <>
                  <p className="text-gray-600">Alpha: {forecastInfo.parameters.alpha.toFixed(3)}</p>
                  {forecastInfo.parameters.beta !== undefined && (
                    <p className="text-gray-600">Beta: {forecastInfo.parameters.beta.toFixed(3)}</p>
                  )}
                  {forecastInfo.parameters.gamma !== undefined && (
                    <p className="text-gray-600">Gamma: {forecastInfo.parameters.gamma.toFixed(3)}</p>
                  )}
                </>
              )}
              
              {forecastInfo.method === 'arima' && forecastInfo.parameters && (
                <p className="text-gray-600">Параметры модели: p={forecastInfo.parameters.p}, d={forecastInfo.parameters.d}, q={forecastInfo.parameters.q}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForecastChart;