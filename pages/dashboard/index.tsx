import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout title="Главная панель">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Статистическая карточка 1 */}
        <div className="card">
          <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.darkTeal }}>Общие продажи</h3>
          <p className="text-3xl font-bold" style={{ color: themeColors.teal }}>
            1,234
          </p>
          <p className="text-sm text-black mt-1">За последние 30 дней</p>
        </div>

        {/* Статистическая карточка 2 */}
        <div className="card">
          <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.darkTeal }}>Средний спрос</h3>
          <p className="text-3xl font-bold" style={{ color: themeColors.bluishGray }}>
            42
          </p>
          <p className="text-sm text-black mt-1">Единиц в день</p>
        </div>

        {/* Статистическая карточка 3 */}
        <div className="card">
          <h3 className="text-lg font-medium mb-2" style={{ color: themeColors.darkTeal }}>Точность прогноза</h3>
          <p className="text-3xl font-bold" style={{ color: themeColors.darkTeal }}>
            94%
          </p>
          <p className="text-sm text-black mt-1">Средняя точность за квартал</p>
        </div>
      </div>

      {/* Графики и прогнозы */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* График продаж */}
        <div className="card col-span-2 lg:col-span-1">
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Динамика продаж</h3>
          <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
            <p className="text-black">Здесь будет график продаж</p>
          </div>
        </div>

        {/* График прогноза */}
        <div className="card col-span-2 lg:col-span-1">
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Прогноз на следующий месяц</h3>
          <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
            <p className="text-black">Здесь будет график прогноза</p>
          </div>
        </div>
      </div>

      {/* Таблица с последними данными */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Последние данные о продажах</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Дата
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Продукт
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Категория
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Количество
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Цена
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Данные таблицы */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    2023-01-01
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Телевизор Samsung
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    Электроника
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    45,000 ₽
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    2023-01-01
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Смартфон iPhone
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    Электроника
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    22
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    60,000 ₽
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    2023-01-02
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Холодильник LG
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    Бытовая техника
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    7
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    35,000 ₽
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              className="text-sm font-medium"
              style={{ color: themeColors.teal }}
            >
              Смотреть все →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;