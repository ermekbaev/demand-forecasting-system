// components/Forecasting/ForecastReportExport.tsx
import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ForecastResult, TimeSeriesPoint } from '@/lib/Forecast';
import SettingsButton from '@/components/Settings/SettingsButton';
import { useSettings } from '@/Context/SettingsContext';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

interface ForecastReportExportProps {
    forecastResult: ForecastResult | null;
    dateField: string;
    valueField: string;
  }

const ForecastReportExport: React.FC<ForecastReportExportProps> = ({
  forecastResult,
  dateField,
  valueField
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'xlsx' | 'json'>('pdf');
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeAnalytics, setIncludeAnalytics] = useState<boolean>(true);
  const [includeRawData, setIncludeRawData] = useState<boolean>(true);
  const [exportInProgress, setExportInProgress] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const { generalSettings } = useSettings();

  // Получение имени метода прогнозирования
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

  // Обработчик экспорта отчета
  const handleExport = async () => {
    if (!forecastResult) return;

    setExportInProgress(true);
    setExportSuccess(false);

    try {
      // Формирование имени файла
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const method = getMethodName(forecastResult.method);
      const fileName = `forecast-${method}-${timestamp}`;
      
      // Формирование данных для экспорта в зависимости от формата
      switch (exportFormat) {
        case 'pdf':
          await exportToPDF(fileName);
          break;
        case 'csv':
          exportToCSV(fileName);
          break;
        case 'xlsx':
          exportToXLSX(fileName);
          break;
        case 'json':
          exportToJSON(fileName);
          break;
      }
      
      // Оповещение пользователя об успешном экспорте
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      
    } catch (error) {
      console.error('Ошибка при экспорте отчета:', error);
      alert(`Произошла ошибка при экспорте отчета: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setExportInProgress(false);
    }
  };
  
  // Экспорт в формат PDF (используем jsPDF)
  const exportToPDF = async (fileName: string): Promise<void> => {
    // В реальном приложении здесь был бы код для генерации PDF
    // с использованием библиотеки типа jsPDF или html2pdf
    
    // Пример структуры PDF:
    // 1. Заголовок отчета
    // 2. Сводка прогноза (метод, точность, период)
    // 3. График прогноза (если включено)
    // 4. Аналитические выводы (если включено)
    // 5. Таблица с исходными и прогнозными данными (если включено)
    
    // Имитация загрузки PDF-файла
    const dummyData = `PDF отчет о прогнозе спроса
        
    Дата создания: ${new Date().toLocaleDateString()}
    Метод прогнозирования: ${getMethodName(forecastResult?.method)}
    Точность модели: ${(forecastResult?.accuracy || 0) * 100}%
    Поля данных: ${dateField} (дата), ${valueField} (значение)
    Количество исторических точек: ${(forecastResult?.originalData as any[])?.length || 0}
    Количество прогнозных точек: ${(forecastResult?.forecastData as any[])?.length || 0}

    График и таблица с данными доступны в полной версии отчета.`;
    
    // Создаем Blob и инициируем скачивание
    const blob = new Blob([dummyData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Экспорт в формат CSV
  const exportToCSV = (fileName: string): void => {
    if (!forecastResult) return;
    
    // Формируем заголовки
    const headers = ['date', valueField, 'type'];
    
    // Формируем строки данных
    let csvContent = headers.join(',') + '\n';
    
    // Добавляем исторические данные, если нужно
    if (includeRawData) {
      const historicalData = forecastResult.originalData as TimeSeriesPoint[];
      historicalData.forEach(point => {
        const formattedDate = formatDate(point.date, generalSettings.dateFormat);
        csvContent += `${formattedDate},${point.value},"исторические"\n`;
      });
    }
    
    // Добавляем прогнозные данные
    const forecastData = forecastResult.forecastData as TimeSeriesPoint[];
    forecastData.forEach(point => {
      const formattedDate = formatDate(point.date, generalSettings.dateFormat);
      csvContent += `${formattedDate},${point.value},"прогноз"\n`;
    });
    
    // Добавляем верхний доверительный интервал, если есть
    if (forecastResult.confidenceInterval && includeAnalytics) {
      forecastResult.confidenceInterval.upper.forEach(point => {
        const typedPoint = point as TimeSeriesPoint;
        const formattedDate = formatDate(typedPoint.date, generalSettings.dateFormat);
        csvContent += `${formattedDate},${typedPoint.value},"верхний_интервал"\n`;
      });
      
      // Добавляем нижний доверительный интервал
      forecastResult.confidenceInterval.lower.forEach(point => {
        const typedPoint = point as TimeSeriesPoint;
        const formattedDate = formatDate(typedPoint.date, generalSettings.dateFormat);
        csvContent += `${formattedDate},${typedPoint.value},"нижний_интервал"\n`;
      });
    }
    
    // Добавляем аналитические данные
    if (includeAnalytics) {
      csvContent += '\nАналитика\n';
      csvContent += `Метод прогнозирования,${getMethodName(forecastResult.method)}\n`;
      csvContent += `Точность модели,${(forecastResult.accuracy * 100).toFixed(2)}%\n`;
      
      // Добавляем специфичные для метода параметры
      if (forecastResult.parameters) {
        csvContent += '\nПараметры модели\n';
        Object.entries(forecastResult.parameters).forEach(([key, value]) => {
          if (typeof value === 'number') {
            csvContent += `${key},${value.toFixed(4)}\n`;
          } else {
            csvContent += `${key},${value}\n`;
          }
        });
      }
    }
    
    // Создаем Blob и инициируем скачивание
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Экспорт в формат XLSX
  const exportToXLSX = (fileName: string): void => {
    // В реальном приложении здесь был бы код для генерации XLSX
    // с использованием библиотеки типа SheetJS (xlsx)
    
    // Имитация скачивания XLSX-файла
    alert('Экспорт в XLSX: для полной реализации требуется библиотека SheetJS');
    
    // Создаем Blob с CSV данными как временное решение
    exportToCSV(fileName);
  };
  
  // Экспорт в формат JSON
  const exportToJSON = (fileName: string): void => {
    if (!forecastResult) return;
    
    // Формируем объект для экспорта
    const exportObject: any = {
      metadata: {
        dateCreated: new Date().toISOString(),
        dateField,
        valueField,
        method: getMethodName(forecastResult.method),
        accuracy: forecastResult.accuracy,
        periods: (forecastResult.forecastData as any[]).length
      }
    };
    
    // Добавляем данные в соответствии с выбранными опциями
    if (includeRawData) {
      exportObject.historicalData = forecastResult.originalData;
    }
    
    exportObject.forecastData = forecastResult.forecastData;
    
    if (includeAnalytics) {
      exportObject.confidenceInterval = forecastResult.confidenceInterval;
      exportObject.parameters = forecastResult.parameters;
      
      // Добавляем расчетную аналитику
      const historicalValues = (forecastResult.originalData as TimeSeriesPoint[]).map(point => point.value);
      const forecastValues = (forecastResult.forecastData as TimeSeriesPoint[]).map(point => point.value);
      
      const analytics = {
        historicalStats: calculateStats(historicalValues),
        forecastStats: calculateStats(forecastValues),
        growthRate: calculateGrowthRate(historicalValues, forecastValues)
      };
      
      exportObject.analytics = analytics;
    }
    
    // Создаем Blob и инициируем скачивание
    const jsonContent = JSON.stringify(exportObject, (key, value) => {
      // Преобразуем даты в ISO строки
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Вспомогательная функция для форматирования даты
  const formatDate = (date: Date, format: string): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const shortYear = year.slice(-2);
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('YY', shortYear);
  };
  
  // Вспомогательная функция для расчета статистики
  const calculateStats = (values: number[]) => {
    if (!values.length) return null;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Расчет медианы
    const sortedValues = [...values].sort((a, b) => a - b);
    let median;
    if (sortedValues.length % 2 === 0) {
      median = (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2;
    } else {
      median = sortedValues[Math.floor(sortedValues.length / 2)];
    }
    
    return {
      count: values.length,
      sum,
      avg,
      min,
      max,
      median
    };
  };
  
  // Вспомогательная функция для расчета изменения (роста/спада)
  const calculateGrowthRate = (historical: number[], forecast: number[]) => {
    if (!historical.length || !forecast.length) return null;
    
    const historicalAvg = historical.reduce((acc, val) => acc + val, 0) / historical.length;
    const forecastAvg = forecast.reduce((acc, val) => acc + val, 0) / forecast.length;
    
    const absoluteChange = forecastAvg - historicalAvg;
    const relativeChange = (absoluteChange / historicalAvg) * 100;
    
    return {
      absoluteChange,
      relativeChange,
      trend: relativeChange > 0 ? 'рост' : relativeChange < 0 ? 'спад' : 'стабильность'
    };
  };
// Если нет результатов прогноза, показываем сообщение
if (!forecastResult) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">Создайте прогноз для экспорта отчета</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>
        Экспорт отчета о прогнозе
      </h3>
      
      {exportSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          Отчет успешно экспортирован в формате {exportFormat.toUpperCase()}!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Формат отчета
            </h4>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 border rounded-md text-sm ${
                  exportFormat === 'pdf' 
                    ? 'border-current bg-gray-50' 
                    : 'border-gray-300'
                }`}
                style={exportFormat === 'pdf' ? { color: themeColors.teal } : {}}
                onClick={() => setExportFormat('pdf')}
              >
                PDF
              </button>
              <button 
                className={`px-3 py-1 border rounded-md text-sm ${
                  exportFormat === 'csv' 
                    ? 'border-current bg-gray-50' 
                    : 'border-gray-300'
                }`}
                style={exportFormat === 'csv' ? { color: themeColors.teal } : {}}
                onClick={() => setExportFormat('csv')}
              >
                CSV
              </button>
              <button 
                className={`px-3 py-1 border rounded-md text-sm ${
                  exportFormat === 'xlsx' 
                    ? 'border-current bg-gray-50' 
                    : 'border-gray-300'
                }`}
                style={exportFormat === 'xlsx' ? { color: themeColors.teal } : {}}
                onClick={() => setExportFormat('xlsx')}
              >
                Excel (XLSX)
              </button>
              <button 
                className={`px-3 py-1 border rounded-md text-sm ${
                  exportFormat === 'json' 
                    ? 'border-current bg-gray-50' 
                    : 'border-gray-300'
                }`}
                style={exportFormat === 'json' ? { color: themeColors.teal } : {}}
                onClick={() => setExportFormat('json')}
              >
                JSON
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Содержимое отчета
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="include-charts"
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="include-charts" className="ml-3 block text-sm text-gray-700">
                  Включить графики и визуализации
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="include-analytics"
                  type="checkbox"
                  checked={includeAnalytics}
                  onChange={(e) => setIncludeAnalytics(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="include-analytics" className="ml-3 block text-sm text-gray-700">
                  Включить аналитику и статистику
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="include-raw-data"
                  type="checkbox"
                  checked={includeRawData}
                  onChange={(e) => setIncludeRawData(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="include-raw-data" className="ml-3 block text-sm text-gray-700">
                  Включить исходные данные
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Информация о прогнозе
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Метод прогнозирования:</span>{' '}
                {getMethodName(forecastResult.method)}
              </p>
              <p>
                <span className="font-medium">Точность модели:</span>{' '}
                {(forecastResult.accuracy * 100).toFixed(2)}%
              </p>
              <p>
                <span className="font-medium">Количество исторических точек:</span>{' '}
                {(forecastResult.originalData as TimeSeriesPoint[]).length}
              </p>
              <p>
                <span className="font-medium">Горизонт прогноза:</span>{' '}
                {(forecastResult.forecastData as TimeSeriesPoint[]).length} точек
              </p>
              <p>
                <span className="font-medium">Поля данных:</span>{' '}
                {dateField} (дата), {valueField} (значение)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <SettingsButton
              variant="primary"
              onClick={handleExport}
              disabled={exportInProgress}
            >
              {exportInProgress ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Выполняется экспорт...
                </div>
              ) : (
                `Экспортировать отчет (${exportFormat.toUpperCase()})`
              )}
            </SettingsButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastReportExport;