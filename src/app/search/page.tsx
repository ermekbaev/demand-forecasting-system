'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { ProductCard } from '@/components/products/ProductCard';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useTheme';

// Иконки
const FilterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
);

const SortIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 16 4 4 4-4"/>
    <path d="M7 20V4"/>
    <path d="m21 8-4-4-4 4"/>
    <path d="M17 4v16"/>
  </svg>
);

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18"/>
    <path d="M6 6l12 12"/>
  </svg>
);

const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

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
  const { colors, isDark } = useAppTheme();
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

  // ✅ Доступные опции для фильтров (можно загружать с API)
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
    <div style={{ 
      minHeight: '100vh', 
      background: colors.background,
      paddingTop: '40px',
    }}>
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: '0 20px',
      }}>
        
        {/* Поисковая строка */}
        <div style={{ 
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <SearchBar 
            placeholder="Поиск товаров, брендов, категорий..."
            onSearch={handleNewSearch}
            autoFocus
            variant="default"
          />
        </div>

        {/* Заголовок результатов */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: colors.text,
              marginBottom: '8px',
              letterSpacing: '-0.01em',
            }}>
              {query ? `Результаты поиска "${query}"` : 'Поиск товаров'}
            </h1>
            {totalResults > 0 && (
              <p style={{
                fontSize: '16px',
                color: colors.placeholder,
                fontWeight: '500',
              }}>
                Найдено {totalResults} товаров
              </p>
            )}
          </div>

          {/* Кнопки управления */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Сортировка */}
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '12px 40px 12px 16px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  background: colors.card,
                  color: colors.text,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SortIcon 
                size={16} 
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.placeholder,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Кнопка фильтров */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                borderColor: hasActiveFilters() ? colors.tint : colors.border,
                color: hasActiveFilters() ? colors.tint : colors.text,
                background: hasActiveFilters() ? 'rgba(16, 185, 129, 0.1)' : colors.card,
              }}
            >
              <FilterIcon size={16} />
              Фильтры
              {hasActiveFilters() && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: colors.tint,
                  borderRadius: '50%',
                  marginLeft: '4px',
                }} />
              )}
            </Button>
          </div>
        </div>

        {/* ✅ Активные фильтры - обновленная версия */}
        {hasActiveFilters() && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: colors.text,
            }}>
              Активные фильтры:
            </span>
            
            {getActiveFilterTags().map((tag, index) => (
              <div
                key={`${tag.type}-${tag.value}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: colors.cardBackground,
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: colors.text,
                }}
              >
                {tag.label}
                <button
                  onClick={() => removeFilter(tag.type, tag.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.placeholder,
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <XIcon size={12} />
                </button>
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              style={{
                color: colors.placeholder,
                fontSize: '13px',
              }}
            >
              Очистить все
            </Button>
          </div>
        )}

        {/* Основной контент */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showFilters ? '280px 1fr' : '1fr',
          gap: '32px',
          alignItems: 'start',
        }}>
          
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
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
                    style={{ 
                      background: 'var(--gradient-emerald)',
                      WebkitMask: 'radial-gradient(circle at center, transparent 50%, black 51%)',
                      mask: 'radial-gradient(circle at center, transparent 50%, black 51%)',
                      margin: '0 auto 16px',
                    }}
                  />
                  <p style={{ color: colors.placeholder, fontSize: '16px' }}>
                    Ищем товары...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <Card variant="elevated" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}>
                  😕
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: '8px',
                }}>
                  Ошибка поиска
                </h3>
                <p style={{
                  color: colors.placeholder,
                  marginBottom: '24px',
                }}>
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
              <Card variant="elevated" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: colors.cardBackground,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <SearchIcon size={32} style={{ color: colors.placeholder }} />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: colors.text,
                  marginBottom: '12px',
                }}>
                  Ничего не найдено
                </h3>
                <p style={{
                  color: colors.placeholder,
                  marginBottom: '32px',
                  fontSize: '16px',
                  maxWidth: '400px',
                  margin: '0 auto 32px',
                  lineHeight: '1.5',
                }}>
                  Мы не смогли найти товары по запросу "{query}". 
                  Попробуйте изменить поисковый запрос или очистить фильтры.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                <div 
                  className="search-results-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: showFilters 
                      ? 'repeat(auto-fill, minmax(240px, 1fr))' 
                      : 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '20px',
                    justifyItems: 'stretch',
                    alignItems: 'start',
                  }}
                >
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
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '60px',
                    padding: '40px 20px',
                  }}>
                    <p style={{
                      color: colors.placeholder,
                      marginBottom: '24px',
                      fontSize: '16px',
                    }}>
                      Показано {products.length} из {totalResults} товаров
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        // TODO: Загрузить следующую страницу
                        console.log('Загрузить еще товары');
                      }}
                      style={{
                        minWidth: '200px',
                      }}
                    >
                      Показать еще
                    </Button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && !query && products.length === 0 && (
              <Card variant="elevated" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'var(--gradient-emerald)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <SearchIcon size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: colors.text,
                  marginBottom: '12px',
                }}>
                  Начните поиск
                </h3>
                <p style={{
                  color: colors.placeholder,
                  marginBottom: '32px',
                  fontSize: '16px',
                  maxWidth: '400px',
                  margin: '0 auto 32px',
                  lineHeight: '1.5',
                }}>
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

      {/* ✅ Адаптивные стили */}
      <style jsx>{`
        .search-results-grid {
          width: 100%;
          margin: 0 auto;
        }

        /* Мобильные устройства */
        @media (max-width: 640px) {
          .search-results-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 0 8px;
          }
        }

        /* Планшеты */
        @media (min-width: 641px) and (max-width: 1024px) {
          .search-results-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
            gap: 18px !important;
          }
        }

        /* Средние экраны */
        @media (min-width: 1025px) and (max-width: 1400px) {
          .search-results-grid {
            grid-template-columns: ${showFilters 
              ? 'repeat(auto-fill, minmax(220px, 1fr))' 
              : 'repeat(auto-fill, minmax(240px, 1fr))'
            } !important;
          }
        }

        /* Большие экраны */
        @media (min-width: 1401px) {
          .search-results-grid {
            grid-template-columns: ${showFilters 
              ? 'repeat(auto-fill, minmax(240px, 1fr))' 
              : 'repeat(auto-fill, minmax(260px, 1fr))'
            } !important;
          }
        }

        /* Ограничиваем максимальную ширину карточек */
        .search-results-grid > * {
          max-width: 320px;
          width: 100%;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
            style={{ 
              background: 'var(--gradient-emerald)',
              WebkitMask: 'radial-gradient(circle at center, transparent 50%, black 51%)',
              mask: 'radial-gradient(circle at center, transparent 50%, black 51%)',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: 'var(--color-placeholder)', fontSize: '16px' }}>
            Загрузка поиска...
          </p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}