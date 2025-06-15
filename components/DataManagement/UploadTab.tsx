// components/DataManagement/UploadTab.tsx
import React from 'react';
import UploadArea from '@/components/DataUpload/UploadArea';
import { themeColors } from '@/lib/Theme/Colors';

interface UploadTabProps {
  onFileUpload: (file: File) => void;
  onUseSampleData: () => void;
  isLoading: boolean;
  error: string | null;
}

const UploadTab: React.FC<UploadTabProps> = ({ 
  onFileUpload, 
  onUseSampleData, 
  isLoading, 
  error 
}) => {
  return (
    <div className="card">
      <h2 className="text-xl font-medium mb-4" style={{ color: themeColors.darkTeal }}>Загрузка данных</h2>
      
      <UploadArea onFileUpload={onFileUpload} />

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
        <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>Пример структуры данных</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-black uppercase">Дата</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-black uppercase">ID товара</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-black uppercase">Название</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-black uppercase">Категория</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-black uppercase">Количество</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-black uppercase">Цена</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: themeColors.darkTeal }}>2023-01-01</td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: themeColors.darkTeal }}>1001</td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: themeColors.darkTeal }}>Телевизор Samsung</td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: themeColors.darkTeal }}>Электроника</td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: themeColors.darkTeal }}>15</td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ color: themeColors.darkTeal }}>45000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          onClick={onUseSampleData}
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
  );
};

export default UploadTab;