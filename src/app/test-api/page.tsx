'use client';

import { useState, useEffect } from 'react';
import { useAppTheme } from '@/hooks/useTheme';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchModels, 
  checkApiHealth,
  getFullImageUrl
} from '@/services/api';
import { formatApiProduct } from '@/utils/apiHelpers';
import { cn } from '@/lib/utils';

export default function TestApiPage() {
  const { isDark } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [data, setData] = useState({
    products: [] as any[],
    categories: [] as any[],
    models: [] as any[],
    formattedProducts: [] as any[]
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Проверяем доступность API
      console.log('🔍 Проверяем доступность API...');
      const isHealthy = await checkApiHealth();
      setApiStatus(isHealthy ? 'online' : 'offline');
      
      if (!isHealthy) {
        throw new Error('API недоступно. Проверьте подключение к серверу.');
      }

      // 2. Загружаем продукты
      console.log('📦 Загружаем продукты...');
      const products = await fetchProducts();
      console.log('Продукты получены:', products);

      // 3. Загружаем категории
      console.log('📂 Загружаем категории...');
      const categories = await fetchCategories();
      console.log('Категории получены:', categories);

      // 4. Загружаем модели (для первого продукта)
      let models: any[] = [];
      if (products.length > 0) {
        console.log('🎨 Загружаем модели...');
        models = await fetchModels(products[0].slug);
        console.log('Модели получены:', models);
      }

      // 5. Форматируем продукты
      console.log('🔄 Форматируем продукты...');
      const formattedProducts = await Promise.all(
        products.slice(0, 5).map(async (product) => {
          const productModels = await fetchModels(product.slug);
          return await formatApiProduct(product, productModels);
        })
      );
      console.log('Отформатированные продукты:', formattedProducts);

      setData({
        products,
        categories,
        models,
        formattedProducts
      });

    } catch (err: any) {
      console.error('❌ Ошибка тестирования API:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Функции для получения CSS классов статуса
  const getStatusClasses = (status: typeof apiStatus) => {
    const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg border";
    
    switch (status) {
      case 'online': 
        return cn(baseClasses, "bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-800 dark:text-emerald-200");
      case 'offline': 
        return cn(baseClasses, "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200");
      default: 
        return cn(baseClasses, "bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/50 dark:border-amber-800 dark:text-amber-200");
    }
  };

  const getStatusText = (status: typeof apiStatus) => {
    switch (status) {
      case 'online': return '🟢 Онлайн';
      case 'offline': return '🔴 Офлайн';
      default: return '🟡 Проверка...';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Заголовок */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            🧪 Тест API Подключения
          </h1>
          <div className={getStatusClasses(apiStatus)}>
            <span>{getStatusText(apiStatus)}</span>
          </div>
        </div>

        {/* Кнопка обновления */}
        <div className="text-center">
          <button
            onClick={testApi}
            disabled={loading}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50",
              "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {loading ? '🔄 Тестирование...' : '🔄 Повторить тест'}
          </button>
        </div>

        {/* Ошибка */}
        {error && (
          <div className={cn(
            "p-4 rounded-lg border",
            "bg-red-50 border-red-200 text-red-800",
            "dark:bg-red-950/50 dark:border-red-800 dark:text-red-200"
          )}>
            <h3 className="font-semibold mb-2">❌ Ошибка:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Результаты */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Статистика */}
            <div className="p-6 rounded-lg border bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                📊 Статистика
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Продукты:</span>
                  <span className="font-medium text-foreground">{data.products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Категории:</span>
                  <span className="font-medium text-foreground">{data.categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Модели (первый товар):</span>
                  <span className="font-medium text-foreground">{data.models.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Обработанные товары:</span>
                  <span className="font-medium text-foreground">{data.formattedProducts.length}</span>
                </div>
              </div>
            </div>

            {/* Категории */}
            <div className="p-6 rounded-lg border bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                📂 Категории
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.categories.map((category: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex justify-between p-2 rounded bg-muted"
                  >
                    <span className="font-medium text-foreground">{category.Name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.slug}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Продукты */}
            <div className="lg:col-span-2 p-6 rounded-lg border bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                📦 Обработанные продукты (первые 5)
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {data.formattedProducts.map((product: any, index: number) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border bg-muted border-border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Левая часть - изображение и основная информация */}
                      <div>
                        {/* Изображение */}
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl}
                            alt={product.Name}
                            className="w-full h-32 object-cover rounded mb-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getFullImageUrl();
                            }}
                          />
                        )}
                        
                        {/* Основная информация */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm text-foreground">
                            {product.Name}
                          </h3>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {product.brandName}
                            </span>
                            <span className="font-medium text-primary">
                              {product.Price}₽
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Правая часть - детальная информация */}
                      <div className="space-y-3 text-xs">
                        {/* Цвета */}
                        <div>
                          <span className="font-semibold text-foreground">
                            Цвета ({product.colors.length}):
                          </span>
                          <div className="mt-1">
                            {product.colors.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.colors.map((color: string, colorIndex: number) => (
                                  <span 
                                    key={colorIndex}
                                    className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground"
                                  >
                                    {color}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-destructive">
                                ❌ Цвета не найдены
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Размеры */}
                        <div>
                          <span className="font-semibold text-foreground">
                            Размеры ({product.sizes.length}):
                          </span>
                          <div className="mt-1">
                            {product.sizes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.slice(0, 5).map((size: number, sizeIndex: number) => (
                                  <span 
                                    key={sizeIndex}
                                    className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground"
                                  >
                                    {size}
                                  </span>
                                ))}
                                {product.sizes.length > 5 && (
                                  <span className="text-muted-foreground">
                                    +{product.sizes.length - 5}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400">
                                ⚠️ Размеры не найдены
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Категории */}
                        <div>
                          <span className="font-semibold text-foreground">
                            Категории:
                          </span>
                          <div className="mt-1">
                            {product.categoryNames.length > 0 ? (
                              product.categoryNames.map((cat: string, catIndex: number) => (
                                <span 
                                  key={catIndex}
                                  className="inline-block px-2 py-1 rounded text-xs mr-1 bg-primary text-primary-foreground"
                                >
                                  {cat}
                                </span>
                              ))
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400">
                                ⚠️ Категории не найдены
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Гендер */}
                        {product.genders.length > 0 && (
                          <div>
                            <span className="font-semibold text-foreground">
                              Пол:
                            </span>
                            <span className="ml-2 text-muted-foreground">
                              {product.genders.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Логи в консоли */}
        <div className="p-4 rounded-lg border bg-muted border-border">
          <p className="text-sm text-muted-foreground">
            💡 Откройте консоль разработчика (F12) чтобы увидеть подробные логи запросов
          </p>
        </div>

      </div>
    </div>
  );
}