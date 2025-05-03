// lib/Data/dataExporter.ts - Улучшенная реализация
import { ParsedDataRow } from './csvParser';
import * as XLSX from 'xlsx';

/**
 * Функции для экспорта данных в различные форматы
 */

export interface ExportOptions {
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
    
    // Дополнительная аналитика по каждому числовому полю
    fields.forEach(field => {
      const values = data.map(row => row[field])
        .filter(value => value !== null && value !== undefined)
        .map(value => typeof value === 'number' ? value : Number(value))
        .filter(value => !isNaN(value));
      
      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        csv += `\n"Статистика по полю: ${field}"\n`;
        csv += `"Минимум"${delimiter}${min}\n`;
        csv += `"Максимум"${delimiter}${max}\n`;
        csv += `"Среднее"${delimiter}${avg.toFixed(2)}\n`;
        csv += `"Сумма"${delimiter}${sum}\n`;
      }
    });
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
  
  const exportObject: any = {
    data: filteredData,
  };
  
  if (options.includeHeaders) {
    exportObject.fields = fields;
  }
  
  if (options.includeSummary) {
    const summary: any = {
      totalRecords: data.length,
      exportDate: new Date().toISOString(),
      fieldsCount: fields.length
    };
    
    // Дополнительная аналитика по числовым полям
    const statistics: Record<string, any> = {};
    
    fields.forEach(field => {
      const values = data.map(row => row[field])
        .filter(value => value !== null && value !== undefined)
        .map(value => typeof value === 'number' ? value : Number(value))
        .filter(value => !isNaN(value));
      
      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        statistics[field] = {
          min,
          max,
          average: avg,
          sum
        };
      }
    });
    
    if (Object.keys(statistics).length > 0) {
      summary.statistics = statistics;
    }
    
    exportObject.summary = summary;
  }
  
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
  // Проверяем, является ли это экспортом XLSX
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
      data.startsWith('XLSX_BINARY:')) {
    
    // Преобразуем base64 строку в бинарные данные
    const base64Data = data.replace('XLSX_BINARY:', '');
    const binary = atob(base64Data);
    
    // Создаем массив байтов
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    // Создаем Blob из бинарных данных
    const blob = new Blob([array], { type: mimeType });
    
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
    
  } else {
    // Стандартный процесс скачивания для других форматов
    const blob = new Blob([data], { type: mimeType });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Экспортирует данные в формат XLSX
 * @param data Данные для экспорта
 * @param fields Поля (колонки) для экспорта
 * @param options Опции экспорта
 * @returns Base64 строка с бинарными данными в формате XLSX
 */
export function exportToXLSX(
  data: ParsedDataRow[],
  fields: string[],
  options: ExportOptions = { includeHeaders: true, includeSummary: false }
): string {
  try {
    // Создаем рабочую книгу
    const wb = XLSX.utils.book_new();
    
    // Подготавливаем данные для листа
    const wsData: any[][] = [];
    
    // Добавляем заголовки, если нужно
    if (options.includeHeaders) {
      wsData.push(fields);
    }
    
    // Добавляем данные
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
        } else {
          return value;
        }
      });
      
      wsData.push(rowValues);
    });
    
    // Создаем лист с данными
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Данные');
    
    // Добавляем сводную информацию, если нужно
    if (options.includeSummary) {
      const summaryWsData: any[][] = [
        ['Сводная информация'],
        [],
        ['Общее количество записей', data.length],
        ['Дата экспорта', new Date().toLocaleDateString()],
        ['Количество полей', fields.length],
        []
      ];
      
      // Дополнительная аналитика по числовым полям
      fields.forEach(field => {
        const values = data.map(row => row[field])
          .filter(value => value !== null && value !== undefined)
          .map(value => typeof value === 'number' ? value : Number(value))
          .filter(value => !isNaN(value));
        
        if (values.length > 0) {
          const sum = values.reduce((acc, val) => acc + val, 0);
          const avg = sum / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          
          summaryWsData.push([`Статистика по полю: ${field}`]);
          summaryWsData.push(['Минимум', min]);
          summaryWsData.push(['Максимум', max]);
          summaryWsData.push(['Среднее', avg.toFixed(2)]);
          summaryWsData.push(['Сумма', sum]);
          summaryWsData.push([]);
        }
      });
      
      // Создаем лист со сводной информацией
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryWsData);
      
      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Сводка');
    }
    
    // Преобразуем книгу в бинарные данные
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    
    // Возвращаем бинарные данные с префиксом для последующей обработки
    return `XLSX_BINARY:${wbout}`;
    
  } catch (error) {
    console.error('Ошибка при экспорте в XLSX:', error);
    throw new Error(`Ошибка при экспорте в XLSX: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
  }
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