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

import {
  exponentialSmoothingForecast,
  simpleExponentialSmoothing,
  holtExponentialSmoothing,
  holtWintersExponentialSmoothing,
  optimizeExponentialSmoothingParams
} from './exponentialSmoothing';

import {
  arimaForecast,
  autoSelectARIMAParams,
  differenceTimeSeries,
  integrateTimeSeries
} from './arima';

export interface TimeSeriesPoint {
  date: Date;
  value: number;
}

export interface DataPoint {
  x: number;
  y: number;
}

interface ForecastOptions {
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

  // Выбор метода прогнозирования
  const method = options.method === 'auto' ? selectBestMethod(timeData) : options.method;
  
  switch (method) {
    case 'linear':
      return forecastWithLinearRegression(timeData, options);
    case 'exp_smoothing':
      return forecastWithExponentialSmoothing(timeData, options);
    case 'arima':
      return forecastWithARIMA(timeData, options);
    default:
      // Если метод не распознан, используем наилучший метод
      return forecastWithBestMethod(timeData, options);
  }
}

/**
 * Выбирает наилучший метод прогнозирования на основе анализа данных
 * @param timeData Массив точек временного ряда
 * @returns Наилучший метод прогнозирования
 */
function selectBestMethod(timeData: TimeSeriesPoint[]): 'linear' | 'exp_smoothing' | 'arima' {
  // Преобразуем временной ряд в формат для анализа
  const data = convertTimeSeriesForRegression(timeData);
  const yValues = data.map(point => point.y);
  
  // Проверяем на наличие тренда и сезонности
  const hasTrend = checkForTrend(data);
  const hasSeasonal = checkForSeasonality(data);
  
  // Проверяем стационарность ряда
  const isStationary = checkStationarity(yValues);
  
  // Выбираем метод на основе характеристик ряда
  if (!isStationary || hasSeasonal) {
    return 'arima'; // ARIMA хорошо справляется с нестационарными и сезонными рядами
  } else if (hasTrend) {
    return 'exp_smoothing'; // Экспоненциальное сглаживание хорошо для рядов с трендом
  } else {
    return 'linear'; // Линейная регрессия для простых случаев
  }
}

/**
 * Проверяет наличие тренда во временном ряде
 * @param data Массив точек данных {x, y}
 * @returns Булево значение, указывающее на наличие тренда
 */
function checkForTrend(data: DataPoint[]): boolean {
  if (data.length < 3) return false;
  
  // Используем линейную регрессию для выявления тренда
  const regression = calculateLinearRegression(data);
  
  // Если коэффициент наклона статистически значим, считаем, что есть тренд
  const threshold = 0.1; // Порог значимости наклона
  return Math.abs(regression.slope) > threshold;
}

/**
 * Проверяет наличие сезонности во временном ряде
 * @param data Массив точек данных {x, y}
 * @returns Булево значение, указывающее на наличие сезонности
 */
function checkForSeasonality(data: DataPoint[]): boolean {
  if (data.length < 12) return false; // Нужно достаточно данных для обнаружения сезонности
  
  // Извлекаем только значения y
  const yValues = data.map(point => point.y);
  
  // Вычисляем автокорреляцию с различными лагами
  const acf = calculateACF(yValues, Math.min(data.length / 3, 36));
  
  // Ищем пики в автокорреляции, которые могут указывать на сезонность
  for (let lag = 2; lag < acf.length; lag++) {
    if (acf[lag] > 0.3 && acf[lag] > acf[lag - 1] && acf[lag] > acf[lag + 1]) {
      return true;
    }
  }
  
  return false;
}

/**
 * Рассчитывает функцию автокорреляции (ACF) для временного ряда
 * @param data Временной ряд
 * @param maxLag Максимальный лаг
 * @returns Массив коэффициентов автокорреляции
 */
function calculateACF(data: number[], maxLag: number): number[] {
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const acf: number[] = [];
  
  // Вычисляем дисперсию ряда
  let variance = 0;
  for (let i = 0; i < n; i++) {
    variance += Math.pow(data[i] - mean, 2);
  }
  variance /= n;
  
  // Вычисляем автокорреляцию для каждого лага
  for (let lag = 0; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += (data[i] - mean) * (data[i + lag] - mean);
    }
    acf.push(sum / (n * variance));
  }
  
  return acf;
}

/**
 * Проверяет стационарность временного ряда
 * @param data Временной ряд
 * @returns Булево значение, указывающее на стационарность
 */
function checkStationarity(data: number[]): boolean {
  if (data.length < 8) return true; // Мало данных для надежной проверки
  
  // Делим ряд на две половины и сравниваем средние и дисперсии
  const half = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, half);
  const secondHalf = data.slice(half);
  
  const mean1 = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const mean2 = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  let var1 = 0, var2 = 0;
  for (const val of firstHalf) var1 += Math.pow(val - mean1, 2);
  for (const val of secondHalf) var2 += Math.pow(val - mean2, 2);
  var1 /= firstHalf.length;
  var2 /= secondHalf.length;
  
  // Вычисляем относительные изменения
  const meanChange = Math.abs((mean2 - mean1) / mean1);
  const varChange = Math.abs((var2 - var1) / var1);
  
  // Если изменения меньше порога, считаем ряд стационарным
  return meanChange < 0.2 && varChange < 0.4;
}

/**
 * Выполняет прогнозирование с помощью наилучшего метода
 * @param timeData Массив точек временного ряда
 * @param options Параметры прогнозирования
 * @returns Результат прогнозирования
 */
function forecastWithBestMethod(
  timeData: TimeSeriesPoint[],
  options: ForecastOptions
): ForecastResult {
  // Преобразуем временной ряд в формат для анализа
  const data = convertTimeSeriesForRegression(timeData);
  
  // Пробуем разные методы и выбираем тот, который дает лучшие результаты для исторических данных
  const testSize = Math.min(5, Math.floor(timeData.length * 0.2));
  if (testSize < 2) {
    // Если данных слишком мало для тестирования, используем линейную регрессию
    return forecastWithLinearRegression(timeData, options);
  }
  
  const trainingData = timeData.slice(0, -testSize);
  const testData = timeData.slice(-testSize);
  
  // Прогнозируем с помощью различных методов
  const linearOptions: ForecastOptions = { 
    method: 'linear',  // Вместо произвольной строки
    periods: testSize,
    confidenceInterval: true,
    confidenceLevel: 0.95,
    seasonality: false,
    seasonalPeriod: 0
  };

  const expOptions: ForecastOptions = { 
    method: 'exp_smoothing',
    periods: testSize,
    confidenceInterval: true,
    confidenceLevel: 0.95,
    seasonality: false,
    seasonalPeriod: 0 };

  const arimaOptions: ForecastOptions = { 
    method: 'arima',
    periods: testSize,
    confidenceInterval: true,
    confidenceLevel: 0.95,
    seasonality: false,
    seasonalPeriod: 0 };
  
  let linearError = 0, expError = 0, arimaError = 0;
  
  try {
    const linearForecast = forecastWithLinearRegression(trainingData, { ...linearOptions, periods: testSize });
    linearError = calculateForecastError(linearForecast.forecastData as TimeSeriesPoint[], testData);
  } catch (e) {
    linearError = Infinity;
  }
  
  try {
    const expForecast = forecastWithExponentialSmoothing(trainingData, { ...expOptions, periods: testSize });
    expError = calculateForecastError(expForecast.forecastData as TimeSeriesPoint[], testData);
  } catch (e) {
    expError = Infinity;
  }
  
  try {
    const arimaForecast = forecastWithARIMA(trainingData, { ...arimaOptions, periods: testSize });
    arimaError = calculateForecastError(arimaForecast.forecastData as TimeSeriesPoint[], testData);
  } catch (e) {
    arimaError = Infinity;
  }
  
  // Выбираем метод с наименьшей ошибкой
  if (linearError <= expError && linearError <= arimaError) {
    return forecastWithLinearRegression(timeData, options);
  } else if (expError <= linearError && expError <= arimaError) {
    return forecastWithExponentialSmoothing(timeData, options);
  } else {
    return forecastWithARIMA(timeData, options);
  }
}

/**
 * Рассчитывает среднюю абсолютную ошибку прогноза
 * @param forecast Прогнозные значения
 * @param actual Фактические значения
 * @returns Средняя абсолютная ошибка
 */
function calculateForecastError(forecast: TimeSeriesPoint[], actual: TimeSeriesPoint[]): number {
  if (forecast.length !== actual.length) {
    throw new Error('Количество прогнозных и фактических значений должно совпадать');
  }
  
  let totalError = 0;
  
  for (let i = 0; i < forecast.length; i++) {
    totalError += Math.abs(forecast[i].value - actual[i].value);
  }
  
  return totalError / forecast.length;
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

/**
 * Выполняет прогнозирование с помощью экспоненциального сглаживания
 * @param timeData Массив точек временного ряда
 * @param options Параметры прогнозирования
 * @returns Результат прогнозирования
 */
function forecastWithExponentialSmoothing(
  timeData: TimeSeriesPoint[],
  options: ForecastOptions
): ForecastResult {
  // Преобразуем временной ряд в формат для алгоритма
  const data = convertTimeSeriesForRegression(timeData);
  
  // Определяем тип модели экспоненциального сглаживания
  let modelType: 'simple' | 'holt' | 'holt_winters' = 'simple';
  const hasTrend = checkForTrend(data);
  const hasSeasonal = checkForSeasonality(data);
  
  if (hasSeasonal) {
    modelType = 'holt_winters';
  } else if (hasTrend) {
    modelType = 'holt';
  }
  
  // Определяем сезонный период, если необходимо
  let seasonalPeriod = options.seasonalPeriod;
  if (modelType === 'holt_winters' && !seasonalPeriod) {
    // Автоматически определяем сезонный период
    seasonalPeriod = detectSeasonalPeriod(data);
  }
  
  // Выполняем прогнозирование
  const result = exponentialSmoothingForecast(
    data,
    options.periods,
    undefined, // Автоматический выбор параметров
    modelType,
    seasonalPeriod,
    options.confidenceInterval,
    options.confidenceLevel
  );
  
  // Преобразуем результаты обратно во временной ряд
  const originalTimeSeries = convertRegressionToTimeSeries(
    result.originalData,
    timeData[0].date
  );
  
  const forecastTimeSeries = convertRegressionToTimeSeries(
    result.forecastData,
    timeData[0].date
  );
  
  // Преобразуем интервал доверия, если он есть
  let confidenceInterval;
  if (result.confidenceInterval) {
    confidenceInterval = {
      upper: convertRegressionToTimeSeries(
        result.confidenceInterval.upper,
        timeData[0].date
      ),
      lower: convertRegressionToTimeSeries(
        result.confidenceInterval.lower,
        timeData[0].date
      ),
      confidence: result.confidenceInterval.confidence
    };
  }
  
  // Рассчитываем точность модели (1 - MSE/Variance)
  const yValues = data.map(point => point.y);
  const mean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
  const variance = yValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / yValues.length;
  const accuracy = Math.max(0, 1 - (result.mse / variance));
  
  return {
    originalData: originalTimeSeries,
    forecastData: forecastTimeSeries,
    method: `exp_smoothing_${modelType}`,
    accuracy,
    confidenceInterval,
    parameters: {
      modelType,
      alpha: result.params.alpha,
      beta: result.params.beta,
      gamma: result.params.gamma,
      seasonalPeriod: result.params.seasonalPeriod,
      mse: result.mse,
      mae: result.mae
    }
  };
}

/**
 * Автоматически определяет сезонный период временного ряда
 * @param data Массив точек данных {x, y}
 * @returns Оценка сезонного периода
 */
function detectSeasonalPeriod(data: DataPoint[]): number {
  if (data.length < 12) return 4; // По умолчанию для коротких рядов
  
  // Извлекаем только значения y
  const yValues = data.map(point => point.y);
  
  // Вычисляем автокорреляцию до половины длины ряда
  const maxLag = Math.min(Math.floor(data.length / 2), 50);
  const acf = calculateACF(yValues, maxLag);
  
  // Ищем пики в автокорреляции после первого лага
  const candidates: number[] = [];
  
  for (let lag = 2; lag < acf.length - 1; lag++) {
    if (acf[lag] > 0.3 && acf[lag] > acf[lag - 1] && acf[lag] > acf[lag + 1]) {
      candidates.push(lag);
    }
  }
  
  if (candidates.length === 0) {
    // Если пиков не найдено, предполагаем типичные сезонные периоды
    return data.length >= 24 ? 12 : 4;
  }
  
  // Выбираем период с наибольшей автокорреляцией
  let bestLag = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (acf[candidates[i]] > acf[bestLag]) {
      bestLag = candidates[i];
    }
  }
  
  return bestLag;
}

/**
 * Выполняет прогнозирование с помощью ARIMA
 * @param timeData Массив точек временного ряда
 * @param options Параметры прогнозирования
 * @returns Результат прогнозирования
 */
function forecastWithARIMA(
  timeData: TimeSeriesPoint[],
  options: ForecastOptions
): ForecastResult {
  // Преобразуем временной ряд в формат для алгоритма
  const data = convertTimeSeriesForRegression(timeData);
  const yValues = data.map(point => point.y);
  
  // Выполняем прогнозирование с ARIMA
  const result = arimaForecast(
    data,
    options.periods,
    undefined, // Автоматический выбор параметров
    options.confidenceInterval,
    options.confidenceLevel
  );
  
  // Преобразуем результаты обратно во временной ряд
  const originalTimeSeries = convertRegressionToTimeSeries(
    result.originalData,
    timeData[0].date
  );
  
  const forecastTimeSeries = convertRegressionToTimeSeries(
    result.forecastData,
    timeData[0].date
  );
  
  // Преобразуем интервал доверия, если он есть
  let confidenceInterval;
  if (result.confidenceInterval) {
    confidenceInterval = {
      upper: convertRegressionToTimeSeries(
        result.confidenceInterval.upper,
        timeData[0].date
      ),
      lower: convertRegressionToTimeSeries(
        result.confidenceInterval.lower,
        timeData[0].date
      ),
      confidence: result.confidenceInterval.confidence
    };
  }
  
  // Рассчитываем точность модели на основе AIC
  // Нормализуем AIC к значению от 0 до 1
  // Меньший AIC означает лучшую модель
  const maxAIC = Math.abs(result.aic) * 2;
  const minAIC = 0;
  const normalizedAIC = 1 - Math.abs((result.aic - minAIC) / (maxAIC - minAIC));
  const accuracy = Math.max(0, Math.min(1, normalizedAIC));
  
  return {
    originalData: originalTimeSeries,
    forecastData: forecastTimeSeries,
    method: 'arima',
    accuracy,
    confidenceInterval,
    parameters: {
      p: result.params.p,
      d: result.params.d,
      q: result.params.q,
      seasonalPeriod: result.params.seasonalPeriod,
      aic: result.aic,
      bic: result.bic
    }
  };
}

export {
  calculateLinearRegression,
  linearRegressionForecast,
  convertTimeSeriesForRegression,
  convertRegressionToTimeSeries,
  exponentialSmoothingForecast,
  simpleExponentialSmoothing,
  holtExponentialSmoothing,
  holtWintersExponentialSmoothing,
  arimaForecast,
  autoSelectARIMAParams, type ForecastOptions
};