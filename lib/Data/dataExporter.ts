import { ParsedDataRow } from './csvParser';

/**
 * Функции для экспорта данных в различные форматы
 */

interface ExportOptions {
  includeHeaders: boolean;
  includeSummary: boolean;
  delimiter?: string; // Для CSV
  dateFormat?: string; // Формат дат
}

/**
 * Экспортирует данные в формат CSV
 * @param data Данные для экспорта
 * @param fields Поля (колонки) для экспорта
 * @param options Опции экспорта
 * @returns Строка в формате CSV
 */
export function exportToCSV(
  data: ParsedDataRow[],
  fields: string[],
  options: ExportOptions = { includeHeaders: true, includeSummary: false }
): string {
  const delimiter = options.delimiter || ',';
  let csv = '';
  
  // Добавление заголовков
  if (options.includeHeaders) {
    csv += fields.join(delimiter) + '\n';
  }
  
  // Добавление данных
  data.forEach(row => {
    const rowValues = fields.map(field => {
      const value = row[field];
      
      // Форматирование значений в зависимости от типа
      if (value === null || value === undefined) {
        return '';
      } else if (value instanceof Date) {
        if (options.dateFormat) {
          return formatDate(value, options.dateFormat);
        } else {
          return value.toISOString().split('T')[0]; // YYYY-MM-DD
        }
      } else if (typeof value === 'string' && value.includes(delimiter)) {
        // Экранирование строк с разделителем
        return `"${value.replace(/"/g, '""')}"`;
      } else {
        return String(value);
      }
    });
    
    csv += rowValues.join(delimiter) + '\n';
  });
  
  // Добавление сводной информации, если нужно
  if (options.includeSummary) {
    csv += '\n"Сводная информация"\n';
    csv += `"Общее количество записей"${delimiter}${data.length}\n`;
    csv += `"Дата экспорта"${delimiter}"${new Date().toLocaleDateString()}"\n`;
    csv += `"Количество полей"${delimiter}${fields.length}\n`;
  }
  
  return csv;
}

/**
 * Экспортирует данные в формат JSON
 * @param data Данные для экспорта
 * @param fields Поля (колонки) для экспорта
 * @param options Опции экспорта
 * @returns Строка в формате JSON
 */
export function exportToJSON(
  data: ParsedDataRow[],
  fields: string[],
  options: ExportOptions = { includeHeaders: true, includeSummary: false }
): string {
  // Фильтруем данные, оставляя только нужные поля
  const filteredData = data.map(row => {
    const filteredRow: Record<string, any> = {};
    fields.forEach(field => {
      // Если это дата и задан формат, форматируем
      if (row[field] instanceof Date && options.dateFormat) {
        filteredRow[field] = formatDate(row[field] as Date, options.dateFormat);
      } else {
        filteredRow[field] = row[field];
      }
    });
    return filteredRow;
  });
  
  const exportObject = {
    data: filteredData,
    totalRecords: data.length,
    fields: options.includeHeaders ? fields : undefined,
    exportDate: new Date().toISOString(),
    summary: options.includeSummary ? {
      totalRecords: data.length,
      exportDate: new Date().toISOString(),
      fieldsCount: fields.length
    } : undefined
  };
  
  return JSON.stringify(exportObject, (key, value) => {
    // Преобразование дат в ISO формат
    if (value instanceof Date) {
      if (options.dateFormat) {
        return formatDate(value, options.dateFormat);
      }
      return value.toISOString();
    }
    return value;
  }, 2);
}

/**
 * Экспортирует данные для скачивания в браузере
 * @param data Данные для экспорта (строка)
 * @param filename Имя файла
 * @param mimeType MIME-тип файла
 */
export function downloadData(data: string, filename: string, mimeType: string): void {
  // Создаем Blob из данных
  const blob = new Blob([data], { type: mimeType });
  
  // Создаем ссылку для скачивания
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // Добавляем в документ и кликаем для скачивания
  document.body.appendChild(a);
  a.click();
  
  // Чистим за собой
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Экспортирует данные в формат XLSX
 * @param data Данные для экспорта
 * @param fields Поля (колонки) для экспорта
 * @param options Опции экспорта
 * @returns Бинарные данные в формате XLSX
 */
export function exportToXLSX(
  data: ParsedDataRow[],
  fields: string[],
  options: ExportOptions = { includeHeaders: true, includeSummary: false }
): string {
  // В реальном приложении здесь был бы код для генерации XLSX файла
  // с использованием библиотеки типа SheetJS (xlsx)
  // Для упрощения реализации вернем CSV с пометкой
  return `XLSX_PLACEHOLDER:${exportToCSV(data, fields, options)}`;
}

/**
 * Форматирует дату в соответствии с форматом
 * @param date Дата для форматирования
 * @param format Формат (DD - день, MM - месяц, YYYY - год, YY - короткий год)
 * @returns Отформатированная строка даты
 */
function formatDate(date: Date, format: string): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const shortYear = year.slice(-2);
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('YY', shortYear);
}