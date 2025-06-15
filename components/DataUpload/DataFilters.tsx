import React, { useState, useEffect } from 'react';
import { ParsedDataRow } from '@/lib/Data/csvParser';
import { themeColors } from '@/lib/Theme/Colors';

export interface FilterOptions {
  field: string;
  value: string | number | null;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  valueEnd?: string | number | null; // Для оператора 'between'
}

interface DataFiltersProps {
  data: ParsedDataRow[];
  fields: string[];
  onFilter: (filteredData: ParsedDataRow[]) => void;
}

const DataFilters: React.FC<DataFiltersProps> = ({ data, fields, onFilter }) => {
  const [filters, setFilters] = useState<FilterOptions[]>([]);
  const [activeField, setActiveField] = useState<string>(fields[0] || '');
  const [activeOperator, setActiveOperator] = useState<FilterOptions['operator']>('equals');
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterValueEnd, setFilterValueEnd] = useState<string>('');
  
  // Определение типа поля для выбора подходящего оператора
  const getFieldType = (field: string): 'string' | 'number' | 'date' | 'unknown' => {
    if (!data.length) return 'unknown';
    
    const sampleValue = data[0][field];
    if (sampleValue instanceof Date) return 'date';
    if (typeof sampleValue === 'number') return 'number';
    if (typeof sampleValue === 'string') return 'string';
    
    return 'unknown';
  };
  
  // Получение уникальных значений для выбранного поля (для оператора 'in')
  const getUniqueValues = (field: string) => {
    const values = new Set<string>();
    data.forEach(row => {
      if (row[field] !== null && row[field] !== undefined) {
        values.add(String(row[field]));
      }
    });
    return Array.from(values).sort();
  };
  
  // Применение фильтров к данным
  const applyFilters = () => {
    if (!filters.length) {
      onFilter(data);
      return;
    }
    
    const filteredData = data.filter(row => {
      return filters.every(filter => {
        const value = row[filter.field];
        
        switch (filter.operator) {
          case 'equals':
            return value == filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'greater':
            if (value instanceof Date && filter.value) {
              return value > new Date(String(filter.value));
            }
            return Number(value) > Number(filter.value);
          case 'less':
            if (value instanceof Date && filter.value) {
              return value < new Date(String(filter.value));
            }
            return Number(value) < Number(filter.value);
          case 'between':
            if (value instanceof Date && filter.value && filter.valueEnd) {
              const start = new Date(String(filter.value));
              const end = new Date(String(filter.valueEnd));
              return value >= start && value <= end;
            }
            const numValue = Number(value);
            return numValue >= Number(filter.value) && numValue <= Number(filter.valueEnd);
          case 'in':
            const filterValues = String(filter.value).split(',').map(v => v.trim());
            return filterValues.includes(String(value));
          default:
            return true;
        }
      });
    });
    
    onFilter(filteredData);
  };
  
  // Применяем фильтры при их изменении
  useEffect(() => {
    applyFilters();
  }, [filters]);
  
  // Добавление нового фильтра
  const addFilter = () => {
    if (!activeField || (!filterValue && activeOperator !== 'in')) return;
    
    const newFilter: FilterOptions = {
      field: activeField,
      operator: activeOperator,
      value: filterValue,
    };
    
    if (activeOperator === 'between' && filterValueEnd) {
      newFilter.valueEnd = filterValueEnd;
    }
    
    setFilters([...filters, newFilter]);
    setFilterValue('');
    setFilterValueEnd('');
  };
  
  // Удаление фильтра
  const removeFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };
  
  // Очистка всех фильтров
  const clearFilters = () => {
    setFilters([]);
  };
  
  // Рендер интерфейса для выбора значения фильтра в зависимости от оператора
  const renderValueInput = () => {
    const fieldType = getFieldType(activeField);
    
    if (activeOperator === 'between') {
      return (
        <div className="flex space-x-2">
          <input
            type={fieldType === 'date' ? 'date' : 'text'}
            className="flex-1 p-2 border border-gray-300 rounded-md"
            style={{ color: themeColors.darkTeal }}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="От"
          />
          <input
            type={fieldType === 'date' ? 'date' : 'text'}
            className="flex-1 p-2 border border-gray-300 rounded-md"
            style={{ color: themeColors.darkTeal }}
            value={filterValueEnd}
            onChange={(e) => setFilterValueEnd(e.target.value)}
            placeholder="До"
          />
        </div>
      );
    }
    
    if (activeOperator === 'in') {
      const uniqueValues = getUniqueValues(activeField);
      return (
        <select
          multiple
          className="w-full p-2 border border-gray-300 rounded-md"
          value={filterValue.split(',').map(v => v.trim())}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFilterValue(selectedValues.join(', '));
          }}
        >
          {uniqueValues.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      );
    }
    
    return (
      <input
        type={fieldType === 'date' ? 'date' : 'text'}
        className="w-full p-2 border border-gray-300 rounded-md"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder="Значение"
      />
    );
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3" style={{ color: themeColors.darkTeal }}>Фильтры данных</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-700 mb-1">Поле</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            style={{ color: themeColors.darkTeal }}
            value={activeField}
            onChange={(e) => setActiveField(e.target.value)}
          >
            {fields.map(field => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-700 mb-1">Оператор</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            style={{ color: themeColors.darkTeal }}
            value={activeOperator}
            onChange={(e) => setActiveOperator(e.target.value as FilterOptions['operator'])}
          >
            <option value="equals">Равно</option>
            <option value="contains">Содержит</option>
            <option value="greater">Больше</option>
            <option value="less">Меньше</option>
            <option value="between">Между</option>
            <option value="in">В списке</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-700 mb-1">Значение</label>
          {renderValueInput()}
        </div>
      </div>
      
      <div className="flex justify-end mb-4">
        <button
          className="px-3 py-1 rounded-md text-white mr-2"
          style={{ backgroundColor: themeColors.teal }}
          onClick={addFilter}
        >
          Добавить фильтр
        </button>
        
        {filters.length > 0 && (
          <button
            className="px-3 py-1 rounded-md border border-gray-300"
            onClick={clearFilters}
          >
            Очистить все
          </button>
        )}
      </div>
      
      {filters.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-xs font-medium mb-2">Активные фильтры:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <div 
                key={index} 
                className="inline-flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-xs"
              >
                <span className="font-medium">{filter.field}</span>
                <span className="mx-1">
                  {filter.operator === 'equals' && '='}
                  {filter.operator === 'contains' && 'содержит'}
                  {filter.operator === 'greater' && '>'}
                  {filter.operator === 'less' && '<'}
                  {filter.operator === 'between' && 'между'}
                  {filter.operator === 'in' && 'в списке'}
                </span>
                <span>{String(filter.value)}</span>
                {filter.valueEnd && <span> - {String(filter.valueEnd)}</span>}
                <button
                  className="ml-2 text-black hover:text-gray-700"
                  onClick={() => removeFilter(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilters;