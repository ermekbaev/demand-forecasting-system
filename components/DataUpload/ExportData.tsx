import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ParsedDataRow } from '@/lib/Data/csvParser';

interface ExportDataProps {
  allData: ParsedDataRow[];
  filteredData: ParsedDataRow[];
  fields: string[];
  onExport?: (format: string, exportedData: string, filename: string) => void;
}

const ExportData: React.FC<ExportDataProps> = ({
  allData,
  filteredData,
  fields,
  onExport
}) => {
  const [dataSelection, setDataSelection] = useState<'all' | 'filtered'>('all');
  const [fileFormat, setFileFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);
  const [includeSummary, setIncludeSummary] = useState<boolean>(false);
  
  // Определение данных для экспорта
  const dataToExport = dataSelection === 'all' ? allData : filteredData;
  
  // Функция для экспорта в CSV
  const exportAsCSV = (): string => {
    let csv = '';
    
    // Добавление заголовков
    if (includeHeaders) {
      csv += fields.join(',') + '\n';
    }
    
    // Добавление данных
    dataToExport.forEach(row => {
      const rowValues = fields.map(field => {
        const value = row[field];
        
        // Форматирование значений в зависимости от типа
        if (value === null || value === undefined) {
          return '';
        } else if (value instanceof Date) {
          return value.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (typeof value === 'string' && value.includes(',')) {
          // Экранирование строк с запятыми
          return `"${value}"`;
        } else {
          return String(value);
        }
      });
      
      csv += rowValues.join(',') + '\n';
    });
    
    // Добавление сводной информации, если нужно
    if (includeSummary) {
      csv += '\n"Сводная информация"\n';
      csv += `"Общее количество записей",${dataToExport.length}\n`;
      csv += `"Дата экспорта","${new Date().toLocaleDateString()}"\n`;
    }
    
    return csv;
  };
  
  // Функция для экспорта в JSON
  const exportAsJSON = (): string => {
    const exportObject = {
      data: dataToExport,
      totalRecords: dataToExport.length,
      fields: includeHeaders ? fields : undefined,
      exportDate: new Date().toISOString(),
      summary: includeSummary ? {
        totalRecords: dataToExport.length,
        exportDate: new Date().toISOString()
      } : undefined
    };
    
    return JSON.stringify(exportObject, (key, value) => {
      // Преобразование дат в ISO формат
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }, 2);
  };
  
  // Функция для экспорта в XLSX
  const exportAsXLSX = (): string => {
    // В реальном приложении здесь был бы код для генерации XLSX файла
    // Для простоты реализации, здесь вернем CSV с пометкой
    const csv = exportAsCSV();
    return `XLSX_PLACEHOLDER:${csv}`;
  };
  
  // Обработчик экспорта данных
  const handleExport = () => {
    let exportedData: string;
    let mimeType: string;
    let fileExtension: string;
    
    switch (fileFormat) {
      case 'json':
        exportedData = exportAsJSON();
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'xlsx':
        exportedData = exportAsXLSX();
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      default:
        exportedData = exportAsCSV();
        mimeType = 'text/csv';
        fileExtension = 'csv';
    }
    
    const filename = `export-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    
    // Вызываем колбэк, если он предоставлен
    if (onExport) {
      onExport(fileFormat, exportedData, filename);
    } else {
      // Инициируем загрузку файла
      const blob = new Blob([exportedData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Выберите данные для экспорта</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="export-all"
              type="radio"
              name="export-data"
              value="all"
              checked={dataSelection === 'all'}
              onChange={() => setDataSelection('all')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="export-all" className="ml-3 block text-sm font-medium text-gray-700">
              Все данные ({allData.length} записей)
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="export-filtered"
              type="radio"
              name="export-data"
              value="filtered"
              checked={dataSelection === 'filtered'}
              onChange={() => setDataSelection('filtered')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="export-filtered" className="ml-3 block text-sm font-medium text-gray-700">
              Отфильтрованные данные ({filteredData.length} записей)
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Формат файла</h3>
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 bg-white border ${fileFormat === 'csv' 
              ? `border-current ring-2 ring-offset-2` 
              : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
            style={fileFormat === 'csv' ? { color: themeColors.teal, borderColor: themeColors.teal } : {}}
            onClick={() => setFileFormat('csv')}
          >
            CSV
          </button>
          <button 
            className={`px-4 py-2 bg-white border ${fileFormat === 'xlsx' 
              ? `border-current ring-2 ring-offset-2` 
              : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
            style={fileFormat === 'xlsx' ? { color: themeColors.teal, borderColor: themeColors.teal } : {}}
            onClick={() => setFileFormat('xlsx')}
          >
            Excel (XLSX)
          </button>
          <button 
            className={`px-4 py-2 bg-white border ${fileFormat === 'json' 
              ? `border-current ring-2 ring-offset-2` 
              : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
            style={fileFormat === 'json' ? { color: themeColors.teal, borderColor: themeColors.teal } : {}}
            onClick={() => setFileFormat('json')}
          >
            JSON
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Дополнительные опции</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="include-headers"
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="include-headers" className="ml-3 block text-sm font-medium text-gray-700">
              Включить заголовки столбцов
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="include-summary"
              type="checkbox"
              checked={includeSummary}
              onChange={(e) => setIncludeSummary(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="include-summary" className="ml-3 block text-sm font-medium text-gray-700">
              Добавить сводную информацию
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          className="px-4 py-2 rounded-md text-white hover:bg-opacity-90 transition-colors"
          style={{ backgroundColor: themeColors.teal }}
          onClick={handleExport}
          disabled={dataToExport.length === 0}
        >
          Экспортировать данные
        </button>
      </div>
      
      {/* Превью экспорта */}
      {dataToExport.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Предпросмотр экспорта ({fileFormat.toUpperCase()})</h3>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 overflow-auto max-h-60">
            <pre className="text-xs whitespace-pre-wrap">
              {fileFormat === 'json' && exportAsJSON().slice(0, 1000) + (exportAsJSON().length > 1000 ? '...' : '')}
              {fileFormat === 'csv' && exportAsCSV().slice(0, 1000) + (exportAsCSV().length > 1000 ? '...' : '')}
              {fileFormat === 'xlsx' && 'Предпросмотр недоступен для формата XLSX'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;