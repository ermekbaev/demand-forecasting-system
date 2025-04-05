import React, { useState, useMemo } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ParsedDataRow } from '@/lib/Data/csvParser';

interface DataTableProps {
  data: ParsedDataRow[];
  fields: string[];
  pageSize?: number;
}

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  fields, 
  pageSize = 10 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Общее количество страниц
  const totalPages = Math.ceil(data.length / pageSize);
  
  // Сортировка и пагинация данных
  const displayData = useMemo(() => {
  const processedData = [...data];
    
    // Сортировка
    if (sortField) {
      processedData.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];
        
        // Обработка специальных случаев для разных типов данных
        if (valueA instanceof Date && valueB instanceof Date) {
          return sortOrder === 'asc' 
            ? valueA.getTime() - valueB.getTime() 
            : valueB.getTime() - valueA.getTime();
        }
        
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        // По умолчанию сравниваем как строки
        const strA = String(valueA || '');
        const strB = String(valueB || '');
        
        return sortOrder === 'asc' 
          ? strA.localeCompare(strB) 
          : strB.localeCompare(strA);
      });
    }
    
    // Пагинация
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [data, sortField, sortOrder, currentPage, pageSize]);
  
  // Обработчик сортировки
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Навигация по страницам
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Рендер пагинации
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxVisiblePages = 5; // Максимальное количество отображаемых номеров страниц
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Показано {(currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, data.length)} из {data.length} записей
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          
          {pageNumbers.map(page => (
            <button 
              key={page}
              className={`px-3 py-1 rounded-md ${
                currentPage === page 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={currentPage === page ? { backgroundColor: themeColors.teal } : {}}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      </div>
    );
  };
  
  if (!data.length) {
    return (
      <div className="text-center py-8 text-black">
        Нет данных для отображения
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {fields.map(field => (
                <th 
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {field}
                    {sortField === field && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map(field => (
                  <td 
                    key={`${rowIndex}-${field}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-black"
                  >
                    {row[field] instanceof Date 
                      ? (row[field] as Date).toLocaleDateString() 
                      : String(row[field] ?? '')}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-right">
                  <button 
                    className="text-sm font-medium mr-3"
                    style={{ color: themeColors.bluishGray }}
                  >
                    Просмотр
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default DataTable;