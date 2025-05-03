// components/DataManagement/ExportTabWithTemplates.tsx
import React, { useState, useEffect } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';
import { exportToCSV, exportToJSON, exportToXLSX, downloadData, ExportOptions } from '@/lib/Data/dataExporter';
import SettingsButton from '@/components/Settings/SettingsButton';
import { useSettings } from '@/Context/SettingsContext';
import { ExportTemplate, getExportTemplates, getDefaultExportTemplate } from '@/lib/Data/exportTempletes';
import ExportTemplateManager from '@/components/DataExport/ExportTemplateManager';

interface ExportTabWithTemplatesProps {
  parsedData: ParsedData;
  filteredData: ParsedDataRow[];
}

const ExportTabWithTemplates: React.FC<ExportTabWithTemplatesProps> = ({ parsedData, filteredData }) => {
  const [dataSelection, setDataSelection] = useState<'all' | 'filtered'>('all');
  const [fileFormat, setFileFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);
  const [includeSummary, setIncludeSummary] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(parsedData.fields);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [showTemplateManager, setShowTemplateManager] = useState<boolean>(false);
  const { generalSettings } = useSettings();

  // Загрузка шаблонов и настройка шаблона по умолчанию
  useEffect(() => {
    const loadedTemplates = getExportTemplates();
    setTemplates(loadedTemplates);
    
    // Проверяем наличие шаблона по умолчанию
    const defaultTemplate = getDefaultExportTemplate();
    if (defaultTemplate) {
      setSelectedTemplate(defaultTemplate);
      applyTemplate(defaultTemplate);
    }
  }, []);
  
  // Применение шаблона к текущим настройкам
  const applyTemplate = (template: ExportTemplate) => {
    setFileFormat(template.format as 'csv' | 'xlsx' | 'json'); // Приведение типа для совместимости
    setIncludeHeaders(template.options.includeHeaders);
    setIncludeSummary(template.options.includeSummary);
    
    // Проверяем, что выбранные поля существуют в текущих данных
    const validFields = template.selectedFields.filter((field:any) => 
      parsedData.fields.includes(field)
    );
    setSelectedFields(validFields.length > 0 ? validFields : parsedData.fields);
  };

  // Обработка выбора полей для экспорта
  const handleFieldToggle = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Выбор всех полей
  const handleSelectAllFields = () => {
    setSelectedFields([...parsedData.fields]);
  };

  // Снятие выбора со всех полей
  const handleUnselectAllFields = () => {
    setSelectedFields([]);
  };

  // Обработчик выбора шаблона
  const handleSelectTemplate = (template: ExportTemplate) => {
    setSelectedTemplate(template);
    applyTemplate(template);
    setShowTemplateManager(false);
  };

  const handleExport = () => {
    try {
      // Данные для экспорта (все или отфильтрованные)
      const dataToExport = dataSelection === 'all' ? parsedData.data : filteredData;
      
      // Опции экспорта
      const options = {
        includeHeaders,
        includeSummary,
        delimiter: generalSettings.csvDelimiter,
        dateFormat: generalSettings.dateFormat,
      };
      
      // Формирование имени файла
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      let fileName = `export-${timestamp}`;
      let mimeType = '';
      let exportedData = '';
      
      // Экспорт в выбранный формат
      switch (fileFormat) {
        case 'csv':
          exportedData = exportToCSV(dataToExport, selectedFields, options);
          fileName += '.csv';
          mimeType = 'text/csv';
          break;
        case 'json':
          exportedData = exportToJSON(dataToExport, selectedFields, options);
          fileName += '.json';
          mimeType = 'application/json';
          break;
        case 'xlsx':
          exportedData = exportToXLSX(dataToExport, selectedFields, options);
          fileName += '.xlsx';
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
      }
      
      // Скачивание файла
      downloadData(exportedData, fileName, mimeType);
      
      // Отображение сообщения об успехе
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      
    } catch (error) {
      console.error('Ошибка при экспорте данных:', error);
      alert(`Произошла ошибка при экспорте данных: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  // Предварительный просмотр данных для экспорта
  const getExportPreview = (): string => {
    if (selectedFields.length === 0) return 'Выберите поля для экспорта';
    
    const dataToExport = dataSelection === 'all' ? parsedData.data.slice(0, 3) : filteredData.slice(0, 3);
    
    if (dataToExport.length === 0) return 'Нет данных для экспорта';
    
    const options = {
      includeHeaders,
      includeSummary: false,
      delimiter: generalSettings.csvDelimiter,
      dateFormat: generalSettings.dateFormat,
    };
    
    switch (fileFormat) {
      case 'csv':
        return exportToCSV(dataToExport, selectedFields, options);
      case 'json':
        return exportToJSON(dataToExport, selectedFields, options).slice(0, 1000);
      case 'xlsx':
        return 'Предпросмотр для XLSX недоступен';
      default:
        return '';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-medium mb-4" style={{ color: themeColors.darkTeal }}>
        Экспорт данных
      </h2>
      
      {exportSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          Экспорт данных успешно выполнен!
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>
          Параметры экспорта
        </h3>
        
        <div className="flex space-x-2">
          {selectedTemplate && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                Шаблон: <span className="font-medium">{selectedTemplate.name}</span>
              </span>
            </div>
          )}
          
          <button 
            className="text-sm text-white px-3 py-1 rounded"
            style={{ backgroundColor: themeColors.bluishGray }}
            onClick={() => setShowTemplateManager(true)}
          >
            {templates.length > 0 ? 'Шаблоны' : 'Создать шаблон'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Выберите данные для экспорта
            </h3>
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
            <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Формат файла
            </h3>
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
            <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Дополнительные опции
            </h3>
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
        </div>
        
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>
                Выберите поля для экспорта
              </h3>
              <div className="space-x-2">
                <button 
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                  onClick={handleSelectAllFields}
                >
                  Выбрать все
                </button>
                <button 
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                  onClick={handleUnselectAllFields}
                >
                  Снять выбор
                </button>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-2 bg-white">
              <div className="grid grid-cols-2 gap-1">
                {parsedData.fields.map(field => (
                  <div key={field} className="flex items-center py-1">
                    <input
                      id={`field-${field}`}
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`field-${field}`} className="ml-3 block text-sm font-medium text-gray-700 truncate">
                      {field}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
              Предпросмотр экспорта ({fileFormat.toUpperCase()})
            </h3>
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 overflow-auto max-h-40">
              <pre className="text-xs whitespace-pre-wrap">
                {getExportPreview()}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <SettingsButton 
          variant="primary"
          onClick={handleExport}
          disabled={selectedFields.length === 0 || 
            (dataSelection === 'all' && parsedData.data.length === 0) ||
            (dataSelection === 'filtered' && filteredData.length === 0)}
        >
          Экспортировать данные
        </SettingsButton>
      </div>
      
      {/* Менеджер шаблонов */}
      {showTemplateManager && (
        <ExportTemplateManager
          fields={parsedData.fields}
          onSelectTemplate={handleSelectTemplate}
          onCloseManager={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
};

export default ExportTabWithTemplates;