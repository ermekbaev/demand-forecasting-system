import React, { useEffect, useState } from 'react';
import { useData } from '@/Context/DataContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import Link from 'next/link';
import ForecastWidget from '@/components/Dashboard/ForecastWidget';
import SalesAnalyticsWidget from '@/components/Dashboard/SalesAnalyticsWidget';
import StatCard from '@/components/Dashboard/StatCard';
import { ParsedDataRow } from '@/lib/Data/csvParser';

// Определяем типы для статистических данных
interface Stats {
  totalSales: number;
  avgDemand: number;
  forecastAccuracy: number;
  recentSales: ParsedDataRow[];
}

// Тип для данных спарклайна
interface SparklinePoint {
  value: number;
  index: number;
}

// Тип для всех спарклайнов
interface SparklineData {
  salesSparkline: SparklinePoint[];
  demandSparkline: SparklinePoint[];
  accuracySparkline: SparklinePoint[];
}

const DashboardPage: React.FC = () => {
  const { parsedData, timeSeriesData, selectedDateField, selectedValueField } = useData();
  
  // Состояния с правильными типами
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    avgDemand: 0,
    forecastAccuracy: 94,
    recentSales: []
  });
  
  const [sparklines, setSparklines] = useState<SparklineData>({
    salesSparkline: [],
    demandSparkline: [],
    accuracySparkline: []
  });
  
  // Функция для расчета статистики на основе данных
  useEffect(() => {
    if (parsedData && parsedData.data.length > 0) {
      // Рассчитываем общие продажи
      let totalQuantity = 0;
      let quantityField = '';
      
      // Находим поле с количеством
      const possibleQuantityFields: string[] = ['quantity', 'qty', 'amount', 'count'];
      if (selectedValueField) {
        possibleQuantityFields.push(selectedValueField);
      }
      
      for (const field of possibleQuantityFields) {
        if (parsedData.fields.includes(field)) {
          quantityField = field;
          break;
        }
      }
      
      if (quantityField) {
        // Суммируем количество за последние 30 дней
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        let recentData = parsedData.data.filter(row => {
          const dateValue = row.date;
          let rowDate: Date;
          
          if (dateValue instanceof Date) {
            rowDate = dateValue;
          } else if (typeof dateValue === 'string') {
            rowDate = new Date(dateValue);
          } else {
            // Если нет даты или неверного формата, пропускаем запись
            return false;
          }
          
          return !isNaN(rowDate.getTime()) && rowDate >= thirtyDaysAgo;
        });
        
        if (recentData.length === 0) {
          // Если нет данных за последние 30 дней, берем 30 последних записей
          recentData = [...parsedData.data].sort((a, b) => {
            const aDate = a.date instanceof Date ? a.date : new Date(String(a.date));
            const bDate = b.date instanceof Date ? b.date : new Date(String(b.date));
            return bDate.getTime() - aDate.getTime();
          }).slice(0, 30);
        }
        
        totalQuantity = recentData.reduce((sum, row) => {
          const qty = Number(row[quantityField]);
          return sum + (isNaN(qty) ? 0 : qty);
        }, 0);
      }
      
      // Рассчитываем средний спрос
      const avgDemand = timeSeriesData.length > 0 
        ? Math.round(timeSeriesData.reduce((sum, item) => sum + item.value, 0) / timeSeriesData.length) 
        : Math.round(totalQuantity / 30);
      
      // Последние данные для таблицы
      const recentSales = [...parsedData.data]
        .sort((a, b) => {
          const aDate = a.date instanceof Date ? a.date : new Date(String(a.date));
          const bDate = b.date instanceof Date ? b.date : new Date(String(b.date));
          return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 5);
      
      // Обновляем статистику
      setStats({
        totalSales: totalQuantity,
        avgDemand,
        forecastAccuracy: 94, // Это будет обновляться на основе реальных прогнозов
        recentSales
      });
      
      // Готовим данные для спарклайнов
      const prepareTrendData = (items: ParsedDataRow[], valueField: string, limit = 20): SparklinePoint[] => {
        if (!items.length || !valueField) return [];
        
        return items
          .slice(-limit)
          .map((item, index) => ({ 
            value: Number(item[valueField] || 0), 
            index 
          }));
      };
      
      // Спарклайн для продаж
      let salesTrend: SparklinePoint[] = [];
      if (quantityField) {
        const sortedData = [...parsedData.data].sort((a, b) => {
          const aDate = a.date instanceof Date ? a.date : new Date(String(a.date));
          const bDate = b.date instanceof Date ? b.date : new Date(String(b.date));
          return aDate.getTime() - bDate.getTime();
        });
        
        salesTrend = prepareTrendData(sortedData, quantityField);
      }
      
      // Спарклайн для точности прогнозов (симулированные данные)
      const accuracyTrend: SparklinePoint[] = Array.from({ length: 10 }, (_, i) => ({
        value: 90 + Math.random() * 8,
        index: i
      }));
      
      // Преобразуем данные временного ряда в формат спарклайна
      const demandTrend: SparklinePoint[] = timeSeriesData.slice(-20).map((item, index) => ({ 
        value: item.value,
        index
      }));
      
      setSparklines({
        salesSparkline: salesTrend,
        demandSparkline: demandTrend,
        accuracySparkline: accuracyTrend
      });
    }
  }, [parsedData, timeSeriesData, selectedValueField]);
  
  return (
    <DashboardLayout title="Главная панель">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Статистическая карточка 1 */}
        <StatCard 
          title="Общие продажи"
          value={stats.totalSales.toLocaleString()}
          change={5.7}
          sparklineData={sparklines.salesSparkline}
          color={themeColors.teal}
          icon={<span className="text-2xl">📈</span>}
        />

        {/* Статистическая карточка 2 */}
        <StatCard 
          title="Средний спрос"
          value={stats.avgDemand.toLocaleString()}
          change={-2.3}
          sparklineData={sparklines.demandSparkline}
          color={themeColors.bluishGray}
          icon={<span className="text-2xl">📊</span>}
        />

        {/* Статистическая карточка 3 */}
        <StatCard 
          title="Точность прогноза"
          value={stats.forecastAccuracy}
          suffix="%"
          change={1.2}
          sparklineData={sparklines.accuracySparkline}
          color={themeColors.darkTeal}
          icon={<span className="text-2xl">🎯</span>}
        />
      </div>

      {/* Графики и прогнозы */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* График продаж */}
        <div className="card col-span-2 lg:col-span-1">
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Динамика продаж</h3>
          {timeSeriesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData.map(item => ({
                  date: item.date.toLocaleDateString(),
                  value: item.value
                }))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={themeColors.teal} 
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 5 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}`, 'Количество']}
                    labelFormatter={(label) => `Дата: ${label}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
              <p className="text-black">Загрузите данные для отображения графика</p>
            </div>
          )}
        </div>

        {/* График прогноза */}
        <div className="card col-span-2 lg:col-span-1">
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Прогноз на следующий месяц</h3>
          <div className="h-64">
            <ForecastWidget />
          </div>
        </div>
      </div>

      {/* Аналитика продаж */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Аналитика продаж</h3>
          <SalesAnalyticsWidget />
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
                {stats.recentSales.length > 0 ? (
                  stats.recentSales.map((row, index) => {
                    // Находим подходящие поля
                    const dateField = selectedDateField || 
                      parsedData?.fields.find(f => f.toLowerCase().includes('date'));
                    const productField = parsedData?.fields.find(f => 
                      ['product', 'item', 'name', 'title'].some(term => f.toLowerCase().includes(term))
                    );
                    const categoryField = parsedData?.fields.find(f => 
                      f.toLowerCase().includes('category') || f.toLowerCase().includes('type')
                    );
                    const quantityField = selectedValueField || 
                      parsedData?.fields.find(f => 
                        ['quantity', 'qty', 'amount', 'count'].some(term => f.toLowerCase().includes(term))
                      );
                    const priceField = parsedData?.fields.find(f => 
                      ['price', 'cost', 'revenue'].some(term => f.toLowerCase().includes(term))
                    );

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {dateField ? (
                            row[dateField] instanceof Date 
                              ? (row[dateField] as Date).toLocaleDateString() 
                              : new Date(String(row[dateField])).toLocaleDateString()
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {productField && row[productField] ? String(row[productField]) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {categoryField && row[categoryField] ? String(row[categoryField]) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {quantityField && row[quantityField] ? String(row[quantityField]) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {priceField && row[priceField] ? `${row[priceField]} ₽` : '-'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Нет данных для отображения
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Link 
              href="/dashboard/data-management"
              className="text-sm font-medium"
              style={{ color: themeColors.teal }}
            >
              Смотреть все →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;