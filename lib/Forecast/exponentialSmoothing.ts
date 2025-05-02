/**
 * Модуль для прогнозирования данных с помощью экспоненциального сглаживания
 */

import { DataPoint } from './linearRegression';

interface ExponentialSmoothingParams {
  alpha: number; // Коэффициент сглаживания для уровня (0 < alpha < 1)
  beta?: number; // Коэффициент сглаживания для тренда (0 < beta < 1), используется только для моделей Холта и Холта-Винтерса
  gamma?: number; // Коэффициент сглаживания для сезонности (0 < gamma < 1), используется только для модели Холта-Винтерса
  seasonalPeriod?: number; // Длина сезонного периода для модели Холта-Винтерса
}

interface ExponentialSmoothingResult {
  originalData: DataPoint[];
  forecastData: DataPoint[];
  params: ExponentialSmoothingParams;
  modelType: 'simple' | 'holt' | 'holt_winters';
  mse: number; // Средняя квадратичная ошибка
  mae: number; // Средняя абсолютная ошибка
  confidenceInterval?: {
    upper: DataPoint[];
    lower: DataPoint[];
    confidence: number;
  };
}

/**
 * Простое экспоненциальное сглаживание (SES)
 * Прогнозирует временной ряд без явного тренда и сезонности
 * @param data Массив точек данных {x, y}
 * @param alpha Коэффициент сглаживания (0 < alpha < 1)
 * @param periods Количество периодов для прогноза
 * @returns Сглаженные значения и прогноз
 */
export function simpleExponentialSmoothing(
  data: DataPoint[],
  alpha: number,
  periods: number
): { smoothed: DataPoint[]; forecast: DataPoint[] } {
  if (data.length < 2) {
    throw new Error('Для экспоненциального сглаживания требуется минимум 2 точки данных');
  }

  if (alpha <= 0 || alpha >= 1) {
    throw new Error('Коэффициент alpha должен быть в диапазоне (0, 1)');
  }

  // Сортируем данные по x
  const sortedData = [...data].sort((a, b) => a.x - b.x);

  // Первое сглаженное значение равно первому фактическому значению
  let smoothedValue = sortedData[0].y;
  const smoothed: DataPoint[] = [{ x: sortedData[0].x, y: smoothedValue }];

  // Применяем сглаживание ко всем последующим точкам
  for (let i = 1; i < sortedData.length; i++) {
    smoothedValue = alpha * sortedData[i].y + (1 - alpha) * smoothedValue;
    smoothed.push({ x: sortedData[i].x, y: smoothedValue });
  }

  // Последнее сглаженное значение используется для всех будущих прогнозов
  const forecast: DataPoint[] = [];
  const lastX = sortedData[sortedData.length - 1].x;
  const lastSmoothedValue = smoothed[smoothed.length - 1].y;

  for (let i = 1; i <= periods; i++) {
    forecast.push({ x: lastX + i, y: lastSmoothedValue });
  }

  return { smoothed, forecast };
}

/**
 * Двойное экспоненциальное сглаживание (метод Холта)
 * Прогнозирует временной ряд с трендом, но без сезонности
 * @param data Массив точек данных {x, y}
 * @param alpha Коэффициент сглаживания для уровня (0 < alpha < 1)
 * @param beta Коэффициент сглаживания для тренда (0 < beta < 1)
 * @param periods Количество периодов для прогноза
 * @returns Сглаженные значения и прогноз
 */
export function holtExponentialSmoothing(
  data: DataPoint[],
  alpha: number,
  beta: number,
  periods: number
): { smoothed: DataPoint[]; forecast: DataPoint[] } {
  if (data.length < 2) {
    throw new Error('Для метода Холта требуется минимум 2 точки данных');
  }

  if (alpha <= 0 || alpha >= 1 || beta <= 0 || beta >= 1) {
    throw new Error('Коэффициенты alpha и beta должны быть в диапазоне (0, 1)');
  }

  // Сортируем данные по x
  const sortedData = [...data].sort((a, b) => a.x - b.x);

  // Инициализация начальных значений
  let level = sortedData[0].y;
  let trend = sortedData[1].y - sortedData[0].y;
  
  const smoothed: DataPoint[] = [{ x: sortedData[0].x, y: level }];

  // Применяем метод Холта
  for (let i = 1; i < sortedData.length; i++) {
    const lastLevel = level;
    // Обновляем уровень
    level = alpha * sortedData[i].y + (1 - alpha) * (level + trend);
    // Обновляем тренд
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
    
    smoothed.push({ x: sortedData[i].x, y: level });
  }

  // Прогнозирование будущих значений
  const forecast: DataPoint[] = [];
  const lastX = sortedData[sortedData.length - 1].x;

  for (let i = 1; i <= periods; i++) {
    forecast.push({ x: lastX + i, y: level + i * trend });
  }

  return { smoothed, forecast };
}

/**
 * Тройное экспоненциальное сглаживание (метод Холта-Винтерса)
 * Прогнозирует временной ряд с трендом и сезонностью
 * @param data Массив точек данных {x, y}
 * @param alpha Коэффициент сглаживания для уровня (0 < alpha < 1)
 * @param beta Коэффициент сглаживания для тренда (0 < beta < 1)
 * @param gamma Коэффициент сглаживания для сезонности (0 < gamma < 1)
 * @param seasonalPeriod Длина сезонного периода
 * @param periods Количество периодов для прогноза
 * @param multiplicative Использовать мультипликативную модель (true) или аддитивную (false)
 * @returns Сглаженные значения и прогноз
 */
export function holtWintersExponentialSmoothing(
  data: DataPoint[],
  alpha: number,
  beta: number,
  gamma: number,
  seasonalPeriod: number,
  periods: number,
  multiplicative: boolean = false
): { smoothed: DataPoint[]; forecast: DataPoint[] } {
  if (data.length < 2 * seasonalPeriod) {
    throw new Error(`Для метода Холта-Винтерса требуется минимум ${2 * seasonalPeriod} точек данных`);
  }

  if (alpha <= 0 || alpha >= 1 || beta <= 0 || beta >= 1 || gamma <= 0 || gamma >= 1) {
    throw new Error('Коэффициенты alpha, beta и gamma должны быть в диапазоне (0, 1)');
  }

  // Сортируем данные по x
  const sortedData = [...data].sort((a, b) => a.x - b.x);

  // Вычисляем начальные значения
  // Начальный уровень - среднее первого сезона
  let level = 0;
  for (let i = 0; i < seasonalPeriod; i++) {
    level += sortedData[i].y / seasonalPeriod;
  }

  // Начальный тренд - среднее изменение за один период
  let trend = 0;
  for (let i = 0; i < seasonalPeriod; i++) {
    trend += (sortedData[i + seasonalPeriod].y - sortedData[i].y) / seasonalPeriod;
  }
  trend /= seasonalPeriod;

  // Инициализация сезонных индексов
  const seasonalIndices = [];
  
  if (multiplicative) {
    // Для мультипликативной модели
    for (let i = 0; i < seasonalPeriod; i++) {
      let seasonalIndex = 0;
      for (let j = 0; j * seasonalPeriod + i < sortedData.length; j++) {
        if (j < 2) {  // Используем только первые два сезона для начальной оценки
          const idx = j * seasonalPeriod + i;
          seasonalIndex += sortedData[idx].y / level;
        }
      }
      seasonalIndex /= 2;  // Делим на количество полных сезонов
      seasonalIndices.push(seasonalIndex);
    }
  } else {
    // Для аддитивной модели
    for (let i = 0; i < seasonalPeriod; i++) {
      let seasonalIndex = 0;
      for (let j = 0; j * seasonalPeriod + i < sortedData.length; j++) {
        if (j < 2) {  // Используем только первые два сезона для начальной оценки
          const idx = j * seasonalPeriod + i;
          seasonalIndex += sortedData[idx].y - level;
        }
      }
      seasonalIndex /= 2;  // Делим на количество полных сезонов
      seasonalIndices.push(seasonalIndex);
    }
  }

  // Нормализуем сезонные индексы
  if (multiplicative) {
    const sumIndices = seasonalIndices.reduce((sum, val) => sum + val, 0);
    for (let i = 0; i < seasonalPeriod; i++) {
      seasonalIndices[i] = seasonalIndices[i] * seasonalPeriod / sumIndices;
    }
  } else {
    const sumIndices = seasonalIndices.reduce((sum, val) => sum + val, 0);
    const avgIndex = sumIndices / seasonalPeriod;
    for (let i = 0; i < seasonalPeriod; i++) {
      seasonalIndices[i] = seasonalIndices[i] - avgIndex;
    }
  }

  // Применяем метод Холта-Винтерса
  const smoothed: DataPoint[] = [];
  
  // Сохраняем значения, необходимые для прогноза
  let currentLevel = level;
  let currentTrend = trend;
  const currentSeasonalIndices = [...seasonalIndices];
  
  for (let i = 0; i < sortedData.length; i++) {
    const t = i % seasonalPeriod;
    const seasonalIndex: number = seasonalIndices[t];
    
    if (multiplicative) {
      const lastLevel = currentLevel;
      
      // Обновляем уровень для мультипликативной модели
      currentLevel = alpha * (sortedData[i].y / seasonalIndex) + (1 - alpha) * (currentLevel + currentTrend);
      
      // Обновляем тренд
      currentTrend = beta * (currentLevel - lastLevel) + (1 - beta) * currentTrend;
      
      // Обновляем сезонный индекс
      seasonalIndices[t] = gamma * (sortedData[i].y / currentLevel) + (1 - gamma) * seasonalIndex;
      
      // Сглаженное значение
      const smoothedValue = (currentLevel + currentTrend) * seasonalIndex;
      smoothed.push({ x: sortedData[i].x, y: smoothedValue });
    } else {
      const lastLevel = currentLevel;
      
      // Обновляем уровень для аддитивной модели
      currentLevel = alpha * (sortedData[i].y - seasonalIndex) + (1 - alpha) * (currentLevel + currentTrend);
      
      // Обновляем тренд
      currentTrend = beta * (currentLevel - lastLevel) + (1 - beta) * currentTrend;
      
      // Обновляем сезонный индекс
      seasonalIndices[t] = gamma * (sortedData[i].y - currentLevel) + (1 - gamma) * seasonalIndex;
      
      // Сглаженное значение
      const smoothedValue = currentLevel + currentTrend + seasonalIndex;
      smoothed.push({ x: sortedData[i].x, y: smoothedValue });
    }
  }

  // Прогнозирование будущих значений
  const forecast: DataPoint[] = [];
  const lastX = sortedData[sortedData.length - 1].x;

  for (let i = 1; i <= periods; i++) {
    const t = (sortedData.length + i - 1) % seasonalPeriod;
    
    let forecastValue;
    if (multiplicative) {
      forecastValue = (currentLevel + i * currentTrend) * currentSeasonalIndices[t];
    } else {
      forecastValue = currentLevel + i * currentTrend + currentSeasonalIndices[t];
    }
    
    forecast.push({ x: lastX + i, y: forecastValue });
  }

  return { smoothed, forecast };
}

/**
 * Вычисляет метрики ошибок для оценки точности модели
 * @param actual Фактические значения
 * @param forecast Прогнозные значения
 * @returns Объект с метриками ошибок
 */
export function calculateErrors(
  actual: number[],
  forecast: number[]
): { mse: number; mae: number; rmse: number; mape: number } {
  if (actual.length !== forecast.length) {
    throw new Error('Количество фактических и прогнозных значений должно совпадать');
  }

  let sumSquaredError = 0;
  let sumAbsoluteError = 0;
  let sumAbsolutePercentageError = 0;

  for (let i = 0; i < actual.length; i++) {
    const error = actual[i] - forecast[i];
    sumSquaredError += error * error;
    sumAbsoluteError += Math.abs(error);
    
    if (actual[i] !== 0) {
      sumAbsolutePercentageError += Math.abs(error / actual[i]) * 100;
    }
  }

  const mse = sumSquaredError / actual.length;
  const mae = sumAbsoluteError / actual.length;
  const rmse = Math.sqrt(mse);
  const mape = sumAbsolutePercentageError / actual.length;

  return { mse, mae, rmse, mape };
}

/**
 * Автоматический выбор оптимальных параметров для экспоненциального сглаживания
 * @param data Массив точек данных {x, y}
 * @param modelType Тип модели экспоненциального сглаживания
 * @param seasonalPeriod Длина сезонного периода (для модели Холта-Винтерса)
 * @returns Оптимальные параметры для модели
 */
export function optimizeExponentialSmoothingParams(
  data: DataPoint[],
  modelType: 'simple' | 'holt' | 'holt_winters',
  seasonalPeriod: number = 0
): ExponentialSmoothingParams {
  if (data.length < 2) {
    throw new Error('Для оптимизации параметров требуется минимум 2 точки данных');
  }

  // Получаем только значения y для расчета ошибок
  const actualValues = data.map(point => point.y);
  
  // Для кросс-валидации используем последние 20% данных
  const validationSize = Math.max(1, Math.floor(data.length * 0.2));
  const trainingData = data.slice(0, data.length - validationSize);
  const validationData = data.slice(data.length - validationSize);

  let bestMSE = Infinity;
  let bestParams: ExponentialSmoothingParams = { alpha: 0.5 };

  // Диапазон параметров для поиска
  const alphaValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  const betaValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  const gammaValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  if (modelType === 'simple') {
    // Для простого экспоненциального сглаживания
    for (const alpha of alphaValues) {
      const { smoothed, forecast } = simpleExponentialSmoothing(
        trainingData,
        alpha,
        validationSize
      );
      
      // Сравниваем прогноз с фактическими значениями валидационного набора
      const forecastValues = forecast.map(point => point.y);
      const validationValues = validationData.map(point => point.y);
      
      const { mse } = calculateErrors(validationValues, forecastValues);
      
      if (mse < bestMSE) {
        bestMSE = mse;
        bestParams = { alpha };
      }
    }
  } else if (modelType === 'holt') {
    // Для метода Холта
    for (const alpha of alphaValues) {
      for (const beta of betaValues) {
        const { smoothed, forecast } = holtExponentialSmoothing(
          trainingData,
          alpha,
          beta,
          validationSize
        );
        
        // Сравниваем прогноз с фактическими значениями валидационного набора
        const forecastValues = forecast.map(point => point.y);
        const validationValues = validationData.map(point => point.y);
        
        const { mse } = calculateErrors(validationValues, forecastValues);
        
        if (mse < bestMSE) {
          bestMSE = mse;
          bestParams = { alpha, beta };
        }
      }
    }
  } else if (modelType === 'holt_winters') {
    // Для метода Холта-Винтерса
    if (seasonalPeriod <= 0) {
      throw new Error('Для метода Холта-Винтерса требуется указать сезонный период');
    }
    
    // Для экономии времени используем меньше комбинаций параметров
    const reducedAlphaValues = [0.2, 0.5, 0.8];
    const reducedBetaValues = [0.2, 0.5, 0.8];
    const reducedGammaValues = [0.2, 0.5, 0.8];
    
    for (const alpha of reducedAlphaValues) {
      for (const beta of reducedBetaValues) {
        for (const gamma of reducedGammaValues) {
          try {
            const { smoothed, forecast } = holtWintersExponentialSmoothing(
              trainingData,
              alpha,
              beta,
              gamma,
              seasonalPeriod,
              validationSize,
              false // Используем аддитивную модель для простоты
            );
            
            // Сравниваем прогноз с фактическими значениями валидационного набора
            const forecastValues = forecast.map(point => point.y);
            const validationValues = validationData.map(point => point.y);
            
            const { mse } = calculateErrors(validationValues, forecastValues);
            
            if (mse < bestMSE) {
              bestMSE = mse;
              bestParams = { alpha, beta, gamma, seasonalPeriod };
            }
          } catch (error) {
            // Пропускаем ошибки из-за недостаточного количества данных для некоторых комбинаций параметров
            continue;
          }
        }
      }
    }
  }

  return bestParams;
}

/**
 * Создает прогноз с использованием экспоненциального сглаживания
 * @param data Массив точек данных {x, y}
 * @param periods Количество периодов для прогноза
 * @param params Параметры модели (optional, если не указаны - будут выбраны автоматически)
 * @param modelType Тип модели экспоненциального сглаживания
 * @param seasonalPeriod Длина сезонного периода (для модели Холта-Винтерса)
 * @param includeConfidenceInterval Включать ли интервал доверия
 * @param confidenceLevel Уровень доверия (по умолчанию 0.95 = 95%)
 * @returns Результат прогнозирования
 */
export function exponentialSmoothingForecast(
  data: DataPoint[],
  periods: number,
  params?: ExponentialSmoothingParams,
  modelType: 'simple' | 'holt' | 'holt_winters' = 'simple',
  seasonalPeriod: number = 0,
  includeConfidenceInterval: boolean = true,
  confidenceLevel: number = 0.95
): ExponentialSmoothingResult {
  if (data.length < 2) {
    throw new Error('Для прогнозирования требуется минимум 2 точки данных');
  }

  if (periods < 1) {
    throw new Error('Количество периодов для прогноза должно быть положительным числом');
  }

  // Сортируем данные по x
  const sortedData = [...data].sort((a, b) => a.x - b.x);

  // Если параметры не указаны, выбираем их автоматически
  const optimalParams = params || optimizeExponentialSmoothingParams(sortedData, modelType, seasonalPeriod);

  let smoothed: DataPoint[] = [];
  let forecast: DataPoint[] = [];

  // Применяем выбранную модель
  if (modelType === 'simple') {
    const result = simpleExponentialSmoothing(
      sortedData,
      optimalParams.alpha,
      periods
    );
    smoothed = result.smoothed;
    forecast = result.forecast;
  } else if (modelType === 'holt') {
    const beta = optimalParams.beta || 0.1;
    const result = holtExponentialSmoothing(
      sortedData,
      optimalParams.alpha,
      beta,
      periods
    );
    smoothed = result.smoothed;
    forecast = result.forecast;
  } else if (modelType === 'holt_winters') {
    const beta = optimalParams.beta || 0.1;
    const gamma = optimalParams.gamma || 0.1;
    const period = optimalParams.seasonalPeriod || seasonalPeriod;
    
    if (period <= 0) {
      throw new Error('Для метода Холта-Винтерса требуется указать сезонный период');
    }
    
    const result = holtWintersExponentialSmoothing(
      sortedData,
      optimalParams.alpha,
      beta,
      gamma,
      period,
      periods,
      false // Используем аддитивную модель для простоты
    );
    smoothed = result.smoothed;
    forecast = result.forecast;
  }

  // Расчет ошибок для оценки точности модели
  const actualValues: number[] = [];
  const fittedValues: number[] = [];
  
  for (let i = 0; i < sortedData.length; i++) {
    const actual = sortedData[i].y;
    const fitted = smoothed[i].y;
    
    actualValues.push(actual);
    fittedValues.push(fitted);
  }
  
  const errors = calculateErrors(actualValues, fittedValues);

  // Расчет доверительных интервалов, если требуется
  let confidenceInterval;
  
  if (includeConfidenceInterval) {
    // Вычисляем стандартное отклонение ошибок
    const stdError = Math.sqrt(errors.mse);
    
    // Получаем критическое значение z-статистики для заданного уровня доверия
    const zScore = getZScore(confidenceLevel);
    
    // Создаем верхний и нижний доверительные интервалы
    const upper: DataPoint[] = [];
    const lower: DataPoint[] = [];
    
    // Расширяем доверительный интервал с течением времени
    for (let i = 0; i < forecast.length; i++) {
      // Множитель, увеличивающий интервал с удалением от известных данных
      const horizonMultiplier = 1 + 0.2 * Math.sqrt(i + 1);
      
      // Величина доверительного интервала
      const margin = zScore * stdError * horizonMultiplier;
      
      upper.push({ x: forecast[i].x, y: forecast[i].y + margin });
      lower.push({ x: forecast[i].x, y: forecast[i].y - margin });
    }
    
    confidenceInterval = {
      upper,
      lower,
      confidence: confidenceLevel
    };
  }

  return {
    originalData: sortedData,
    forecastData: forecast,
    params: optimalParams,
    modelType,
    mse: errors.mse,
    mae: errors.mae,
    confidenceInterval
  };
}

/**
 * Возвращает z-значение для заданного уровня доверия
 * @param confidenceLevel Уровень доверия (например, 0.95 для 95%)
 * @returns z-значение
 */
function getZScore(confidenceLevel: number): number {
  // Простая таблица z-значений для наиболее распространенных уровней доверия
  const zScores: { [key: string]: number } = {
    '0.9': 1.645,
    '0.95': 1.96,
    '0.99': 2.576
  };

  const confidenceStr = confidenceLevel.toString();
  return zScores[confidenceStr] || 1.96; // По умолчанию возвращаем значение для 95%
}