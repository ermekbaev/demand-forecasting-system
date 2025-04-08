import React, { useState } from 'react';
import ForecastForm from '@/components/Forecasting/ForecastForm';
import TimeSeriesChart from '@/components/Charts/TimeSeriesChart';
import { themeColors } from '@/lib/Theme/Colors';
import { forecastTimeSeries, ForecastOptions, ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';
import { ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';
import { ForecastData } from '@/pages/dashboard/forecasting';

interface CreateForecastTabProps {
  parsedData: ParsedData | null;
  availableFields: string[];
  isLoading: boolean;
  error: string | null;
  setCurrentForecast: (forecast: ForecastResult) => void;
  addToForecastHistory: (forecast: ForecastData) => void;
  loadSampleData: () => Promise<void>;
  setActiveTab: (tab: 'create' | 'results' | 'settings') => void;
}

const CreateForecastTab: React.FC<CreateForecastTabProps> = ({
  parsedData,
  availableFields,
  isLoading: isLoadingProp,
  error,
  setCurrentForecast,
  addToForecastHistory,
  loadSampleData,
  setActiveTab,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(isLoadingProp);
  const [localError, setLocalError] = useState<string | null>(null);

  // Обработка создания прогноза
  const handleGenerateForecast = async (
    dateField: string,
    valueField: string,
    options: ForecastOptions
  ) => {
    try {
      setIsLoading(true);
      setLocalError(null);
      
      if (!parsedData) {
        throw new Error('Нет доступных данных для прогнозирования');
      }
      
      // Преобразуем данные в формат временного ряда
      const timeSeriesData: TimeSeriesPoint[] = parsedData.data
        .map(row => {
          const dateValue = row[dateField];
          const value = Number(row[valueField]);
          
          let date: Date | null = null;
          if (dateValue instanceof Date) {
            date = dateValue;
          } else if (typeof dateValue === 'string') {
            date = new Date(dateValue);
          }
          
          if (date && !isNaN(date.getTime()) && !isNaN(value)) {
            return { date, value };
          }
          return null;
        })
        .filter((item): item is TimeSeriesPoint => item !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      
      if (timeSeriesData.length < 2) {
        throw new Error('Недостаточно данных для прогнозирования. Требуется минимум 2 точки.');
      }
      
      // Выполняем прогнозирование
      const result = forecastTimeSeries(timeSeriesData, options);
      
      // Сохраняем результат в текущий прогноз
      setCurrentForecast(result);
      
      // Добавляем в историю прогнозов
      const newForecast: ForecastData = {
        id: `forecast-${Date.now()}`,
        date: new Date(),
        result,
        dateField,
        valueField,
        options
      };
      
      addToForecastHistory(newForecast);
      
      // Переключаемся на вкладку результатов
      setActiveTab('results');
      
    } catch (err) {
      console.error('Ошибка при создании прогноза:', err);
      setLocalError(err instanceof Error ? err.message : 'Произошла ошибка при создании прогноза');
    } finally {
      setIsLoading(false);
    }
  };

  // Получение первых и последних дат из данных для отображения
  const getDataDateRange = () => {
    if (!parsedData || !parsedData.data.length) return 'Н/Д';
    
    const dates = parsedData.data
      .filter(row => row.date instanceof Date)
      .map(row => row.date as Date)
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length === 0) return 'Н/Д';
    
    return `${dates[0].toLocaleDateString()} - ${dates[dates.length - 1].toLocaleDateString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="card">
          <h2 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Параметры прогноза</h2>
          
          {(error || localError) && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
              <p>{error || localError}</p>
            </div>
          )}
          
          {!parsedData ? (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">Нет данных для прогнозирования</p>
              <button 
                className="px-4 py-2 rounded-md text-white hover:bg-opacity-90 transition-colors"
                style={{ backgroundColor: themeColors.teal }}
                onClick={loadSampleData}
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'Загрузить пример данных'}
              </button>
            </div>
          ) : (
            <ForecastForm 
              fields={availableFields}
              onGenerateForecast={handleGenerateForecast}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card">
          <h2 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Предварительный анализ данных</h2>
          
          {!parsedData ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                Загрузите данные для анализа и прогнозирования.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Исторические данные</h3>
                  <div className="h-64 rounded">
                    {/* Здесь будет график исторических данных */}
                    <div className="bg-gray-100 h-full flex items-center justify-center">
                      <p className="text-black">Выберите поля даты и значения для просмотра графика</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Статистика</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-black mb-1">Количество записей</p>
                      <p className="text-lg font-semibold" style={{ color: themeColors.bluishGray }}>{parsedData.data.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-black mb-1">Доступные поля</p>
                      <p className="text-lg font-semibold" style={{ color: themeColors.bluishGray }}>{parsedData.fields.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-black mb-1">Диапазон дат</p>
                      <p className="text-sm font-semibold" style={{ color: themeColors.bluishGray }}>
                        {getDataDateRange()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateForecastTab;