/**
 * Модуль прогнозирования
 * Экспортирует все методы прогнозирования и общие интерфейсы
 */

import { 
    calculateLinearRegression, 
    linearRegressionForecast,
    convertTimeSeriesForRegression,
    convertRegressionToTimeSeries
  } from './linearRegression';
  
  // В будущем здесь будут экспортироваться другие методы прогнозирования
  // import { exponentialSmoothingForecast } from './exponentialSmoothing';
  // import { arimaForecast } from './arima';
  
  export interface TimeSeriesPoint {
    date: Date;
    value: number;
  }
  
  export interface DataPoint {
    x: number;
    y: number;
  }
  
  export interface ForecastOptions {
    method: 'linear' | 'exp_smoothing' | 'arima' | 'auto';
    periods: number;
    confidenceInterval: boolean;
    confidenceLevel: number;
    seasonality?: boolean;
    seasonalPeriod?: number;
  }
  
  export interface ForecastResult {
    originalData: DataPoint[] | TimeSeriesPoint[];
    forecastData: DataPoint[] | TimeSeriesPoint[];
    method: string;
    accuracy: number;
    confidenceInterval?: {
      upper: DataPoint[] | TimeSeriesPoint[];
      lower: DataPoint[] | TimeSeriesPoint[];
      confidence: number;
    };
    parameters?: Record<string, any>;
  }
  
  /**
   * Выполняет прогнозирование временного ряда с помощью выбранного метода
   * @param timeData Массив точек временного ряда (дата и значение)
   * @param options Параметры прогнозирования
   * @returns Результат прогнозирования
   */
  export function forecastTimeSeries(
    timeData: TimeSeriesPoint[],
    options: ForecastOptions
  ): ForecastResult {
    if (timeData.length < 2) {
      throw new Error('Для прогнозирования требуется минимум 2 точки данных');
    }
  
    // Пока реализован только метод линейной регрессии
    // В будущем здесь будет выбор метода и автоматический выбор
    const method = options.method === 'auto' ? selectBestMethod(timeData) : options.method;
    
    switch (method) {
      case 'linear':
        return forecastWithLinearRegression(timeData, options);
      // Раскомментировать, когда будут реализованы другие методы
      // case 'exp_smoothing':
      //   return forecastWithExponentialSmoothing(timeData, options);
      // case 'arima':
      //   return forecastWithARIMA(timeData, options);
      default:
        return forecastWithLinearRegression(timeData, options);
    }
  }
  
  /**
   * Выбирает наилучший метод прогнозирования на основе анализа данных
   * @param timeData Массив точек временного ряда
   * @returns Наилучший метод прогнозирования
   */
  function selectBestMethod(timeData: TimeSeriesPoint[]): 'linear' | 'exp_smoothing' | 'arima' {
    // Пока всегда возвращаем линейную регрессию
    // В будущем здесь будет более сложная логика выбора метода
    return 'linear';
  }
  
  /**
   * Выполняет прогнозирование с помощью линейной регрессии
   * @param timeData Массив точек временного ряда
   * @param options Параметры прогнозирования
   * @returns Результат прогнозирования
   */
  function forecastWithLinearRegression(
    timeData: TimeSeriesPoint[],
    options: ForecastOptions
  ): ForecastResult {
    // Преобразуем временной ряд в формат для регрессии
    const regressionData = convertTimeSeriesForRegression(timeData);
    
    // Выполняем прогнозирование
    const linearRegResult = linearRegressionForecast(
      regressionData,
      options.periods,
      options.confidenceInterval,
      options.confidenceLevel
    );
    
    // Преобразуем результаты обратно во временной ряд
    const originalTimeSeries = convertRegressionToTimeSeries(
      linearRegResult.originalData,
      timeData[0].date
    );
    
    const forecastTimeSeries = convertRegressionToTimeSeries(
      linearRegResult.forecastData,
      timeData[0].date
    );
    
    // Преобразуем интервал доверия, если он есть
    let confidenceInterval;
    if (linearRegResult.confidenceInterval) {
      confidenceInterval = {
        upper: convertRegressionToTimeSeries(
          linearRegResult.confidenceInterval.upper,
          timeData[0].date
        ),
        lower: convertRegressionToTimeSeries(
          linearRegResult.confidenceInterval.lower,
          timeData[0].date
        ),
        confidence: linearRegResult.confidenceInterval.confidence
      };
    }
    
    return {
      originalData: originalTimeSeries,
      forecastData: forecastTimeSeries,
      method: 'linear',
      accuracy: linearRegResult.regression.r2,
      confidenceInterval,
      parameters: {
        slope: linearRegResult.regression.slope,
        intercept: linearRegResult.regression.intercept,
        r2: linearRegResult.regression.r2
      }
    };
  }
  
  export {
    calculateLinearRegression,
    linearRegressionForecast,
    convertTimeSeriesForRegression,
    convertRegressionToTimeSeries
  };