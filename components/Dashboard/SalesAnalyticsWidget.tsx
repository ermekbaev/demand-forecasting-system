import React, { useMemo } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useData } from '@/Context/DataContext';
import { ParsedDataRow } from '@/lib/Data/csvParser';

// Типы для аналитики
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface CategoryData {
  name: string;
  value: number;
}

interface DayData {
  name: string;
  value: number;
}

interface AnalyticsData {
  totalProducts: number;
  totalCategories: number;
  avgOrderValue: number;
  topCategories: CategoryData[];
  salesByDay: DayData[];
}

// Компонент мини-карточки с аналитикой
const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
      <div className="rounded-full h-10 w-10 flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-medium" style={{ color }}>{value}</p>
      </div>
    </div>
  );
};

const SalesAnalyticsWidget: React.FC = () => {
  const { parsedData, timeSeriesData } = useData();
  
  // Рассчитываем аналитические данные на основе имеющейся информации
  const analytics = useMemo<AnalyticsData>(() => {
    if (!parsedData || parsedData.data.length === 0) {
      return {
        totalProducts: 0,
        totalCategories: 0,
        avgOrderValue: 0,
        topCategories: [],
        salesByDay: [
          { name: 'Пн', value: 0 },
          { name: 'Вт', value: 0 },
          { name: 'Ср', value: 0 },
          { name: 'Чт', value: 0 },
          { name: 'Пт', value: 0 },
          { name: 'Сб', value: 0 },
          { name: 'Вс', value: 0 }
        ]
      };
    }
    
    // Найдем подходящие поля
    const findField = (keywords: string[]): string | undefined => {
      return parsedData.fields.find(f => 
        keywords.some(keyword => f.toLowerCase().includes(keyword))
      );
    };
    
    const productField = findField(['product', 'item', 'name', 'title']);
    const categoryField = findField(['category', 'type', 'group']);
    const quantityField = findField(['quantity', 'qty', 'amount', 'count']);
    const priceField = findField(['price', 'cost', 'revenue']);
    const dateField = findField(['date', 'time']);
    
    // Собираем уникальные продукты
    const uniqueProducts = new Set<string>();
    if (productField) {
      parsedData.data.forEach(row => {
        const product = row[productField];
        if (product) uniqueProducts.add(String(product));
      });
    }
    
    // Собираем уникальные категории
    const uniqueCategories = new Set<string>();
    if (categoryField) {
      parsedData.data.forEach(row => {
        const category = row[categoryField];
        if (category) uniqueCategories.add(String(category));
      });
    }
    
    // Считаем средний чек
    let avgOrderValue = 0;
    if (priceField && quantityField) {
      let totalValue = 0;
      let totalQuantity = 0;
      
      parsedData.data.forEach(row => {
        const price = Number(row[priceField]);
        const qty = Number(row[quantityField]);
        
        if (!isNaN(price) && !isNaN(qty) && qty > 0) {
          totalValue += price;
          totalQuantity += qty;
        }
      });
      
      avgOrderValue = totalQuantity > 0 ? Math.round(totalValue / totalQuantity) : 0;
    }
    
    // Собираем топ категорий по продажам
    const categoryData: Record<string, number> = {};
    if (categoryField && quantityField) {
      parsedData.data.forEach(row => {
        const category = row[categoryField];
        const qty = Number(row[quantityField]);
        
        if (category && !isNaN(qty)) {
          // Преобразуем category в строку, чтобы использовать как ключ объекта
          const categoryKey = String(category);
          if (!categoryData[categoryKey]) {
            categoryData[categoryKey] = 0;
          }
          categoryData[categoryKey] += qty;
        }
      });
    }
    
    const topCategories: CategoryData[] = Object.entries(categoryData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    // Строим данные продаж по дням недели
    const salesByDay: DayData[] = [
      { name: 'Пн', value: 0 },
      { name: 'Вт', value: 0 },
      { name: 'Ср', value: 0 },
      { name: 'Чт', value: 0 },
      { name: 'Пт', value: 0 },
      { name: 'Сб', value: 0 },
      { name: 'Вс', value: 0 }
    ];
    
    if (dateField && quantityField) {
      parsedData.data.forEach(row => {
        const dateValue = row[dateField];
        const qty = Number(row[quantityField]);
        
        if (dateValue && !isNaN(qty)) {
          let dateObj: Date | null = null;
          
          if (dateValue instanceof Date) {
            dateObj = dateValue;
          } else if (typeof dateValue === 'string') {
            dateObj = new Date(dateValue);
          }
          
          if (dateObj && !isNaN(dateObj.getTime())) {
            // JS: 0 = вс, 1 = пн, ..., 6 = сб
            // Корректируем чтобы 0 = пн, 1 = вт, ..., 6 = вс
            const dayOfWeek = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1;
            salesByDay[dayOfWeek].value += qty;
          }
        }
      });
    }
    
    return {
      totalProducts: uniqueProducts.size,
      totalCategories: uniqueCategories.size,
      avgOrderValue,
      topCategories,
      salesByDay
    };
  }, [parsedData]);
  
  // Цвета для графиков
  const COLORS = [
    themeColors.teal,
    themeColors.bluishGray,
    themeColors.darkTeal,
    '#8884d8',
    '#82ca9d'
  ];
  
  // Если нет данных, показываем заглушку
  if (!parsedData || parsedData.data.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center h-full">
        <p className="text-gray-500">Загрузите данные для отображения аналитики</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Мини-карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Количество товаров" 
          value={analytics.totalProducts} 
          icon="📦" 
          color={themeColors.teal} 
        />
        <AnalyticsCard 
          title="Количество категорий" 
          value={analytics.totalCategories} 
          icon="🗂️" 
          color={themeColors.bluishGray} 
        />
        <AnalyticsCard 
          title="Средний чек" 
          value={`${analytics.avgOrderValue.toLocaleString()} ₽`} 
          icon="💰" 
          color={themeColors.darkTeal} 
        />
        <AnalyticsCard 
          title="Дней с данными" 
          value={timeSeriesData.length} 
          icon="📅" 
          color="#8884d8" 
        />
      </div>
      
      {/* Графики */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* График по категориям */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium mb-4" style={{ color: themeColors.darkTeal }}>
            Топ категорий по продажам
          </h4>
          {analytics.topCategories.length > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.topCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {analytics.topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Количество']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center">
              <p className="text-gray-500">Нет данных для отображения</p>
            </div>
          )}
        </div>
        
        {/* График по дням недели */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium mb-4" style={{ color: themeColors.darkTeal }}>
            Продажи по дням недели
          </h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.salesByDay}>
                <Bar dataKey="value" name="Количество">
                  {analytics.salesByDay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Tooltip formatter={(value) => [value, 'Количество']} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsWidget;