import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';
import { ForecastOptions, ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';
import { ParsedData } from '@/lib/Data/csvParser';
import { useData } from '@/Context/DataContext';


// Импорт новых компонентов для вкладок
import CreateForecastTab from '@/components/Forecasting/CreateForecast';
import ForecastResultsTab from '@/components/Forecasting/ForecastResults';
import ForecastSettingsTab from '@/components/Forecasting/ForecastSettings';

// Интерфейс для истории прогнозов
export interface ForecastData {
  id: string;
  date: Date;
  result: ForecastResult;
  dateField: string;
  valueField: string;
  options: ForecastOptions;
}

const ForecastingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'results' | 'settings'>('create');

  // Используем контекст данных вместо локального состояния
  const {
    parsedData,
    setParsedData,
    selectedDateField,
    selectedValueField,
    timeSeriesData,
    isLoading,
    setIsLoading,
    currentForecast,
    setCurrentForecast,
    forecastHistory,
    addToForecastHistory,
    error,
    setError
  } = useData();

  // Функция для загрузки примера данных, если нет данных
  const loadSampleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Имитация парсинга CSV
      const sampleData: ParsedData = {
        data: [
          { date: new Date('2023-01-01'), product_id: 1001, quantity: 15, revenue: 45000 },
          { date: new Date('2023-01-02'), product_id: 1001, quantity: 18, revenue: 54000 },
          { date: new Date('2023-01-03'), product_id: 1001, quantity: 12, revenue: 36000 },
          { date: new Date('2023-01-04'), product_id: 1001, quantity: 20, revenue: 60000 },
          { date: new Date('2023-01-05'), product_id: 1001, quantity: 22, revenue: 66000 },
          { date: new Date('2023-01-06'), product_id: 1001, quantity: 16, revenue: 48000 },
          { date: new Date('2023-01-07'), product_id: 1001, quantity: 10, revenue: 30000 },
          { date: new Date('2023-01-08'), product_id: 1001, quantity: 14, revenue: 42000 },
          { date: new Date('2023-01-09'), product_id: 1001, quantity: 19, revenue: 57000 },
          { date: new Date('2023-01-10'), product_id: 1001, quantity: 21, revenue: 63000 },
          { date: new Date('2023-01-11'), product_id: 1001, quantity: 17, revenue: 51000 },
          { date: new Date('2023-01-12'), product_id: 1001, quantity: 15, revenue: 45000 },
          { date: new Date('2023-01-13'), product_id: 1001, quantity: 14, revenue: 42000 },
          { date: new Date('2023-01-14'), product_id: 1001, quantity: 11, revenue: 33000 },
          { date: new Date('2023-01-15'), product_id: 1001, quantity: 13, revenue: 39000 },
          { date: new Date('2023-01-16'), product_id: 1001, quantity: 17, revenue: 51000 },
          { date: new Date('2023-01-17'), product_id: 1001, quantity: 19, revenue: 57000 },
          { date: new Date('2023-01-18'), product_id: 1001, quantity: 20, revenue: 60000 },
          { date: new Date('2023-01-19'), product_id: 1001, quantity: 18, revenue: 54000 },
          { date: new Date('2023-01-20'), product_id: 1001, quantity: 16, revenue: 48000 },
          { date: new Date('2023-01-21'), product_id: 1001, quantity: 13, revenue: 39000 },
          { date: new Date('2023-01-22'), product_id: 1001, quantity: 15, revenue: 45000 },
          { date: new Date('2023-01-23'), product_id: 1001, quantity: 20, revenue: 60000 },
          { date: new Date('2023-01-24'), product_id: 1001, quantity: 23, revenue: 69000 },
          { date: new Date('2023-01-25'), product_id: 1001, quantity: 22, revenue: 66000 },
          { date: new Date('2023-01-26'), product_id: 1001, quantity: 21, revenue: 63000 },
          { date: new Date('2023-01-27'), product_id: 1001, quantity: 19, revenue: 57000 },
          { date: new Date('2023-01-28'), product_id: 1001, quantity: 15, revenue: 45000 },
          { date: new Date('2023-01-29'), product_id: 1001, quantity: 14, revenue: 42000 },
          { date: new Date('2023-01-30'), product_id: 1001, quantity: 18, revenue: 54000 },
        ],
        fields: ['date', 'product_id', 'quantity', 'revenue'],
        errors: [],
        meta: { delimiter: ',', linebreak: '\n', aborted: false, truncated: false, cursor: 0 }
      };
      
      setParsedData(sampleData);
      
    } catch (err) {
      console.error('Ошибка при загрузке примера данных:', err);
      setError('Не удалось загрузить пример данных.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Прогнозирование">
      {/* Навигация по вкладкам */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'create'
                ? `border-current text-current`
                : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
            style={activeTab === 'create' ? { color: themeColors.teal } : {}}
          >
            Создать прогноз
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'results'
                ? `border-current text-current`
                : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'results' ? { color: themeColors.teal } : {}}
          >
            Результаты прогнозов
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'settings'
                ? `border-current text-current`
                : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'settings' ? { color: themeColors.teal } : {}}
          >
            Настройки моделей
          </button>
        </nav>
      </div>
  
      {/* Вкладка создания прогноза */}
      {activeTab === 'create' && (
        <CreateForecastTab 
          parsedData={parsedData}
          availableFields={parsedData?.fields || []}
          isLoading={isLoading}
          error={error}
          setCurrentForecast={setCurrentForecast}
          addToForecastHistory={addToForecastHistory}
          loadSampleData={loadSampleData}
          setActiveTab={setActiveTab}
        />
      )}
  
      {/* Вкладка результатов прогнозов */}
      {activeTab === 'results' && (
        <ForecastResultsTab 
          currentForecast={currentForecast}
          forecastHistory={forecastHistory}
          setCurrentForecast={setCurrentForecast}
        />
      )}
  
      {/* Вкладка настроек моделей */}
      {activeTab === 'settings' && (
        <ForecastSettingsTab />
      )}
    </DashboardLayout>
  );
}

export default ForecastingPage;