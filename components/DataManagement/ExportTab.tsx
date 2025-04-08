// components/DataManagement/ExportTab.tsx
import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';

interface ExportTabProps {
  parsedData: ParsedData;
  filteredData: ParsedDataRow[];
}

const ExportTab: React.FC<ExportTabProps> = ({ parsedData, filteredData }) => {
  const [dataSelection, setDataSelection] = useState<'all' | 'filtered'>('all');
  const [fileFormat, setFileFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);
  const [includeSummary, setIncludeSummary] = useState<boolean>(false);

  const handleExport = () => {
    // Здесь будет логика экспорта данных в выбранном формате
    // В реальном приложении может использоваться функция из lib/Data/dataExporter.ts
    console.log('Экспорт данных:', {
      dataSelection,
      fileFormat,
      includeHeaders,
      includeSummary
    });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-medium mb-4" style={{ color: themeColors.darkTeal }}>Экспорт данных</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Выберите данные для экспорта</h3>
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
              Все данные ({parsedData.data.length} записей)
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

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Формат файла</h3>
        <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 bg-white border ${fileFormat === 'csv' 
              ? 'border-current ring-2 ring-offset-2' 
              : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
            style={fileFormat === 'csv' ? { color: themeColors.teal, borderColor: themeColors.teal } : {}}
            onClick={() => setFileFormat('csv')}
          >
            CSV
          </button>
          <button 
            className={`px-4 py-2 bg-white border ${fileFormat === 'xlsx' 
              ? 'border-current ring-2 ring-offset-2' 
              : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
            style={fileFormat === 'xlsx' ? { color: themeColors.teal, borderColor: themeColors.teal } : {}}
            onClick={() => setFileFormat('xlsx')}
          >
            Excel (XLSX)
          </button>
          <button 
            className={`px-4 py-2 bg-white border ${fileFormat === 'json' 
              ? 'border-current ring-2 ring-offset-2' 
              : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
            style={fileFormat === 'json' ? { color: themeColors.teal, borderColor: themeColors.teal } : {}}
            onClick={() => setFileFormat('json')}
          >
            JSON
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Дополнительные опции</h3>
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

      <div className="flex justify-end">
        <button 
          className="px-4 py-2 rounded-md text-white hover:bg-opacity-90 transition-colors"
          style={{ backgroundColor: themeColors.teal }}
          onClick={handleExport}
        >
          Экспортировать данные
        </button>
      </div>
    </div>
  );
};

export default ExportTab;