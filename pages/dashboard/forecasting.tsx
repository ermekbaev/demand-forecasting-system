import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ForecastForm from '@/components/Forecasting/ForecastForm';
import ForecastChart from '@/components/Charts/ForecastChart';
import { themeColors } from '@/lib/Theme/Colors';
import { forecastTimeSeries, ForecastOptions, ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';
import { ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';

interface ForecastData {
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
    try {
      // Проверяем наличие данных
      const savedDataStr = localStorage.getItem('parsedData');
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);
        
        // Восстанавливаем даты (они сохраняются как строки в localStorage)
        if (savedData.data && Array.isArray(savedData.data)) {
          savedData.data = savedData.data.map((row: any) => {
            const newRow: ParsedDataRow = { ...row };
            
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
        
        setParsedData(savedData);
        setAvailableFields(savedData.fields || []);
      }
      
      // Проверяем наличие истории прогнозов
      const savedForecastsStr = localStorage.getItem('forecastHistory');
      if (savedForecastsStr) {
        const savedForecasts = JSON.parse(savedForecastsStr);
        
        // Восстанавливаем даты
        const restoredForecasts = savedForecasts.map((forecast: any) => {
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
        
        setForecastHistory(restoredForecasts);
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Не удалось загрузить сохраненные данные.');
    }
  }, []);

  // Обработка создания прогноза
  const handleGenerateForecast = async (
    dateField: string,
    valueField: string,
    options: ForecastOptions
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
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
      
      const updatedHistory = [newForecast, ...forecastHistory];
      setForecastHistory(updatedHistory);
      
      // Сохраняем историю в localStorage
      localStorage.setItem('forecastHistory', JSON.stringify(updatedHistory));
      
      // Переключаемся на вкладку результатов
      setActiveTab('results');
      
    } catch (err) {
      console.error('Ошибка при создании прогноза:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании прогноза');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка примера данных
  const loadSampleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Здесь должен быть код для загрузки примера данных
      // В реальном приложении эти данные могут быть получены с сервера
      const response = await fetch('/sample-data/sales-history.csv');
      const text = await response.text();
      
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card">
              <h2 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Параметры прогноза</h2>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                  <p>{error}</p>
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
                          {parsedData.data.length > 0 ? (
                            <>
                              {new Date(parsedData.data[0].date || '').toLocaleDateString()} - {new Date(parsedData.data[parsedData.data.length - 1].date || '').toLocaleDateString()}
                            </>
                            ) : 'Н/Д'}
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
      )}
  
      {/* Вкладка результатов прогнозов */}
      {activeTab === 'results' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Результаты прогнозирования</h2>
          
          {currentForecast ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Текущий прогноз</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <ForecastChart 
                  historicalData={currentForecast.originalData as TimeSeriesPoint[]}
                  forecastData={currentForecast.forecastData as TimeSeriesPoint[]}
                  confidenceInterval={currentForecast.confidenceInterval as any}
                  title="Прогноз на основе исторических данных"
                />
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-black mb-1">Метод прогнозирования</p>
                    <p className="text-md font-semibold" style={{ color: themeColors.bluishGray }}>
                      {currentForecast.method === 'linear' ? 'Линейная регрессия' : 
                       currentForecast.method === 'exp_smoothing' ? 'Экспоненциальное сглаживание' : 
                       currentForecast.method === 'arima' ? 'ARIMA' : 'Автоматический'}
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
              <h3 className="text-sm font-medium mb-2">История прогнозов</h3>
              <div className="space-y-4">
                {forecastHistory.map((forecast) => (
                  <div key={forecast.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setCurrentForecast(forecast.result)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-sm font-medium">Прогноз от {forecast.date.toLocaleDateString()}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-black">Поля: {forecast.dateField} и {forecast.valueField}</span>
                      </div>
                      <div className="flex items-center">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full mr-2 bg-green-100 text-green-800"
                        >
                          Точность: {(forecast.result.accuracy * 100).toFixed(0)}%
                        </span>
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ backgroundColor: 'rgba(98, 35, 71, 0.1)', color: themeColors.teal }}
                        >
                          {forecast.result.method === 'linear' ? 'Линейная регрессия' : 
                          forecast.result.method === 'exp_smoothing' ? 'Экспоненциальное сглаживание' : 
                          forecast.result.method === 'arima' ? 'ARIMA' : 'Автоматический'}
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
      )}
  
      {/* Вкладка настроек моделей */}
      {activeTab === 'settings' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Настройки моделей прогнозирования</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Линейная регрессия</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество факторов
                </label>
                <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="auto">Автоматически</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Регуляризация
                </label>
                <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="none">Нет</option>
                  <option value="l1">L1 (Lasso)</option>
                  <option value="l2">L2 (Ridge)</option>
                  <option value="elastic">Elastic Net</option>
                </select>
              </div>
            </div>
          </div>
  
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">ARIMA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  p (AR порядок)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  defaultValue="1"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  d (разность)
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  defaultValue="1"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  q (MA порядок)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  defaultValue="1"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">Использовать автоматический подбор параметров</span>
              </label>
            </div>
          </div>
  
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Экспоненциальное сглаживание</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип модели
                </label>
                <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="simple">Простое сглаживание</option>
                  <option value="holt">Двойное (Холта)</option>
                  <option value="holt_winters">Тройное (Холта-Винтерса)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alpha (уровень)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.2"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
  
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Общие настройки</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">Автоматически выбирать лучшую модель</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">Включать доверительные интервалы</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Сохранять все промежуточные расчеты</span>
                </label>
              </div>
            </div>
          </div>
  
          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              Сбросить настройки
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ForecastingPage;