import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import UploadArea from '@/components/DataUpload/UploadArea';
import DataTable from '@/components/DataUpload/DataTable';
import DataFilters from '@/components/DataUpload/DataFilters';
import TimeSeriesChart from '@/components/Charts/TimeSeriesChart';
import { themeColors } from '@/lib/Theme/Colors';
import { parseCSV, readFileAsText, processTimeSeriesData, ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';
import { validateData, ValidationResult } from '@/lib/Data/dataValidator';

const DataManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'view' | 'export'>('upload');
  
  // Состояния для работы с данными
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [filteredData, setFilteredData] = useState<ParsedDataRow[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<{ date: Date; value: number }[]>([]);
  const [selectedDateField, setSelectedDateField] = useState<string>('');
  const [selectedValueField, setSelectedValueField] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Обработка загруженного файла
  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Чтение файла и парсинг CSV
      const fileContent = await readFileAsText(file);
      const parsedResults = parseCSV(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      
      // Проверка наличия полей с датой и числовыми значениями
      const dateFieldCandidates = parsedResults.fields.filter(field => {
        const sampleValue = parsedResults.data[0]?.[field];
        return sampleValue instanceof Date || 
               (typeof sampleValue === 'string' && !isNaN(new Date(sampleValue).getTime()));
      });
      
      const valueFieldCandidates = parsedResults.fields.filter(field => {
        const sampleValue = parsedResults.data[0]?.[field];
        return typeof sampleValue === 'number' || 
               (typeof sampleValue === 'string' && !isNaN(Number(sampleValue)));
      });
      
      // Установка полей по умолчанию если они есть
      if (dateFieldCandidates.length > 0) {
        setSelectedDateField(dateFieldCandidates[0]);
      }
      
      if (valueFieldCandidates.length > 0) {
        setSelectedValueField(valueFieldCandidates[0]);
      }
      
      // Валидация данных
      const validationOpts = {
        requiredFields: [dateFieldCandidates[0], valueFieldCandidates[0]].filter(Boolean),
        dateField: dateFieldCandidates[0] || '',
        valueField: valueFieldCandidates[0] || '',
      };
      
      const validationResults = validateData(parsedResults, validationOpts);
      
      // Обработка данных временного ряда если есть поля даты и значения
      if (dateFieldCandidates.length > 0 && valueFieldCandidates.length > 0) {
        const timeSeries = processTimeSeriesData(
          parsedResults.data,
          dateFieldCandidates[0],
          valueFieldCandidates[0]
        );
        setTimeSeriesData(timeSeries);
      }
      
      // Сохранение данных и переход к вкладке просмотра
      setParsedData(parsedResults);
      setFilteredData(parsedResults.data);
      setValidationResult(validationResults);
      
      if (parsedResults.data.length > 0) {
        setActiveTab('view');
      }
      
    } catch (err) {
      console.error('Ошибка при обработке файла:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обработке файла');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка изменения полей для графика временного ряда
  const handleFieldChange = (type: 'date' | 'value', field: string) => {
    if (type === 'date') {
      setSelectedDateField(field);
    } else {
      setSelectedValueField(field);
    }
    
    if (parsedData && selectedDateField && selectedValueField) {
      const timeSeries = processTimeSeriesData(
        parsedData.data,
        type === 'date' ? field : selectedDateField,
        type === 'value' ? field : selectedValueField
      );
      setTimeSeriesData(timeSeries);
    }
  };

  // Обработка фильтрации данных
  const handleFilterData = (newFilteredData: ParsedDataRow[]) => {
    setFilteredData(newFilteredData);
    
    // Обновляем график если выбраны поля даты и значения
    if (selectedDateField && selectedValueField) {
      const timeSeries = processTimeSeriesData(
        newFilteredData,
        selectedDateField,
        selectedValueField
      );
      setTimeSeriesData(timeSeries);
    }
  };

  // Обработка использования примера данных
  const handleUseSampleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Здесь должен быть код для загрузки примера данных
      // Например, с сервера или из предварительно подготовленного JSON
      const response = await fetch('/sample-data/sales-history.csv');
      const text = await response.text();
      
      const parsedResults = parseCSV(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      
      // Устанавливаем поля даты и значения на основе примера
      setSelectedDateField('date');
      setSelectedValueField('quantity');
      
      // Обработка данных временного ряда
      const timeSeries = processTimeSeriesData(
        parsedResults.data,
        'date',
        'quantity'
      );
      
      // Валидация данных
      const validationResults = validateData(parsedResults, {
        requiredFields: ['date', 'quantity'],
        dateField: 'date',
        valueField: 'quantity',
      });
      
      setParsedData(parsedResults);
      setFilteredData(parsedResults.data);
      setTimeSeriesData(timeSeries);
      setValidationResult(validationResults);
      setActiveTab('view');
      
    } catch (err) {
      console.error('Ошибка при загрузке примера данных:', err);
      setError('Не удалось загрузить пример данных.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Управление данными">
      {/* Навигация по вкладкам */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'upload'
                ? `border-current text-current`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
            style={activeTab === 'upload' ? { color: themeColors.teal } : {}}
          >
            Загрузка данных
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'view'
                ? `border-current text-current`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'view' ? { color: themeColors.teal } : {}}
            disabled={!parsedData}
          >
            Просмотр данных
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'export'
                ? `border-current text-current`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'export' ? { color: themeColors.teal } : {}}
            disabled={!parsedData}
          >
            Экспорт данных
          </button>
        </nav>
      </div>

      {/* Содержимое вкладки загрузки данных */}
      {activeTab === 'upload' && (
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Загрузка данных</h2>
          
          <UploadArea onFileUpload={handleFileUpload} />

          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current" style={{ color: themeColors.teal }}></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
              <p className="font-medium">Ошибка при обработке файла:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium mb-2">Пример структуры данных</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID товара</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Количество</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap">2023-01-01</td>
                    <td className="px-3 py-2 whitespace-nowrap">1001</td>
                    <td className="px-3 py-2 whitespace-nowrap">Телевизор Samsung</td>
                    <td className="px-3 py-2 whitespace-nowrap">Электроника</td>
                    <td className="px-3 py-2 whitespace-nowrap">15</td>
                    <td className="px-3 py-2 whitespace-nowrap">45000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <button 
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              onClick={handleUseSampleData}
              disabled={isLoading}
            >
              Использовать пример данных
            </button>
            <a 
              href="/sample-data/sales-history.csv" 
              download
              className="px-4 py-2 rounded-md text-white hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: themeColors.bluishGray }}
            >
              Скачать шаблон CSV
            </a>
          </div>
        </div>
      )}

      {/* Содержимое вкладки просмотра данных */}
      {activeTab === 'view' && parsedData && (
        <div>
          {/* Сообщения валидации */}
          {validationResult && (
            <>
              {validationResult.errors.length > 0 && (
                <div className="card mb-4 bg-red-50">
                  <h3 className="text-sm font-medium text-red-700 mb-2">Обнаружены проблемы в данных:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div className="card mb-4 bg-yellow-50">
                  <h3 className="text-sm font-medium text-yellow-700 mb-2">Предупреждения:</h3>
                  <ul className="list-disc list-inside text-sm text-yellow-700">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>{warning.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          
          {/* График временного ряда */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Визуализация данных</h2>
              
              <div className="flex space-x-4">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Поле даты</label>
                  <select
                    className="p-1 border border-gray-300 rounded-md text-sm"
                    value={selectedDateField}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                  >
                    {parsedData.fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Поле значения</label>
                  <select
                    className="p-1 border border-gray-300 rounded-md text-sm"
                    value={selectedValueField}
                    onChange={(e) => handleFieldChange('value', e.target.value)}
                  >
                    {parsedData.fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {timeSeriesData.length > 0 ? (
              <TimeSeriesChart 
                data={timeSeriesData}
                title="Динамика продаж"
                xAxisLabel="Дата"
                yAxisLabel="Количество"
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Невозможно построить график. Проверьте, что выбраны правильные поля даты и значения.</p>
              </div>
            )}
          </div>
          
          {/* Фильтры и таблица данных */}
          <div className="card">
            <h2 className="text-xl font-medium mb-4">Таблица данных</h2>
            
            {parsedData.data.length > 0 && (
              <>
                <DataFilters
                  data={parsedData.data}
                  fields={parsedData.fields}
                  onFilter={handleFilterData}
                />
                
                <DataTable
                  data={filteredData}
                  fields={parsedData.fields}
                  pageSize={10}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Содержимое вкладки экспорта данных */}
      {activeTab === 'export' && parsedData && (
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Экспорт данных</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Выберите данные для экспорта</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="export-all"
                  type="radio"
                  name="export-data"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  defaultChecked
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="export-filtered" className="ml-3 block text-sm font-medium text-gray-700">
                  Отфильтрованные данные ({filteredData.length} записей)
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Формат файла</h3>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                CSV
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Excel (XLSX)
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                JSON
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Дополнительные опции</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="include-headers"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="include-headers" className="ml-3 block text-sm font-medium text-gray-700">
                  Включить заголовки столбцов
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="include-summary"
                  type="checkbox"
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
            >
              Экспортировать данные
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DataManagementPage;