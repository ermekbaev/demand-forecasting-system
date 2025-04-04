/**
 * Модуль для прогнозирования данных с помощью линейной регрессии
 */

interface DataPoint {
    x: number;
    y: number;
  }
  
  interface RegressionResult {
    slope: number;
    intercept: number;
    r2: number;
  }
  
  interface ForecastResult {
    originalData: DataPoint[];
    forecastData: DataPoint[];
    regression: RegressionResult;
    confidenceInterval?: {
      upper: DataPoint[];
      lower: DataPoint[];
      confidence: number;
    };
  }
  
  /**
   * Рассчитывает параметры линейной регрессии (y = mx + b)
   * @param data Массив точек данных в формате {x, y}
   * @returns Результат регрессии {slope (m), intercept (b), r2}
   */
  export function calculateLinearRegression(data: DataPoint[]): RegressionResult {
    if (data.length < 2) {
      throw new Error('Для линейной регрессии требуется минимум 2 точки данных');
    }
  
    // Количество точек
    const n = data.length;
  
    // Расчет сумм
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;
  
    for (const point of data) {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumXX += point.x * point.x;
      sumYY += point.y * point.y;
    }
  
    // Расчет коэффициентов
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
  
    // Расчет R-квадрат
    const avgY = sumY / n;
    let totalVariation = 0;
    let explainedVariation = 0;
  
    for (const point of data) {
      const predicted = slope * point.x + intercept;
      totalVariation += Math.pow(point.y - avgY, 2);
      explainedVariation += Math.pow(predicted - avgY, 2);
    }
  
    const r2 = explainedVariation / totalVariation;
  
    return { slope, intercept, r2 };
  }
  
  /**
   * Прогнозирует значения на основе линейной регрессии
   * @param data Массив точек данных в формате {x, y}
   * @param periods Количество периодов для прогноза
   * @param includeConfidenceInterval Включать ли интервал доверия
   * @param confidenceLevel Уровень доверия (по умолчанию 0.95 = 95%)
   * @returns Результат прогноза
   */
  export function linearRegressionForecast(
    data: DataPoint[],
    periods: number,
    includeConfidenceInterval: boolean = true,
    confidenceLevel: number = 0.95
  ): ForecastResult {
    if (data.length < 2) {
      throw new Error('Для прогнозирования требуется минимум 2 точки данных');
    }
  
    if (periods < 1) {
      throw new Error('Количество периодов для прогноза должно быть положительным числом');
    }
  
    // Сортируем данные по x
    const sortedData = [...data].sort((a, b) => a.x - b.x);
    
    // Рассчитываем параметры регрессии
    const regression = calculateLinearRegression(sortedData);
    
    // Получаем последнее значение x
    const lastX = sortedData[sortedData.length - 1].x;
    
    // Создаем прогноз
    const forecastData: DataPoint[] = [];
    
    for (let i = 1; i <= periods; i++) {
      const x = lastX + i;
      const y = regression.slope * x + regression.intercept;
      forecastData.push({ x, y });
    }
    
    // Вычисляем интервал доверия, если необходимо
    let confidenceInterval;
    
    if (includeConfidenceInterval) {
      const n = data.length;
      
      // Среднее значение x
      const meanX = data.reduce((sum, point) => sum + point.x, 0) / n;
      
      // Стандартная ошибка оценки
      let sumSquaredErrors = 0;
      for (const point of data) {
        const predicted = regression.slope * point.x + regression.intercept;
        sumSquaredErrors += Math.pow(point.y - predicted, 2);
      }
      
      const standardError = Math.sqrt(sumSquaredErrors / (n - 2));
      
      // Критическое значение t для заданного уровня доверия
      // Используем приближение для t-распределения
      const alpha = 1 - confidenceLevel;
      const tCritical = calculateApproximateTValue(n - 2, alpha / 2);
      
      // Вычисляем верхнюю и нижнюю границы интервала доверия
      const upper: DataPoint[] = [];
      const lower: DataPoint[] = [];
      
      // Для исходных данных
      for (const point of sortedData) {
        const predicted = regression.slope * point.x + regression.intercept;
        const se = standardError * Math.sqrt(1 + 1/n + Math.pow(point.x - meanX, 2) / 
          data.reduce((sum, p) => sum + Math.pow(p.x - meanX, 2), 0));
        
        const margin = tCritical * se;
        upper.push({ x: point.x, y: predicted + margin });
        lower.push({ x: point.x, y: predicted - margin });
      }
      
      // Для прогнозируемых данных
      for (const point of forecastData) {
        const se = standardError * Math.sqrt(1 + 1/n + Math.pow(point.x - meanX, 2) / 
          data.reduce((sum, p) => sum + Math.pow(p.x - meanX, 2), 0));
        
        const margin = tCritical * se;
        upper.push({ x: point.x, y: point.y + margin });
        lower.push({ x: point.x, y: point.y - margin });
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
      regression,
      confidenceInterval
    };
  }
  
  /**
   * Преобразует временной ряд в формат для линейной регрессии
   * @param timeData Массив объектов с датой и значением
   * @returns Массив точек {x, y} для регрессии
   */
  export function convertTimeSeriesForRegression(
    timeData: Array<{ date: Date; value: number }>
  ): DataPoint[] {
    if (timeData.length === 0) return [];
    
    // Сортируем по дате
    const sortedData = [...timeData].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Преобразуем даты в числовые значения (количество дней от первой даты)
    const firstDate = sortedData[0].date.getTime();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    
    return sortedData.map(item => ({
      x: Math.round((item.date.getTime() - firstDate) / millisecondsPerDay),
      y: item.value
    }));
  }
  
  /**
   * Преобразует результаты регрессии обратно во временной ряд
   * @param regressionData Результат регрессии
   * @param firstDate Первая дата в исходных данных
   * @returns Временной ряд с датами и значениями
   */
  export function convertRegressionToTimeSeries(
    regressionData: { x: number; y: number }[],
    firstDate: Date
  ): Array<{ date: Date; value: number }> {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const baseTimestamp = firstDate.getTime();
    
    return regressionData.map(point => ({
      date: new Date(baseTimestamp + point.x * millisecondsPerDay),
      value: point.y
    }));
  }
  
  /**
   * Рассчитывает приближенное значение t-распределения
   * @param degreesOfFreedom Степени свободы
   * @param alpha Уровень значимости
   * @returns Критическое значение t
   */
  function calculateApproximateTValue(degreesOfFreedom: number, alpha: number): number {
    // Аппроксимация t-распределения для больших выборок
    if (degreesOfFreedom > 30) {
      // Используем стандартное нормальное распределение для больших выборок
      return approximateNormalDistribution(alpha);
    }
    
    // Для малых выборок используем аппроксимацию t-распределения
    // Это очень грубое приближение
    const z = approximateNormalDistribution(alpha);
    const correction = 0.5 + 0.3 / Math.sqrt(degreesOfFreedom);
    
    return z * correction;
  }
  
  /**
   * Аппроксимация обратной функции стандартного нормального распределения
   * @param alpha Уровень значимости
   * @returns Z-значение
   */
  function approximateNormalDistribution(alpha: number): number {
    // Аппроксимация Абрамовица и Стегуна
    if (alpha < 0.5) {
      // Для малых alpha используем таблицу
      if (alpha <= 0.001) return 3.09;
      if (alpha <= 0.01) return 2.33;
      if (alpha <= 0.025) return 1.96;
      if (alpha <= 0.05) return 1.645;
      if (alpha <= 0.1) return 1.28;
      return 0.67; // alpha <= 0.25
    }
    
    // Для alpha > 0.5 инвертируем значение
    return -approximateNormalDistribution(1 - alpha);
  }