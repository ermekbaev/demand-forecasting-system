// components/DataManagement/ViewTab.tsx
import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import TimeSeriesChart from '@/components/Charts/TimeSeriesChart';
import DataFilters from '@/components/DataUpload/DataFilters';
import DataTable from '@/components/DataUpload/DataTable';
import { ParsedData, ParsedDataRow } from '@/lib/Data/csvParser';
import { ValidationResult } from '@/lib/Data/dataValidator';

interface ViewTabProps {
  parsedData: ParsedData;
  filteredData: ParsedDataRow[];
  validationResult: ValidationResult | null;
  timeSeriesData: Array<{ date: Date; value: number }>;
  selectedDateField: string;
  selectedValueField: string;
  onFieldChange: (type: 'date' | 'value', field: string) => void;
  onFilter: (filteredData: ParsedDataRow[]) => void;
}

const ViewTab: React.FC<ViewTabProps> = ({
  parsedData,
  filteredData,
  validationResult,
  timeSeriesData,
  selectedDateField,
  selectedValueField,
  onFieldChange,
  onFilter
}) => {
  return (
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
          <h2 className="text-xl font-medium" style={{ color: themeColors.darkTeal }}>Визуализация данных</h2>
          
          <div className="flex space-x-4">
            <div>
              <label className="block text-xs text-gray-700 mb-1">Поле даты</label>
              <select
                className="p-1 border border-gray-300 rounded-md text-sm"
                style={{ color: themeColors.darkTeal }}
                value={selectedDateField}
                onChange={(e) => onFieldChange('date', e.target.value)}
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
                style={{ color: themeColors.darkTeal }}
                value={selectedValueField}
                onChange={(e) => onFieldChange('value', e.target.value)}
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
          <div className="text-center py-10 text-black">
            <p>Невозможно построить график. Проверьте, что выбраны правильные поля даты и значения.</p>
          </div>
        )}
      </div>
      
      {/* Фильтры и таблица данных */}
      <div className="card">
        <h2 className="text-xl font-medium mb-4" style={{ color: themeColors.darkTeal }}>Таблица данных</h2>
        
        {parsedData.data.length > 0 && (
          <>
            <DataFilters
              data={parsedData.data}
              fields={parsedData.fields}
              onFilter={onFilter}
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
  );
};

export default ViewTab;