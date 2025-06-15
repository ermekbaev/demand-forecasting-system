// components/Forecasting/ForecastResultsWithExport.tsx
import React, { useState } from 'react';
import ForecastChart from '@/components/Charts/ForecastChart';
import ForecastReportExport from '@/components/Forecasting/ForecastReportExport';
import { themeColors } from '@/lib/Theme/Colors';
import { ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';
import { ForecastData } from '@/pages/dashboard/forecasting';

interface ForecastResultsWithExportProps {
  currentForecast: ForecastResult | null;
  forecastHistory: ForecastData[];
  setCurrentForecast: (forecast: ForecastResult) => void;
}

const ForecastResultsWithExport: React.FC<ForecastResultsWithExportProps> = ({
  currentForecast,
  forecastHistory,
  setCurrentForecast
}) => {
  const [showExportPanel, setShowExportPanel] = useState<boolean>(false);
  
  // Отображение метода прогнозирования в читаемом виде
  const getForecastMethodName = (method: string): string => {
    if (method === 'linear') return 'Линейная регрессия';
    if (method === 'arima') return 'ARIMA';
    if (method && method.includes('exp_smoothing')) {
      if (method.includes('simple')) return 'Простое экспоненциальное сглаживание';
      if (method.includes('holt_winters')) return 'Тройное сглаживание (Холта-Винтерса)';
      if (method.includes('holt')) return 'Двойное сглаживание (Холта)';
      return 'Экспоненциальное сглаживание';
    }
    return 'Автоматический';
  };
  
  // Получение стиля для метки точности прогноза
  const getAccuracyLabel = (accuracy: number) => {
    const accuracyPercent = accuracy * 100;
    
    if (accuracyPercent >= 90) {
      return 'bg-green-100 text-green-800';
    } else if (accuracyPercent >= 70) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Результаты прогнозирования</h2>
      
      {currentForecast ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Текущий прогноз</h3>
            <button 
              className="text-sm px-3 py-1 rounded text-white"
              style={{ backgroundColor: themeColors.bluishGray }}
              onClick={() => setShowExportPanel(!showExportPanel)}
            >
              {showExportPanel ? 'Скрыть экспорт' : 'Экспортировать отчет'}
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <ForecastChart 
              historicalData={currentForecast.originalData as TimeSeriesPoint[]}
              forecastData={currentForecast.forecastData as TimeSeriesPoint[]}
              confidenceInterval={currentForecast.confidenceInterval as any}
              title="Прогноз на основе исторических данных"
              forecastInfo={currentForecast}
            />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-black mb-1">Метод прогнозирования</p>
                <p className="text-md font-semibold" style={{ color: themeColors.bluishGray }}>
                  {getForecastMethodName(currentForecast.method)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-black mb-1">Точность модели</p>
                <p className="text-md font-semibold" style={{ color: themeColors.teal }}>
                  {(currentForecast.accuracy * 100).toFixed(2)}%
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-black mb-1">Горизонт прогноза</p>
                <p className="text-md font-semibold" style={{ color: themeColors.bluishGray }}>
                  {currentForecast.forecastData.length} дней
                </p>
              </div>
            </div>
            
            {/* Панель экспорта */}
            {showExportPanel && (
              <div className="mt-4">
                <ForecastReportExport 
                  forecastResult={currentForecast}
                  dateField={forecastHistory.find(f => f.result === currentForecast)?.dateField || 'date'}
                  valueField={forecastHistory.find(f => f.result === currentForecast)?.valueField || 'value'}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-black">
          {forecastHistory.length === 0 ? (
            <p>У вас пока нет прогнозов. Создайте новый прогноз на вкладке "Создать прогноз".</p>
          ) : (
            <p>Выберите прогноз из истории для просмотра.</p>
          )}
        </div>
      )}
      
      {forecastHistory.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>История прогнозов</h3>
          <div className="space-y-4">
            {forecastHistory.map((forecast) => (
              <div 
                key={forecast.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setCurrentForecast(forecast.result)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium text-black">Прогноз от {forecast.date.toLocaleDateString()}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-black">Поля: {forecast.dateField} и {forecast.valueField}</span>
                  </div>
                  <div className="flex items-center">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${getAccuracyLabel(forecast.result.accuracy)}`}
                    >
                      Точность: {(forecast.result.accuracy * 100).toFixed(0)}%
                    </span>
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: 'rgba(98, 35, 71, 0.1)', color: themeColors.teal }}
                    >
                      {getForecastMethodName(forecast.result.method)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Горизонт прогноза: {forecast.result.forecastData.length} дней
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastResultsWithExport;