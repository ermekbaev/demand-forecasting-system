import { ParsedDataRow } from './csvParser';

/**
 * Функции для предобработки данных перед анализом и прогнозированием
 */

/**
 * Обнаруживает и удаляет выбросы из данных временного ряда
 * @param data Массив данных
 * @param field Поле со значениями
 * @param threshold Порог для определения выбросов (кол-во стандартных отклонений)
 * @returns Очищенные данные
 */
export function removeOutliers(
  data: ParsedDataRow[],
  field: string,
  threshold: number = 2
): ParsedDataRow[] {
  if (data.length < 3) return data;

  // Вычисляем среднее значение
  const values = data.map(row => Number(row[field])).filter(val => !isNaN(val));
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Вычисляем стандартное отклонение
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Удаляем выбросы
  return data.filter(row => {
    const value = Number(row[field]);
    if (isNaN(value)) return true; // Сохраняем строки с не-числовыми значениями
    return Math.abs(value - mean) <= threshold * stdDev;
  });
}

/**
 * Заполняет пропущенные значения в данных
 * @param data Массив данных
 * @param field Поле, которое нужно заполнить
 * @param method Метод заполнения (mean, median, previous, next)
 * @returns Данные с заполненными значениями
 */
export function fillMissingValues(
  data: ParsedDataRow[],
  field: string,
  method: 'mean' | 'median' | 'previous' | 'next' = 'mean'
): ParsedDataRow[] {
  if (data.length === 0) return data;

  // Копируем данные
  const filledData = [...data];

  // Получаем валидные значения
  const validValues = data
    .map(row => row[field])
    .filter(val => val !== null && val !== undefined && val !== '')
    .map(val => Number(val))
    .filter(val => !isNaN(val));

  if (validValues.length === 0) return data;

  let fillValue: number;

  switch (method) {
    case 'mean':
      // Среднее значение
      fillValue = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
      break;
    case 'median':
      // Медиана
      const sortedValues = [...validValues].sort((a, b) => a - b);
      const middle = Math.floor(sortedValues.length / 2);
      fillValue = sortedValues.length % 2 === 0
        ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
        : sortedValues[middle];
      break;
    case 'previous':
      // Для previous и next метода мы заполняем значения непосредственно в цикле
      let lastValidValue: number | null = null;
      for (let i = 0; i < filledData.length; i++) {
        const value = filledData[i][field];
        if (value !== null && value !== undefined && value !== '' && !isNaN(Number(value))) {
          lastValidValue = Number(value);
        } else if (lastValidValue !== null) {
          filledData[i] = { ...filledData[i], [field]: lastValidValue };
        }
      }
      return filledData;
    case 'next':
      let nextValidValue: number | null = null;
      for (let i = filledData.length - 1; i >= 0; i--) {
        const value = filledData[i][field];
        if (value !== null && value !== undefined && value !== '' && !isNaN(Number(value))) {
          nextValidValue = Number(value);
        } else if (nextValidValue !== null) {
          filledData[i] = { ...filledData[i], [field]: nextValidValue };
        }
      }
      return filledData;
    default:
      fillValue = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  }

  // Заполняем пропущенные значения
  return filledData.map(row => {
    const value = row[field];
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
      return { ...row, [field]: fillValue };
    }
    return row;
  });
}

/**
 * Агрегирует данные по временному интервалу
 * @param data Массив данных
 * @param dateField Поле с датой
 * @param valueField Поле со значениями
 * @param interval Интервал агрегации (day, week, month, quarter, year)
 * @param aggregationFn Функция агрегации (sum, avg, max, min)
 * @returns Агрегированные данные
 */
export function aggregateByTimeInterval(
  data: ParsedDataRow[],
  dateField: string,
  valueField: string,
  interval: 'day' | 'week' | 'month' | 'quarter' | 'year',
  aggregationFn: 'sum' | 'avg' | 'max' | 'min' = 'sum'
): Array<{ date: Date; value: number }> {
  if (data.length === 0) return [];

  // Группируем данные по интервалу
  const groupedData: { [key: string]: number[] } = {};

  data.forEach(row => {
    const dateValue = row[dateField];
    let date: Date | null = null;

    if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else {
      return; // Пропускаем строки с некорректной датой
    }

    if (isNaN(date.getTime())) return;

    const value = Number(row[valueField]);
    if (isNaN(value)) return;

    // Получаем ключ в зависимости от интервала
    let key: string;
    switch (interval) {
      case 'day':
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        // Получаем начало недели (понедельник)
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(diff);
        key = startOfWeek.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(value);
  });

  // Агрегируем значения в каждой группе
  const result: Array<{ date: Date; value: number }> = [];

  for (const [key, values] of Object.entries(groupedData)) {
    let aggregatedValue: number;

    switch (aggregationFn) {
      case 'sum':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'avg':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      default:
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
    }

    // Создаем дату из ключа
    let date: Date;
    if (key.includes('Q')) {
      // Обрабатываем кварталы
      const [year, quarter] = key.split('-Q');
      const month = (Number(quarter) - 1) * 3;
      date = new Date(Number(year), month, 1);
    } else if (key.length === 7) {
      // Формат YYYY-MM для месяцев
      const [year, month] = key.split('-');
      date = new Date(Number(year), Number(month) - 1, 1);
    } else if (key.length === 4) {
      // Формат YYYY для годов
      date = new Date(Number(key), 0, 1);
    } else {
      // Формат YYYY-MM-DD для дней и недель
      date = new Date(key);
    }

    result.push({ date, value: aggregatedValue });
  }

  // Сортируем результат по датам
  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Нормализует числовые значения в указанном диапазоне
 * @param data Массив данных
 * @param field Поле, которое нужно нормализовать
 * @param min Минимальное значение после нормализации
 * @param max Максимальное значение после нормализации
 * @returns Данные с нормализованными значениями
 */
export function normalizeValues(
  data: ParsedDataRow[],
  field: string,
  min: number = 0,
  max: number = 1
): ParsedDataRow[] {
  if (data.length === 0) return data;

  // Находим минимальное и максимальное значения в данных
  const values = data
    .map(row => Number(row[field]))
    .filter(val => !isNaN(val));

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  // Если все значения одинаковые, просто возвращаем средину диапазона
  if (dataMax === dataMin) {
    const medianValue = (min + max) / 2;
    return data.map(row => {
      const value = Number(row[field]);
      if (!isNaN(value)) {
        return { ...row, [field]: medianValue };
      }
      return row;
    });
  }

  // Нормализуем значения в указанный диапазон
  return data.map(row => {
    const value = Number(row[field]);
    if (!isNaN(value)) {
      const normalized = ((value - dataMin) / (dataMax - dataMin)) * (max - min) + min;
      return { ...row, [field]: normalized };
    }
    return row;
  });
}