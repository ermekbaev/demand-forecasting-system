import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';

const DataManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'view' | 'export'>('upload');

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
          >
            Экспорт данных
          </button>
        </nav>
      </div>

      {/* Содержимое вкладки загрузки данных */}
      {activeTab === 'upload' && (
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Загрузка данных</h2>
          
          <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <button 
                className="font-medium hover:text-gray-700"
                style={{ color: themeColors.teal }}
              >
                Нажмите для выбора файла
              </button>{" "}
              или перетащите файл в эту область
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Поддерживаемые форматы: CSV, Excel (XLS, XLSX)
            </p>
          </div>

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
            >
              Использовать пример данных
            </button>
            <button 
              className="px-4 py-2 rounded-md text-white hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: themeColors.teal }}
            >
              Загрузить данные
            </button>
          </div>
        </div>
      )}

      {/* Содержимое вкладки просмотра данных */}
      {activeTab === 'view' && (
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Просмотр данных</h2>
          
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">Все категории</option>
                <option value="electronics">Электроника</option>
                <option value="appliances">Бытовая техника</option>
              </select>
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Период
              </label>
              <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="7">Последние 7 дней</option>
                <option value="30">Последние 30 дней</option>
                <option value="90">Последние 90 дней</option>
                <option value="all">Все время</option>
              </select>
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сортировка
              </label>
              <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="date_desc">Дата (новые сначала)</option>
                <option value="date_asc">Дата (старые сначала)</option>
                <option value="quantity_desc">Количество (по убыванию)</option>
                <option value="quantity_asc">Количество (по возрастанию)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Продукт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2023-01-0{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index % 2 === 0 ? 'Телевизор Samsung' : 'Смартфон iPhone'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Электроника
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {15 + index * 2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index % 2 === 0 ? '45,000 ₽' : '60,000 ₽'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <button 
                        className="text-sm font-medium mr-3"
                        style={{ color: themeColors.bluishGray }}
                      >
                        Редактировать
                      </button>
                      <button className="text-sm font-medium text-red-600">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Показано 1-5 из 25 записей
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                Назад
              </button>
              <button 
                className="px-3 py-1 rounded-md text-white"
                style={{ backgroundColor: themeColors.teal }}
              >
                1
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                2
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                3
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                Вперед
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Содержимое вкладки экспорта данных */}
      {activeTab === 'export' && (
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
                  Все данные
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
                  Текущий отфильтрованный набор
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="export-custom"
                  type="radio"
                  name="export-data"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="export-custom" className="ml-3 block text-sm font-medium text-gray-700">
                  Выбрать период
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