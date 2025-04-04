import { ParsedData, ParsedDataRow } from './csvParser';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: string;
  message: string;
  field?: string;
  row?: number;
}

export interface ValidationWarning {
  type: string;
  message: string;
  field?: string;
  row?: number;
}

export interface ValidationOptions {
  requiredFields: string[];
  dateField: string;
  valueField: string;
  idField?: string;
  minRows?: number;
}

/**
 * Проверяет, что все обязательные поля присутствуют в данных
 * @param fields - Список полей в данных
 * @param requiredFields - Список обязательных полей
 * @returns Массив отсутствующих полей
 */
function checkRequiredFields(fields: string[], requiredFields: string[]): string[] {
  return requiredFields.filter(field => !fields.includes(field));
}

/**
 * Проверяет, является ли строка валидной датой
 * @param dateStr - Строка с датой
 * @returns Булево значение
 */
function isValidDate(dateStr: string | number | Date | null): boolean {
  if (dateStr === null) return false;
  if (dateStr instanceof Date) return !isNaN(dateStr.getTime());
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Проверяет, является ли значение числом
 * @param value - Значение для проверки
 * @returns Булево значение
 */
function isValidNumber(value: string | number | Date | null): boolean {
  if (value === null) return false;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') {
    return !isNaN(Number(value.trim()));
  }
  return false;
}

/**
 * Проверяет наличие дубликатов по заданному полю
 * @param data - Данные для проверки
 * @param field - Поле для проверки
 * @returns Массив индексов строк с дубликатами
 */
function findDuplicates(data: ParsedDataRow[], field: string): number[] {
  const valueSet = new Set<string>();
  const duplicateIndices: number[] = [];

  data.forEach((row, index) => {
    const value = String(row[field]);
    if (valueSet.has(value)) {
      duplicateIndices.push(index);
    } else {
      valueSet.add(value);
    }
  });

  return duplicateIndices;
}

/**
 * Проверяет данные на пропущенные значения
 * @param data - Данные для проверки
 * @param fields - Поля для проверки
 * @returns Объект с индексами строк и именами полей с пропущенными значениями
 */
function findMissingValues(data: ParsedDataRow[], fields: string[]): { row: number; field: string }[] {
  const missingValues: { row: number; field: string }[] = [];

  data.forEach((row, rowIndex) => {
    fields.forEach(field => {
      if (row[field] === null || row[field] === undefined || row[field] === '') {
        missingValues.push({ row: rowIndex, field });
      }
    });
  });

  return missingValues;
}

/**
 * Валидирует загруженные данные
 * @param parsedData - Распарсенные данные
 * @param options - Опции валидации
 * @returns Результат валидации
 */
export function validateData(
  parsedData: ParsedData,
  options: ValidationOptions
): ValidationResult {
  const { requiredFields, dateField, valueField, minRows = 2 } = options;
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Проверка наличия обязательных полей
  const missingFields = checkRequiredFields(parsedData.fields, requiredFields);
  if (missingFields.length > 0) {
    errors.push({
      type: 'missing_required_fields',
      message: `Отсутствуют обязательные поля: ${missingFields.join(', ')}`,
    });
  }

  // Проверка минимального количества строк
  if (parsedData.data.length < minRows) {
    errors.push({
      type: 'insufficient_data',
      message: `Недостаточно данных. Минимальное количество строк: ${minRows}`,
    });
  }

  // Проверка формата даты
  parsedData.data.forEach((row, rowIndex) => {
    if (dateField in row && !isValidDate(row[dateField])) {
      errors.push({
        type: 'invalid_date',
        message: `Некорректная дата в строке ${rowIndex + 1}`,
        field: dateField,
        row: rowIndex,
      });
    }
  });

  // Проверка формата числовых значений
  parsedData.data.forEach((row, rowIndex) => {
    if (valueField in row && !isValidNumber(row[valueField])) {
      errors.push({
        type: 'invalid_number',
        message: `Некорректное числовое значение в строке ${rowIndex + 1}`,
        field: valueField,
        row: rowIndex,
      });
    }
  });

  // Проверка пропущенных значений в обязательных полях
  const missingValues = findMissingValues(parsedData.data, requiredFields);
  missingValues.forEach(({ row, field }) => {
    errors.push({
      type: 'missing_value',
      message: `Пропущенное значение в поле "${field}" в строке ${row + 1}`,
      field,
      row,
    });
  });

  // Проверка наличия дубликатов, если указано поле идентификатора
  if (options.idField) {
    const duplicates = findDuplicates(parsedData.data, options.idField);
    if (duplicates.length > 0) {
      warnings.push({
        type: 'duplicate_ids',
        message: `Найдены дубликаты идентификаторов в строках: ${duplicates
          .map(i => i + 1)
          .join(', ')}`,
        field: options.idField,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}