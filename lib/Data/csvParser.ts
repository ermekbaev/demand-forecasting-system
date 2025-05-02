import Papa from 'papaparse';

// Улучшенный интерфейс ParsedDataRow для безопасной работы с разными типами данных
export interface ParsedDataRow {
  [key: string]: string | number | Date | null;
  date: Date | string; // Добавляем опциональное поле date для типизации
}

export interface ParsedData {
  data: ParsedDataRow[];
  fields: string[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

interface CSVParserOptions {
  header?: boolean;
  delimiter?: string;
  dynamicTyping?: boolean;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
}

/**
 * Парсит CSV-строку в структурированные данные
 * @param csvString - Содержимое CSV-файла в виде строки
 * @param options - Опции парсинга
 * @returns Объект с распарсенными данными, полями и метаданными
 */
export function parseCSV(csvString: string, options: CSVParserOptions = {}): ParsedData {
  const defaultOptions: CSVParserOptions = {
    header: true,
    delimiter: ',',
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  };

  const parseOptions = { ...defaultOptions, ...options };
  
  const result = Papa.parse(csvString, parseOptions);

  // Преобразуем данные для использования строковых дат в формате Date
  const processedData = (result.data as ParsedDataRow[]).map(row => {
    const newRow: ParsedDataRow = { ...row };
    
    // Ищем поля, которые могут содержать даты
    Object.keys(newRow).forEach(key => {
      if (
        typeof newRow[key] === 'string' && 
        (
          key.toLowerCase().includes('date') || 
          key.toLowerCase().includes('time') ||
          /^\d{4}-\d{2}-\d{2}/.test(newRow[key] as string) // Проверка на ISO формат даты
        )
      ) {
        try {
          const dateValue = new Date(newRow[key] as string);
          if (!isNaN(dateValue.getTime())) {
            newRow[key] = dateValue;
          }
        } catch (e) {
          // Если не смогли преобразовать в дату, оставляем как есть
        }
      }
    });
    
    return newRow;
  });

  return {
    data: processedData,
    fields: result.meta.fields || [],
    errors: result.errors,
    meta: result.meta,
  };
}

/**
 * Преобразует данные временного ряда, гарантируя правильный формат даты
 * @param data - Распарсенные данные
 * @param dateField - Имя поля с датой
 * @param valueField - Имя поля со значением (количество продаж)
 * @returns Массив объектов {date, value}
 */
export function processTimeSeriesData(
  data: ParsedDataRow[],
  dateField: string,
  valueField: string
): Array<{ date: Date; value: number }> {
  return data
    .map((row) => {
      const dateValue = row[dateField];
      const value = Number(row[valueField]);

      // Преобразуем строку даты в объект Date
      let date: Date | null = null;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      }

      // Проверяем валидность даты и значения
      if (date && !isNaN(date.getTime()) && !isNaN(value)) {
        return { date, value };
      }
      return null;
    })
    .filter((item): item is { date: Date; value: number } => item !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Преобразует данные из Excel-файла в формат CSV
 * @param excelFile - Excel-файл
 * @returns Promise с CSV-строкой
 */
export async function excelToCSV(excelFile: File): Promise<string> {
  // Здесь будет код для конвертации Excel в CSV
  // Используем библиотеку SheetJS (xlsx) для работы с Excel
  throw new Error('Excel to CSV conversion not implemented yet');
}

/**
 * Преобразует файл в строку
 * @param file - Файл для чтения
 * @returns Promise с содержимым файла в виде строки
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Ошибка чтения файла'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    reader.readAsText(file);
  });
}