// pages/dashboard/data-management.tsx
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import TabsNavigation from '@/components/DataManagement/TabsNavigation';
import UploadTab from '@/components/DataManagement/UploadTab';
import ViewTab from '@/components/DataManagement/ViewTab';
import ExportTab from '@/components/DataManagement/ExportTab';
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
      <TabsNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasData={!!parsedData} 
      />

      {/* Содержимое вкладок */}
      {activeTab === 'upload' && (
        <UploadTab 
          onFileUpload={handleFileUpload}
          onUseSampleData={handleUseSampleData}
          isLoading={isLoading}
          error={error}
        />
      )}

      {activeTab === 'view' && parsedData && (
        <ViewTab 
          parsedData={parsedData}
          filteredData={filteredData}
          validationResult={validationResult}
          timeSeriesData={timeSeriesData}
          selectedDateField={selectedDateField}
          selectedValueField={selectedValueField}
          onFieldChange={handleFieldChange}
          onFilter={handleFilterData}
        />
      )}

      {activeTab === 'export' && parsedData && (
        <ExportTab 
          parsedData={parsedData}
          filteredData={filteredData}
        />
      )}
    </DashboardLayout>
  );
};

export default DataManagementPage;
