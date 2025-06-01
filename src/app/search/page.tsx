'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { ProductCard } from '@/components/products/ProductCard';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

// Интерфейсы
interface Product {
  slug: string;
  Name: string;
  Price: number;
  imageUrl: string;
  brandName: string;
  colors?: string[];
  sizes?: (string | number)[];
  genders?: string[];
  categoryName?: string;
  originalPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
}

interface Filters {
  brands: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  genders: string[];
}

interface FilterOptions {
  brands: Array<{ name: string; count: number }>;
  categories: Array<{ name: string; count: number }>;
  colors: Array<{ name: string; count: number }>;
  sizes: Array<{ size: string; count: number }>;
  genders: Array<{ name: string; count: number }>;
  priceRange: { min: number; max: number };
}

const sortOptions = [
  { value: 'relevance', label: 'По релевантности' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'name', label: 'По названию' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'new', label: 'Сначала новинки' },
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  // ✅ Расширенные фильтры с гендером
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 50000,
    sizes: [],
    colors: [],
    genders: [],
  });

  // ✅ Доступные опции для фильтров
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [
      { name: 'Nike', count: 156 },
      { name: 'Adidas', count: 134 },
      { name: 'New Balance', count: 89 },
      { name: 'Converse', count: 67 },
      { name: 'Vans', count: 45 },
      { name: 'Puma', count: 38 },
    ],
    categories: [
      { name: 'Кроссовки', count: 245 },
      { name: 'Спортивная обувь', count: 189 },
      { name: 'Lifestyle', count: 123 },
      { name: 'Баскетбольные', count: 67 },
      { name: 'Беговые', count: 98 },
    ],
    colors: [
      { name: 'Черный', count: 89 },
      { name: 'Белый', count: 76 },
      { name: 'Красный', count: 45 },
      { name: 'Серый', count: 67 },
      { name: 'Синий', count: 54 },
      { name: 'Зеленый', count: 32 },
    ],
    sizes: [
      { size: '38', count: 23 },
      { size: '39', count: 34 },
      { size: '40', count: 45 },
      { size: '41', count: 56 },
      { size: '42', count: 67 },
      { size: '43', count: 54 },
      { size: '44', count: 43 },
      { size: '45', count: 32 },
    ],
    genders: [
      { name: 'Мужские', count: 234 },
      { name: 'Женские', count: 189 },
      { name: 'Унисекс', count: 67 },
    ],
    priceRange: { min: 500, max: 25000 }
  });

  // Получаем поисковый запрос из URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    
    setQuery(q);
    
    // Устанавливаем фильтры из URL
    if (category) {
      setFilters(prev => ({ ...prev, categories: [category] }));
    }
    if (brand) {
      setFilters(prev => ({ ...prev, brands: [brand] }));
    }
  }, [searchParams]);

  // Выполняем поиск при изменении параметров
  useEffect(() => {
    if (query || hasActiveFilters()) {
      performSearch();
    }
  }, [query, filters, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (query) params.append('q', query);
      if (filters.brands.length > 0) params.append('brand', filters.brands[0]);
      if (filters.categories.length > 0) params.append('category', filters.categories[0]);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice < 50000) params.append('maxPrice', filters.maxPrice.toString());
      
      // ✅ Добавляем новые параметры фильтров
      if (filters.genders.length > 0) params.append('gender', filters.genders.join(','));
      if (filters.sizes.length > 0) params.append('sizes', filters.sizes.join(','));
      if (filters.colors.length > 0) params.append('colors', filters.colors.join(','));
      
      params.append('sort', sortBy);
      params.append('limit', '24');

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Ошибка поиска');
      }
      
      const data = await response.json();
      
      // Преобразуем результаты в нужный формат
      const transformedProducts = data.results?.map((product: any) => ({
        ...product,
        originalPrice: product.Price > 5000 ? product.Price + Math.floor(Math.random() * 3000) : undefined,
        isNew: Math.random() > 0.8,
        isSale: product.Price < 10000,
        rating: +(4 + Math.random()).toFixed(1),
      })) || [];
      
      setProducts(transformedProducts);
      setTotalResults(data.total || transformedProducts.length);
      
    } catch (err) {
      console.error('Ошибка поиска:', err);
      setError(err instanceof Error ? err.message : 'Ошибка поиска');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (newQuery: string) => {
    setQuery(newQuery);
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  // ✅ Обновленная функция очистки всех фильтров
  const clearAllFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      minPrice: 0,
      maxPrice: 50000,
      sizes: [],
      colors: [],
      genders: [],
    });
  };

  // ✅ Удаление конкретного фильтра
  const removeFilter = (type: keyof Filters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [type]: Array.isArray(prev[type]) 
        ? (prev[type] as any[]).filter(item => item !== value)
        : type === 'minPrice' ? 0 : type === 'maxPrice' ? 50000 : prev[type]
    }));
  };

  // ✅ Проверка наличия активных фильтров
  const hasActiveFilters = () => {
    return filters.brands.length > 0 || 
           filters.categories.length > 0 || 
           filters.minPrice > 0 || 
           filters.maxPrice < 50000 ||
           filters.sizes.length > 0 ||
           filters.colors.length > 0 ||
           filters.genders.length > 0;
  };

  const handleProductAction = (action: string, product: Product) => {
    console.log(`${action}:`, product);
    // TODO: Реализовать действия с товарами
  };

  // ✅ Получение всех активных фильтров для отображения
  const getActiveFilterTags = () => {
    const tags: Array<{ type: keyof Filters; value: string | number; label: string }> = [];
    
    filters.brands.forEach(brand => 
      tags.push({ type: 'brands', value: brand, label: `Бренд: ${brand}` })
    );
    filters.categories.forEach(category => 
      tags.push({ type: 'categories', value: category, label: `Категория: ${category}` })
    );
    filters.genders.forEach(gender => 
      tags.push({ type: 'genders', value: gender, label: `Пол: ${gender}` })
    );
    filters.colors.forEach(color => 
      tags.push({ type: 'colors', value: color, label: `Цвет: ${color}` })
    );
    filters.sizes.forEach(size => 
      tags.push({ type: 'sizes', value: size, label: `Размер: ${size}` })
    );
    
    if (filters.minPrice > 0) {
      tags.push({ type: 'minPrice', value: filters.minPrice, label: `От: ${filters.minPrice}₽` });
    }
    if (filters.maxPrice < 50000) {
      tags.push({ type: 'maxPrice', value: filters.maxPrice, label: `До: ${filters.maxPrice}₽` });
    }
    
    return tags;
  };

  return (
    <div className="min-h-screen bg-background pt-10">
      <div className="max-w-[1600px] mx-auto px-5">
        
        {/* Поисковая строка */}
        <div className="mb-10 text-center">
          <SearchBar 
            placeholder="Поиск товаров, брендов, категорий..."
            onSearch={handleNewSearch}
            autoFocus
            variant="default"
          />
        </div>

        {/* Заголовок результатов */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">
              {query ? `Результаты поиска "${query}"` : 'Поиск товаров'}
            </h1>
            {totalResults > 0 && (
              <p className="text-base text-muted-foreground font-medium">
                Найдено {totalResults} товаров
              </p>
            )}
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Сортировка */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-3 border border-border rounded-xl bg-card text-foreground text-sm font-medium cursor-pointer outline-none appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon 
                name="chevron-down"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                size="sm"
              />
            </div>

            {/* Кнопка фильтров */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                hasActiveFilters() && "border-primary text-primary bg-primary/5"
              )}
            >
              <Icon name="filter" size="sm" />
              Фильтры
              {hasActiveFilters() && (
                <div className="w-2 h-2 bg-primary rounded-full ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* ✅ Активные фильтры - обновленная версия */}
        {hasActiveFilters() && (
          <div className="flex gap-2 mb-6 flex-wrap items-center">
            <span className="text-sm font-semibold text-foreground">
              Активные фильтры:
            </span>
            
            {getActiveFilterTags().map((tag, index) => (
              <div
                key={`${tag.type}-${tag.value}-${index}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground"
              >
                {tag.label}
                <button
                  onClick={() => removeFilter(tag.type, tag.value)}
                  className="bg-transparent border-0 cursor-pointer text-muted-foreground hover:text-foreground p-0.5 flex items-center transition-colors"
                >
                  <Icon name="close" size="xs" />
                </button>
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground text-xs"
            >
              Очистить все
            </Button>
          </div>
        )}

        {/* Основной контент */}
        <div className={cn(
          "grid gap-8 items-start",
          showFilters ? "grid-cols-1 lg:grid-cols-[280px_1fr]" : "grid-cols-1"
        )}>
          
          {/* ✅ Новая панель фильтров */}
          {showFilters && (
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
              showMobileClose={true}
              availableOptions={filterOptions}
            />
          )}

          {/* Результаты поиска */}
          <div>
            {loading && (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary mx-auto mb-4" />
                  <p className="text-muted-foreground text-base">
                    Ищем товары...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <Card variant="elevated" className="text-center p-10">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ошибка поиска
                </h3>
                <p className="text-muted-foreground mb-6">
                  {error}
                </p>
                <Button
                  variant="gradient"
                  onClick={performSearch}
                >
                  Попробовать снова
                </Button>
              </Card>
            )}

            {!loading && !error && products.length === 0 && query && (
              <Card variant="elevated" className="text-center p-15">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="search" size="lg" className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Ничего не найдено
                </h3>
                <p className="text-muted-foreground mb-8 text-base max-w-md mx-auto leading-relaxed">
                  Мы не смогли найти товары по запросу "{query}". 
                  Попробуйте изменить поисковый запрос или очистить фильтры.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    variant="gradient"
                    onClick={() => {
                      setQuery('');
                      router.push('/catalog');
                    }}
                  >
                    Смотреть весь каталог
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                  >
                    Очистить фильтры
                  </Button>
                </div>
              </Card>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                {/* ✅ Оптимизированная сетка для поиска */}
                <div className={cn(
                  "grid gap-5 justify-items-stretch",
                  showFilters 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                )}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      size="compact"
                      showQuickActions
                      onAddToCart={(product: any) => handleProductAction('add-to-cart', product)}
                      onToggleFavorite={(product: any) => handleProductAction('toggle-favorite', product)}
                      onQuickView={(product: any) => handleProductAction('quick-view', product)}
                    />
                  ))}
                </div>

                {/* Загрузить еще */}
                {products.length < totalResults && (
                  <div className="text-center mt-15 p-10">
                    <p className="text-muted-foreground mb-6 text-base">
                      Показано {products.length} из {totalResults} товаров
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        // TODO: Загрузить следующую страницу
                        console.log('Загрузить еще товары');
                      }}
                      className="min-w-[200px]"
                    >
                      Показать еще
                    </Button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && !query && products.length === 0 && (
              <Card variant="elevated" className="text-center p-15">
                <div className="w-20 h-20 bg-gradient-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="search" size="lg" className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Начните поиск
                </h3>
                <p className="text-muted-foreground mb-8 text-base max-w-md mx-auto leading-relaxed">
                  Введите название товара, бренда или категории в поисковую строку выше
                </p>
                <Button
                  variant="gradient"
                  onClick={() => router.push('/catalog')}
                >
                  Смотреть весь каталог
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-base">
            Загрузка поиска...
          </p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}