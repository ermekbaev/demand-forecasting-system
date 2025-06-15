import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ForecastOptions } from '@/lib/Forecast';

interface ForecastFormProps {
  fields: string[];
  onGenerateForecast: (
    dateField: string,
    valueField: string,
    options: ForecastOptions
  ) => void;
  isLoading?: boolean;
}

const ForecastForm: React.FC<ForecastFormProps> = ({
  fields,
  onGenerateForecast,
  isLoading = false
}) => {
  // Выбираем поля для прогнозирования
  const [dateField, setDateField] = useState<string>('');
  const [valueField, setValueField] = useState<string>('');
  
  // Настройки прогноза
  const [forecastMethod, setForecastMethod] = useState<ForecastOptions['method']>('auto');
  const [forecastPeriods, setForecastPeriods] = useState<number>(30);
  const [periodUnit, setPeriodUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [seasonality, setSeasonality] = useState<'auto' | 'yes' | 'no'>('auto');
  const [confidenceInterval, setConfidenceInterval] = useState<boolean>(true);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);

  // Фильтруем поля для выбора
  const dateFields = fields.filter(field => field.toLowerCase().includes('date') || field.toLowerCase().includes('time'));
  const valueFields = fields.filter(field => 
    !field.toLowerCase().includes('date') && 
    !field.toLowerCase().includes('time') && 
    !field.toLowerCase().includes('id') && 
    !field.toLowerCase().includes('name')
  );

  // Если не выбраны поля по умолчанию и есть подходящие поля, выбираем их
  React.useEffect(() => {
    if (!dateField && dateFields.length > 0) {
      setDateField(dateFields[0]);
    }
    if (!valueField && valueFields.length > 0) {
      setValueField(valueFields[0]);
    }
  }, [fields]);

  // Преобразование периодов в дни для разных единиц измерения
  const convertPeriodsToDesiredUnit = (): number => {
    switch (periodUnit) {
      case 'weeks':
        return forecastPeriods * 7;
      case 'months':
        return forecastPeriods * 30; // Приблизительно
      default:
        return forecastPeriods;
    }
  };

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateField || !valueField) {
      alert('Пожалуйста, выберите поля даты и значения');
      return;
    }
    
    const options: ForecastOptions = {
      method: forecastMethod,
      periods: convertPeriodsToDesiredUnit(),
      confidenceInterval,
      confidenceLevel,
      seasonality: seasonality === 'auto' ? undefined : seasonality === 'yes'
    };
    
    onGenerateForecast(dateField, valueField, options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Выбор данных</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поле даты
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              style={{ color: themeColors.darkTeal }}
              value={dateField}
              onChange={(e) => setDateField(e.target.value)}
              required
            >
              <option value="">Выберите поле даты</option>
              {dateFields.length > 0 ? (
                dateFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))
              ) : (
                fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поле значения
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              style={{ color: themeColors.darkTeal }}
              value={valueField}
              onChange={(e) => setValueField(e.target.value)}
              required
            >
              <option value="">Выберите поле значения</option>
              {valueFields.length > 0 ? (
                valueFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))
              ) : (
                fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Настройки прогноза</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Метод прогнозирования
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              style={{ color: themeColors.darkTeal }}
              value={forecastMethod}
              onChange={(e) => setForecastMethod(e.target.value as ForecastOptions['method'])}
            >
              <option value="auto">Автоматический выбор</option>
              <option value="linear">Линейная регрессия</option>
              <option value="exp_smoothing">Экспоненциальное сглаживание</option>
              <option value="arima">ARIMA</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Горизонт прогнозирования
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                style={{ color: themeColors.darkTeal }}
                value={forecastPeriods}
                onChange={(e) => setForecastPeriods(parseInt(e.target.value) || 1)}
                className="block w-20 p-2 border border-gray-300 rounded-md shadow-sm"
              />
              <select 
                className="ml-2 block w-32 p-2 border border-gray-300 rounded-md shadow-sm"
                style={{ color: themeColors.darkTeal }}
                value={periodUnit}
                onChange={(e) => setPeriodUnit(e.target.value as 'days' | 'weeks' | 'months')}
              >
                <option value="days">Дней</option>
                <option value="weeks">Недель</option>
                <option value="months">Месяцев</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Учитывать сезонность
            </label>
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="seasonality"
                  value="auto"
                  checked={seasonality === 'auto'}
                  onChange={() => setSeasonality('auto')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Автоматически</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="seasonality"
                  value="yes"
                  checked={seasonality === 'yes'}
                  onChange={() => setSeasonality('yes')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Да</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="seasonality"
                  value="no"
                  checked={seasonality === 'no'}
                  onChange={() => setSeasonality('no')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Нет</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Доверительный интервал
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={confidenceInterval}
                  onChange={(e) => setConfidenceInterval(e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Включить</span>
              </label>
              
              {confidenceInterval && (
                <select 
                  className="block w-32 p-2 border border-gray-300 rounded-md shadow-sm"
                  style={{ color: themeColors.darkTeal }}
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                >
                  <option value="0.9">90%</option>
                  <option value="0.95">95%</option>
                  <option value="0.99">99%</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button 
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
          style={{ backgroundColor: themeColors.teal }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Создание прогноза...
            </span>
          ) : (
            'Создать прогноз'
          )}
        </button>
      </div>
    </form>
  );
};

export default ForecastForm;