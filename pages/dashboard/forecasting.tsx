import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';
import { ForecastOptions, ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';
import { ParsedData } from '@/lib/Data/csvParser';

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

  // Состояния для данных и прогнозирования
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentForecast, setCurrentForecast] = useState<ForecastResult | null>(null);
  const [forecastHistory, setForecastHistory] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Получение данных из локального хранилища при загрузке страницы
  useEffect(() => {
    loadSavedData();
  }, []);

  // Загрузка сохраненных данных из localStorage
  const loadSavedData = () => {
    try {
      // Загрузка основных данных
      const savedDataStr = localStorage.getItem('parsedData');
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);
        // Восстанавливаем даты в данных
        restoreDatesInParsedData(savedData);
        setParsedData(savedData);
        setAvailableFields(savedData.fields || []);
      }
      
      // Загрузка истории прогнозов
      const savedForecastsStr = localStorage.getItem('forecastHistory');
      if (savedForecastsStr) {
        const savedForecasts = JSON.parse(savedForecastsStr);
        const restoredForecasts = restoreDatesInForecastHistory(savedForecasts);
        setForecastHistory(restoredForecasts);
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Не удалось загрузить сохраненные данные.');
    }
  };

  // Восстановление дат в данных
  const restoreDatesInParsedData = (savedData: any) => {
    if (savedData.data && Array.isArray(savedData.data)) {
      savedData.data = savedData.data.map((row: any) => {
        const newRow = { ...row };
        
        // Преобразуем строковые даты обратно в объекты Date
        Object.keys(newRow).forEach(key => {
          const value = newRow[key];
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            newRow[key] = new Date(value);
          }
        });
        
        return newRow;
      });
    }
    return savedData;
  };

  // Восстановление дат в истории прогнозов
  const restoreDatesInForecastHistory = (savedForecasts: any[]) => {
    return savedForecasts.map((forecast: any) => {
      const restoredForecast = { ...forecast };
      
      // Восстанавливаем основную дату
      restoredForecast.date = new Date(forecast.date);
      
      // Восстанавливаем даты в результатах
      if (forecast.result.originalData) {
        restoredForecast.result.originalData = forecast.result.originalData.map(
          (item: any) => ({ ...item, date: new Date(item.date) })
        );
      }
      
      if (forecast.result.forecastData) {
        restoredForecast.result.forecastData = forecast.result.forecastData.map(
          (item: any) => ({ ...item, date: new Date(item.date) })
        );
      }
      
      if (forecast.result.confidenceInterval) {
        if (forecast.result.confidenceInterval.upper) {
          restoredForecast.result.confidenceInterval.upper = forecast.result.confidenceInterval.upper.map(
            (item: any) => ({ ...item, date: new Date(item.date) })
          );
        }
        
        if (forecast.result.confidenceInterval.lower) {
          restoredForecast.result.confidenceInterval.lower = forecast.result.confidenceInterval.lower.map(
            (item: any) => ({ ...item, date: new Date(item.date) })
          );
        }
      }
      
      return restoredForecast;
    });
  };

  // Добавление нового прогноза в историю
  const addToForecastHistory = (newForecast: ForecastData) => {
    const updatedHistory = [newForecast, ...forecastHistory];
    setForecastHistory(updatedHistory);
    localStorage.setItem('forecastHistory', JSON.stringify(updatedHistory));
  };

  // Загрузка примера данных
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
      setAvailableFields(sampleData.fields);
      
      // Сохраняем данные в localStorage
      localStorage.setItem('parsedData', JSON.stringify(sampleData));
      
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
          availableFields={availableFields}
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