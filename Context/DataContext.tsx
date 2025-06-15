import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';
import { ValidationResult } from '@/lib/Data/dataValidator';
import { ForecastData } from '@/pages/dashboard/forecasting';

// Интерфейс для контекста данных
interface DataContextType {
  // Данные о CSV
  parsedData: ParsedData | null;
  setParsedData: (data: ParsedData | null) => void;
  
  // Отфильтрованные данные
  filteredData: ParsedDataRow[];
  setFilteredData: (data: ParsedDataRow[]) => void;
  
  // Результаты валидации
  validationResult: ValidationResult | null;
  setValidationResult: (result: ValidationResult | null) => void;
  
  // Временной ряд данных
  timeSeriesData: Array<{ date: Date; value: number }>;
  setTimeSeriesData: (data: Array<{ date: Date; value: number }>) => void;
  
  // Выбранные поля
  selectedDateField: string;
  setSelectedDateField: (field: string) => void;
  selectedValueField: string;
  setSelectedValueField: (field: string) => void;
  
  // История прогнозов
  forecastHistory: ForecastData[];
  setForecastHistory: (history: ForecastData[]) => void;
  addToForecastHistory: (forecast: ForecastData) => void;
  
  // Текущий прогноз
  currentForecast: any | null;
  setCurrentForecast: (forecast: any) => void;
  
  // Состояние загрузки и ошибки
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Метод для очистки всех данных
  clearAllData: () => void;
}

// Создаем контекст
const DataContext = createContext<DataContextType | undefined>(undefined);

// Функция для восстановления дат в данных
const restoreDatesInParsedData = (savedData: any): ParsedData => {
  if (savedData && savedData.data && Array.isArray(savedData.data)) {
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
  return savedData as ParsedData;
};

// Функция для восстановления дат в истории прогнозов
const restoreDatesInForecastHistory = (savedForecasts: any[]): ForecastData[] => {
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

// Восстанавливаем даты в временном ряду
const restoreDatesInTimeSeries = (data: any[]): Array<{ date: Date; value: number }> => {
  return data.map(item => ({
    date: new Date(item.date),
    value: item.value
  }));
};

// Провайдер данных
export function DataProvider({ children }: { children: ReactNode }) {
  // Состояния для данных
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [filteredData, setFilteredData] = useState<ParsedDataRow[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{ date: Date; value: number }>>([]);
  const [selectedDateField, setSelectedDateField] = useState<string>('');
  const [selectedValueField, setSelectedValueField] = useState<string>('');
  const [forecastHistory, setForecastHistory] = useState<ForecastData[]>([]);
  const [currentForecast, setCurrentForecast] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    try {
      // Загружаем основные данные
      const savedDataStr = localStorage.getItem('parsedData');
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);
        const restoredData = restoreDatesInParsedData(savedData);
        setParsedData(restoredData);
      }
      
      // Загружаем отфильтрованные данные
      const filteredDataStr = localStorage.getItem('filteredData');
      if (filteredDataStr) {
        const savedFilteredData = JSON.parse(filteredDataStr);
        const restoredFilteredData = restoreDatesInParsedData({data: savedFilteredData}).data;
        setFilteredData(restoredFilteredData);
      }
      
      // Загружаем результаты валидации
      const validationResultStr = localStorage.getItem('validationResult');
      if (validationResultStr) {
        setValidationResult(JSON.parse(validationResultStr));
      }
      
      // Загружаем временной ряд
      const timeSeriesStr = localStorage.getItem('timeSeriesData');
      if (timeSeriesStr) {
        const savedTimeSeries = JSON.parse(timeSeriesStr);
        setTimeSeriesData(restoreDatesInTimeSeries(savedTimeSeries));
      }
      
      // Загружаем выбранные поля
      const selectedDateFieldStr = localStorage.getItem('selectedDateField');
      if (selectedDateFieldStr) {
        setSelectedDateField(selectedDateFieldStr);
      }
      
      const selectedValueFieldStr = localStorage.getItem('selectedValueField');
      if (selectedValueFieldStr) {
        setSelectedValueField(selectedValueFieldStr);
      }
      
      // Загружаем историю прогнозов
      const forecastHistoryStr = localStorage.getItem('forecastHistory');
      if (forecastHistoryStr) {
        const savedForecasts = JSON.parse(forecastHistoryStr);
        setForecastHistory(restoreDatesInForecastHistory(savedForecasts));
      }
      
      // Загружаем текущий прогноз
      const currentForecastStr = localStorage.getItem('currentForecast');
      if (currentForecastStr) {
        const savedForecast = JSON.parse(currentForecastStr);
        
        // Восстанавливаем даты в текущем прогнозе
        if (savedForecast) {
          const restoredForecast = { ...savedForecast };
          
          if (savedForecast.originalData) {
            restoredForecast.originalData = savedForecast.originalData.map(
              (item: any) => ({ ...item, date: new Date(item.date) })
            );
          }
          
          if (savedForecast.forecastData) {
            restoredForecast.forecastData = savedForecast.forecastData.map(
              (item: any) => ({ ...item, date: new Date(item.date) })
            );
          }
          
          if (savedForecast.confidenceInterval) {
            if (savedForecast.confidenceInterval.upper) {
              restoredForecast.confidenceInterval.upper = savedForecast.confidenceInterval.upper.map(
                (item: any) => ({ ...item, date: new Date(item.date) })
              );
            }
            
            if (savedForecast.confidenceInterval.lower) {
              restoredForecast.confidenceInterval.lower = savedForecast.confidenceInterval.lower.map(
                (item: any) => ({ ...item, date: new Date(item.date) })
              );
            }
          }
          
          setCurrentForecast(restoredForecast);
        }
      }
    } catch (err) {
      console.error('Ошибка при загрузке сохраненных данных:', err);
      setError('Не удалось загрузить сохраненные данные.');
    }
  }, []);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    if (parsedData) {
      localStorage.setItem('parsedData', JSON.stringify(parsedData));
    }
  }, [parsedData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      localStorage.setItem('filteredData', JSON.stringify(filteredData));
    }
  }, [filteredData]);

  useEffect(() => {
    if (validationResult) {
      localStorage.setItem('validationResult', JSON.stringify(validationResult));
    }
  }, [validationResult]);

  useEffect(() => {
    if (timeSeriesData.length > 0) {
      localStorage.setItem('timeSeriesData', JSON.stringify(timeSeriesData));
    }
  }, [timeSeriesData]);

  useEffect(() => {
    if (selectedDateField) {
      localStorage.setItem('selectedDateField', selectedDateField);
    }
  }, [selectedDateField]);

  useEffect(() => {
    if (selectedValueField) {
      localStorage.setItem('selectedValueField', selectedValueField);
    }
  }, [selectedValueField]);

  useEffect(() => {
    if (forecastHistory.length > 0) {
      localStorage.setItem('forecastHistory', JSON.stringify(forecastHistory));
    }
  }, [forecastHistory]);

  useEffect(() => {
    if (currentForecast) {
      localStorage.setItem('currentForecast', JSON.stringify(currentForecast));
    }
  }, [currentForecast]);

  // Функция для добавления прогноза в историю
  const addToForecastHistory = (forecast: ForecastData) => {
    const updatedHistory = [forecast, ...forecastHistory];
    setForecastHistory(updatedHistory);
  };

  // Функция для очистки всех данных
  const clearAllData = () => {
    setParsedData(null);
    setFilteredData([]);
    setValidationResult(null);
    setTimeSeriesData([]);
    setSelectedDateField('');
    setSelectedValueField('');
    setForecastHistory([]);
    setCurrentForecast(null);
    setError(null);
    
    // Очищаем localStorage
    localStorage.removeItem('parsedData');
    localStorage.removeItem('filteredData');
    localStorage.removeItem('validationResult');
    localStorage.removeItem('timeSeriesData');
    localStorage.removeItem('selectedDateField');
    localStorage.removeItem('selectedValueField');
    localStorage.removeItem('forecastHistory');
    localStorage.removeItem('currentForecast');
  };

  return (
    <DataContext.Provider
      value={{
        parsedData,
        setParsedData,
        filteredData,
        setFilteredData,
        validationResult,
        setValidationResult,
        timeSeriesData,
        setTimeSeriesData,
        selectedDateField,
        setSelectedDateField,
        selectedValueField,
        setSelectedValueField,
        forecastHistory,
        setForecastHistory,
        addToForecastHistory,
        currentForecast,
        setCurrentForecast,
        isLoading,
        setIsLoading,
        error,
        setError,
        clearAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Хук для использования контекста данных
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}