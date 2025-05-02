/**
 * Модуль для прогнозирования данных с помощью ARIMA
 * (Autoregressive Integrated Moving Average)
 */

import { DataPoint } from './linearRegression';

interface ARIMAParams {
  p: number; // Порядок авторегрессии (AR)
  d: number; // Порядок интегрирования (I)
  q: number; // Порядок скользящего среднего (MA)
  seasonalPeriod?: number; // Длина сезонного периода для сезонной ARIMA (SARIMA)
  P?: number; // Сезонный порядок AR
  D?: number; // Сезонный порядок интегрирования
  Q?: number; // Сезонный порядок MA
}

interface ARIMAResult {
  originalData: DataPoint[];
  forecastData: DataPoint[];
  params: ARIMAParams;
  residuals: number[];
  aic: number; // Информационный критерий Акаике
  bic: number; // Байесовский информационный критерий
  confidenceInterval?: {
    upper: DataPoint[];
    lower: DataPoint[];
    confidence: number;
  };
  coefficients: number[];
  arCoefficients?: number[];
  maCoefficients?: number[];
  constant: number;
}

/**
 * Вычисляет разности временного ряда заданного порядка
 * @param data Массив значений временного ряда
 * @param order Порядок разности
 * @returns Массив разностей
 */
export function differenceTimeSeries(data: number[], order: number = 1): number[] {
  if (order <= 0) {
    return [...data];
  }

  if (data.length <= order) {
    throw new Error(`Длина ряда должна быть больше порядка разности (${order})`);
  }

  const diffData: number[] = [];
  for (let i = order; i < data.length; i++) {
    diffData.push(data[i] - data[i - order]);
  }

  return diffData;
}

/**
 * Возвращает интегрированный (накопленную сумму) временной ряд
 * @param diffData Массив разностей
 * @param origData Оригинальные значения для инициализации
 * @param order Порядок интегрирования
 * @returns Интегрированный временной ряд
 */
export function integrateTimeSeries(diffData: number[], origData: number[], order: number = 1): number[] {
  if (order <= 0) {
    return [...diffData];
  }

  if (origData.length < order) {
    throw new Error(`Необходимо не менее ${order} исходных значений для интегрирования порядка ${order}`);
  }

  const result: number[] = [...origData.slice(0, order)];

  for (let i = 0; i < diffData.length; i++) {
    result.push(diffData[i] + result[i]);
  }

  return result;
}

/**
 * Вычисляет коэффициенты автокорреляции временного ряда до заданного лага
 * @param data Временной ряд
 * @param maxLag Максимальный лаг
 * @returns Массив коэффициентов автокорреляции
 */
export function autocorrelation(data: number[], maxLag: number): number[] {
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  
  // Если дисперсия близка к нулю, возвращаем нули для всех лагов
  if (Math.abs(variance) < 1e-10) {
    return Array(maxLag + 1).fill(0);
  }
  
  const acf: number[] = [];
  
  for (let lag = 0; lag <= maxLag; lag++) {
    let autocovariance = 0;
    
    for (let t = lag; t < n; t++) {
      autocovariance += (data[t] - mean) * (data[t - lag] - mean);
    }
    
    autocovariance /= n;
    acf.push(autocovariance / variance);
  }
  
  return acf;
}

/**
 * Вычисляет коэффициенты частичной автокорреляции временного ряда до заданного лага
 * @param data Временной ряд
 * @param maxLag Максимальный лаг
 * @returns Массив коэффициентов частичной автокорреляции
 */
export function partialAutocorrelation(data: number[], maxLag: number): number[] {
  const acf = autocorrelation(data, maxLag);
  const pacf: number[] = [1]; // PACF для лага 0 всегда равен 1
  
  // Уравнения Юла-Уокера для вычисления PACF
  for (let lag = 1; lag <= maxLag; lag++) {
    // Создаем матрицу системы уравнений
    const matrix: number[][] = [];
    for (let i = 0; i < lag; i++) {
      const row: number[] = [];
      for (let j = 0; j < lag; j++) {
        row.push(acf[Math.abs(i - j)]);
      }
      matrix.push(row);
    }
    
    // Вектор правых частей
    const vector = acf.slice(1, lag + 1);
    
    // Решаем систему уравнений методом Гаусса
    const phi = solveLinearSystem(matrix, vector);
    
    // Последний коэффициент - это PACF для текущего лага
    pacf.push(phi[phi.length - 1]);
  }
  
  return pacf;
}

/**
 * Решает систему линейных уравнений методом Гаусса
 * @param A Матрица коэффициентов
 * @param b Вектор правых частей
 * @returns Решение системы
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmentedMatrix: number[][] = A.map((row, i) => [...row, b[i]]);
  
  // Прямой ход метода Гаусса
  for (let i = 0; i < n; i++) {
    // Нормализация текущей строки
    const pivot = augmentedMatrix[i][i];
    
    // Если на диагонали ноль, пытаемся найти ненулевой элемент в этом столбце
    if (Math.abs(pivot) < 1e-10) {
      let foundNonZero = false;
      
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmentedMatrix[j][i]) > 1e-10) {
          // Меняем строки
          [augmentedMatrix[i], augmentedMatrix[j]] = [augmentedMatrix[j], augmentedMatrix[i]];
          foundNonZero = true;
          break;
        }
      }
      
      if (!foundNonZero) {
        // Система может быть вырожденной, возвращаем приблизительное решение
        return b.map(() => 0);
      }
    }
    
    // Делим текущую строку на диагональный элемент
    const pivotValue = augmentedMatrix[i][i];
    for (let j = i; j <= n; j++) {
      augmentedMatrix[i][j] /= pivotValue;
    }
    
    // Вычитаем текущую строку из всех остальных строк
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = augmentedMatrix[j][i];
        for (let k = i; k <= n; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
    }
  }
  
  // Извлекаем решение
  const solution: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    solution[i] = augmentedMatrix[i][n];
  }
  
  return solution;
}

/**
 * Оценивает параметры модели AR(p)
 * @param data Временной ряд
 * @param p Порядок авторегрессии
 * @returns Коэффициенты AR-модели и константа
 */
export function fitAR(data: number[], p: number): { coefficients: number[]; constant: number; residuals: number[] } {
  if (p <= 0) {
    throw new Error('Порядок AR-модели должен быть положительным');
  }
  
  // Центрируем данные
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const centeredData = data.map(val => val - mean);
  
  // Создаем матрицу наблюдений и вектор целевых значений
  const X: number[][] = [];
  const y: number[] = [];
  
  for (let t = p; t < data.length; t++) {
    const row: number[] = [];
    for (let i = 1; i <= p; i++) {
      row.push(centeredData[t - i]);
    }
    X.push(row);
    y.push(centeredData[t]);
  }
  
  // Решаем систему уравнений для нахождения коэффициентов
  const XtX: number[][] = [];
  for (let i = 0; i < p; i++) {
    const row: number[] = [];
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let t = 0; t < X.length; t++) {
        sum += X[t][i] * X[t][j];
      }
      row.push(sum);
    }
    XtX.push(row);
  }
  
  const Xty: number[] = [];
  for (let i = 0; i < p; i++) {
    let sum = 0;
    for (let t = 0; t < X.length; t++) {
      sum += X[t][i] * y[t];
    }
    Xty.push(sum);
  }
  
  const coefficients = solveLinearSystem(XtX, Xty);
  
  // Вычисляем остатки
  const residuals: number[] = [];
  for (let t = p; t < data.length; t++) {
    let predicted = mean;
    for (let i = 0; i < p; i++) {
      predicted += coefficients[i] * (data[t - i - 1] - mean);
    }
    residuals.push(data[t] - predicted);
  }
  
  return { coefficients, constant: mean, residuals };
}

/**
 * Оценивает параметры модели MA(q)
 * @param data Временной ряд
 * @param q Порядок скользящего среднего
 * @returns Коэффициенты MA-модели и константа
 */
export function fitMA(data: number[], q: number): { coefficients: number[]; constant: number; residuals: number[] } {
  if (q <= 0) {
    throw new Error('Порядок MA-модели должен быть положительным');
  }
  
  // Используем упрощенный подход с итеративным оцениванием
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const centeredData = data.map(val => val - mean);
  
  // Инициализируем коэффициенты MA нулями
  let coefficients = new Array(q).fill(0);
  
  // Инициализируем остатки центрированными данными
  let residuals = [...centeredData];
  
  const maxIterations = 50;
  const tolerance = 1e-6;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Оцениваем остатки на текущей итерации
    const newResiduals = [...centeredData];
    
    for (let t = q; t < n; t++) {
      for (let i = 0; i < q; i++) {
        if (t - i - 1 >= 0) {
          newResiduals[t] -= coefficients[i] * residuals[t - i - 1];
        }
      }
    }
    
    // Пересчитываем коэффициенты MA
    const acf = autocorrelation(newResiduals, q);
    const newCoefficients = [];
    
    for (let i = 0; i < q; i++) {
      newCoefficients.push(-acf[i + 1]);
    }
    
    // Проверяем сходимость
    let changeMagnitude = 0;
    for (let i = 0; i < q; i++) {
      changeMagnitude += Math.pow(newCoefficients[i] - coefficients[i], 2);
    }
    
    if (Math.sqrt(changeMagnitude) < tolerance) {
      break;
    }
    
    coefficients = newCoefficients;
    residuals = newResiduals;
  }
  
  return { coefficients, constant: mean, residuals };
}

/**
 * Оценивает параметры модели ARMA(p,q)
 * @param data Временной ряд
 * @param p Порядок авторегрессии
 * @param q Порядок скользящего среднего
 * @returns Коэффициенты ARMA-модели и константа
 */
export function fitARMA(data: number[], p: number, q: number): { arCoefficients: number[]; maCoefficients: number[]; constant: number; residuals: number[] } {
  // Сначала оцениваем AR-часть
  const arResult = fitAR(data, p);
  
  // Используем остатки AR-модели для оценки MA-части
  const maResult = fitMA(arResult.residuals, q);
  
  return {
    arCoefficients: arResult.coefficients,
    maCoefficients: maResult.coefficients,
    constant: arResult.constant,
    residuals: maResult.residuals
  };
}

/**
 * Прогнозирует значения модели ARIMA
 * @param data Временной ряд
 * @param p Порядок авторегрессии
 * @param d Порядок интегрирования
 * @param q Порядок скользящего среднего
 * @param periods Количество периодов для прогноза
 * @returns Прогнозные значения
 */
export function forecastARIMA(data: number[], p: number, d: number, q: number, periods: number): number[] {
  if (periods <= 0) {
    throw new Error('Количество периодов для прогноза должно быть положительным');
  }
  
  // Дифференцируем данные d раз
  let diffData = [...data];
  const originalValues: any[] = [];
  
  for (let i = 0; i < d; i++) {
    originalValues.push(diffData.slice(0, i + 1));
    diffData = differenceTimeSeries(diffData, 1);
  }
  
  // Оцениваем параметры ARMA-модели для дифференцированных данных
  const { arCoefficients, maCoefficients, constant, residuals } = fitARMA(diffData, p, q);
  
  // Подготавливаем массивы для прогнозирования
  const extendedData = [...diffData];
  const lastResiduals = residuals.slice(-q);
  
  // Прогнозируем дифференцированные значения
  for (let i = 0; i < periods; i++) {
    let prediction = constant;
    
    // AR-компонента
    for (let j = 0; j < p; j++) {
      if (i - j - 1 < 0) {
        // Используем фактические данные
        prediction += arCoefficients[j] * extendedData[extendedData.length + i - j - 1];
      } else {
        // Используем прогнозные данные
        prediction += arCoefficients[j] * (extendedData[extendedData.length + i - j - 1] - constant);
      }
    }
    
    // MA-компонента
    for (let j = 0; j < q; j++) {
      if (i - j - 1 < 0 && i - j - 1 + q >= 0) {
        // Используем известные остатки
        prediction += maCoefficients[j] * lastResiduals[q + i - j - 1];
      }
      // Для будущих периодов предполагаем, что остатки равны 0
    }
    
    extendedData.push(prediction);
  }
  
  // Берем только прогнозные значения
  const forecastDiff = extendedData.slice(-periods);
  
  // Интегрируем прогноз d раз
  const forecast: number[] = forecastDiff;
  
  for (let i = d - 1; i >= 0; i--) {
    const origValues = originalValues[i];
    const lastOrigValue = origValues[origValues.length - 1];
    
    // Интегрируем прогноз
    for (let j = 0; j < forecast.length; j++) {
      if (j === 0) {
        forecast[j] = forecast[j] + lastOrigValue;
      } else {
        forecast[j] = forecast[j] + forecast[j - 1];
      }
    }
  }
  
  return forecast;
}

/**
 * Рассчитывает информационный критерий Акаике (AIC)
 * @param n Количество наблюдений
 * @param logLikelihood Логарифм функции правдоподобия
 * @param k Количество параметров
 * @returns Значение AIC
 */
export function calculateAIC(n: number, logLikelihood: number, k: number): number {
  return 2 * k - 2 * logLikelihood;
}

/**
 * Рассчитывает Байесовский информационный критерий (BIC)
 * @param n Количество наблюдений
 * @param logLikelihood Логарифм функции правдоподобия
 * @param k Количество параметров
 * @returns Значение BIC
 */
export function calculateBIC(n: number, logLikelihood: number, k: number): number {
  return k * Math.log(n) - 2 * logLikelihood;
}

/**
 * Рассчитывает логарифм функции правдоподобия для остатков модели
 * @param residuals Остатки модели
 * @returns Логарифм функции правдоподобия
 */
export function calculateLogLikelihood(residuals: number[]): number {
  const n = residuals.length;
  const variance = residuals.reduce((sum, val) => sum + val * val, 0) / n;
  
  return -n / 2 * Math.log(2 * Math.PI * variance) - n / 2;
}

/**
 * Автоматически выбирает наилучшие параметры ARIMA модели
 * @param data Временной ряд
 * @param maxP Максимальный порядок AR
 * @param maxD Максимальный порядок интегрирования
 * @param maxQ Максимальный порядок MA
 * @returns Оптимальные параметры ARIMA
 */
export function autoSelectARIMAParams(
  data: number[],
  maxP: number = 5,
  maxD: number = 2,
  maxQ: number = 5
): ARIMAParams {
  let bestParams: ARIMAParams = { p: 0, d: 0, q: 0 };
  let minAIC = Infinity;
  
  // Сначала определяем порядок интегрирования с помощью теста на стационарность
  let d = 0;
  let currentData = [...data];
  
  // Упрощенная проверка стационарности с использованием автокорреляции
  while (d <= maxD) {
    const acf = autocorrelation(currentData, 20);
    
    // Если автокорреляции быстро затухают, считаем ряд стационарным
    let isStationary = true;
    for (let i = 1; i <= 10; i++) {
      if (Math.abs(acf[i]) > 2 / Math.sqrt(currentData.length)) {
        isStationary = false;
        break;
      }
    }
    
    if (isStationary) {
      break;
    }
    
    d++;
    if (d <= maxD) {
      currentData = differenceTimeSeries(currentData, 1);
    }
  }
  
  // Ограничиваем порядок интегрирования
  d = Math.min(d, maxD);
  
  // Дифференцируем данные d раз
  let diffData = [...data];
  for (let i = 0; i < d; i++) {
    diffData = differenceTimeSeries(diffData, 1);
  }
  
  // Перебираем комбинации p и q
  for (let p = 0; p <= maxP; p++) {
    for (let q = 1; q <= maxQ; q++) {
      if (p === 0 && q === 0) {
        continue; // Пропускаем тривиальную модель
      }
      
      try {
        let result;
        if (p > 0 && q > 0) {
          result = fitARMA(diffData, p, q);
        } else if (p > 0) {
          result = fitAR(diffData, p);
          result.coefficients = [];
        } else { // q > 0
          result = fitMA(diffData, q);
          result.coefficients = [];
        }
        
        const k = p + q + 1; // +1 для константы
        const logLikelihood = calculateLogLikelihood(result.residuals);
        const aic = calculateAIC(diffData.length, logLikelihood, k);
        
        if (aic < minAIC) {
          minAIC = aic;
          bestParams = { p, d, q };
        }
      } catch (error) {
        // Пропускаем комбинации, которые вызывают ошибки
        continue;
      }
    }
    
    if (bestParams.q === 0) {
        bestParams.q = 1;
      }
  }
  
  return bestParams;
}

/**
 * Выполняет прогнозирование с помощью ARIMA
 * @param data Массив точек данных {x, y}
 * @param periods Количество периодов для прогноза
 * @param params Параметры модели ARIMA (optional, если не указаны - будут выбраны автоматически)
 * @param includeConfidenceInterval Включать ли интервал доверия
 * @param confidenceLevel Уровень доверия (по умолчанию 0.95 = 95%)
 * @returns Результат прогнозирования
 */
export function arimaForecast(
  data: DataPoint[],
  periods: number,
  params?: ARIMAParams,
  includeConfidenceInterval: boolean = true,
  confidenceLevel: number = 0.95
): ARIMAResult {
  if (data.length < 3) {
    throw new Error('Для прогнозирования ARIMA требуется минимум 3 точки данных');
  }

  if (periods < 1) {
    throw new Error('Количество периодов для прогноза должно быть положительным числом');
  }

  // Сортируем данные по x
  const sortedData = [...data].sort((a, b) => a.x - b.x);
  
  // Извлекаем значения y для анализа
  const yValues = sortedData.map(point => point.y);
  
  // Определяем параметры ARIMA
  const arimaParams = params || autoSelectARIMAParams(yValues);
  const { p, d, q } = arimaParams;
  
  // Дифференцируем данные d раз
  let diffData = [...yValues];
  const originalValues: any[] = [];
  
  for (let i = 0; i < d; i++) {
    originalValues.push(diffData.slice(0, i + 1));
    diffData = differenceTimeSeries(diffData, 1);
  }
  
  // Оцениваем параметры ARMA-модели для дифференцированных данных
  let armaResult;
  try {
    if (p > 0 && q > 0) {
      armaResult = fitARMA(diffData, p, q);
    } else if (p > 0) {
      const arResult = fitAR(diffData, p);
      armaResult = {
        arCoefficients: arResult.coefficients,
        maCoefficients: [],
        constant: arResult.constant,
        residuals: arResult.residuals
      };
    } else if (q > 0) {
      const maResult = fitMA(diffData, q);
      armaResult = {
        arCoefficients: [],
        maCoefficients: maResult.coefficients,
        constant: maResult.constant,
        residuals: maResult.residuals
      };
    } else {
      // Просто используем среднее значение для прогноза
      const mean = diffData.reduce((sum, val) => sum + val, 0) / diffData.length;
      armaResult = {
        arCoefficients: [],
        maCoefficients: [],
        constant: mean,
        residuals: diffData.map(val => val - mean)
      };
    }
  } catch (error) {
    // Если возникла ошибка, используем более простую модель
    const mean = diffData.reduce((sum, val) => sum + val, 0) / diffData.length;
    armaResult = {
      arCoefficients: [],
      maCoefficients: [],
      constant: mean,
      residuals: diffData.map(val => val - mean)
    };
  }
  
  // Рассчитываем информационные критерии
  const k = p + q + (p > 0 || q > 0 ? 1 : 0); // +1 для константы, если есть AR или MA
  const logLikelihood = calculateLogLikelihood(armaResult.residuals);
  const aic = calculateAIC(diffData.length, logLikelihood, k);
  const bic = calculateBIC(diffData.length, logLikelihood, k);
  
  // Прогнозируем будущие значения
  const forecast = forecastARIMA(yValues, p, d, q, periods);
  
  // Преобразуем прогноз в формат DataPoint
  const lastX = sortedData[sortedData.length - 1].x;
  const forecastData: DataPoint[] = [];
  
  for (let i = 0; i < forecast.length; i++) {
    forecastData.push({ x: lastX + i + 1, y: forecast[i] });
  }
  
  // Рассчитываем доверительные интервалы, если требуется
  let confidenceInterval;
  
  if (includeConfidenceInterval) {
    // Вычисляем стандартное отклонение остатков
    const variance = armaResult.residuals.reduce((sum, val) => sum + val * val, 0) / armaResult.residuals.length;
    const stdDev = Math.sqrt(variance);
    
    // Получаем критическое значение для заданного уровня доверия
    const zScore = getZScore(confidenceLevel);
    
    // Создаем верхний и нижний доверительные интервалы
    const upper: DataPoint[] = [];
    const lower: DataPoint[] = [];
    
          // Расширяем доверительный интервал с течением времени
    for (let i = 0; i < forecastData.length; i++) {
      // Множитель, увеличивающий интервал с удалением от известных данных
      const horizonMultiplier = Math.sqrt(1 + i * 0.1);
      
      // Величина доверительного интервала
      const margin = zScore * stdDev * horizonMultiplier;
      
      upper.push({ x: forecastData[i].x, y: forecastData[i].y + margin });
      lower.push({ x: forecastData[i].x, y: forecastData[i].y - margin });
    }
    
    confidenceInterval = {
      upper,
      lower,
      confidence: confidenceLevel
    };
  }
  
  return {
    originalData: sortedData,
    forecastData,
    params: arimaParams,
    residuals: armaResult.residuals,
    aic,
    bic,
    confidenceInterval,
    coefficients: armaResult.arCoefficients || [], // Добавляем отсутствующее свойство
    constant: armaResult.constant // Добавляем отсутствующее свойство
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