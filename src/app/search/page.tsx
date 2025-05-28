'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { ProductCard } from '@/components/products/ProductCard';
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
  
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 50000,
    sizes: [],
    colors: [],
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
    if (query || filters.brands.length > 0 || filters.categories.length > 0) {
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

  const clearFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      minPrice: 0,
      maxPrice: 50000,
      sizes: [],
      colors: [],
    });
  };

  const removeFilter = (type: keyof Filters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [type]: Array.isArray(prev[type]) 
        ? (prev[type] as any[]).filter(item => item !== value)
        : prev[type]
    }));
  };

  const hasActiveFilters = () => {
    return filters.brands.length > 0 || 
           filters.categories.length > 0 || 
           filters.minPrice > 0 || 
           filters.maxPrice < 50000 ||
           filters.sizes.length > 0 ||
           filters.colors.length > 0;
  };

  const handleProductAction = (action: string, product: Product) => {
    console.log(`${action}:`, product);
    // TODO: Реализовать действия с товарами
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

            {/* Фильтры */}
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

        {/* Активные фильтры */}
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
            
            {filters.brands.map(brand => (
              <div
                key={`brand-${brand}`}
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
                Бренд: {brand}
                <button
                  onClick={() => removeFilter('brands', brand)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.placeholder,
                    padding: '2px',
                  }}
                >
                  <XIcon size={12} />
                </button>
              </div>
            ))}
            
            {filters.categories.map(category => (
              <div
                key={`category-${category}`}
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
                Категория: {category}
                <button
                  onClick={() => removeFilter('categories', category)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.placeholder,
                    padding: '2px',
                  }}
                >
                  <XIcon size={12} />
                </button>
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
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
          
          {/* Панель фильтров */}
          {showFilters && (
            <Card variant="elevated" style={{ position: 'sticky', top: '100px' }}>
              <div style={{
                padding: '24px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: colors.text,
                  }}>
                    Фильтры
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.placeholder,
                      padding: '4px',
                    }}
                    className="lg:hidden"
                  >
                    <XIcon size={20} />
                  </button>
                </div>

                {/* Ценовой диапазон */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: '12px',
                  }}>
                    Цена
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}>
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minPrice: parseInt(e.target.value) || 0
                      }))}
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.searchBackground,
                        color: colors.text,
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.maxPrice === 50000 ? '' : filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        maxPrice: parseInt(e.target.value) || 50000
                      }))}
                      style={{
                        padding: '8px 12px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.searchBackground,
                        color: colors.text,
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                {/* Быстрые фильтры */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: '12px',
                  }}>
                    Популярные бренды
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Nike', 'Adidas', 'New Balance', 'Converse'].map(brand => (
                      <label
                        key={brand}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: colors.text,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                brands: [...prev.brands, brand]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                brands: prev.brands.filter(b => b !== brand)
                              }));
                            }
                          }}
                          style={{ accentColor: colors.tint }}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  style={{
                    width: '100%',
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </Card>
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
                    onClick={clearFilters}
                  >
                    Очистить фильтры
                  </Button>
                </div>
              </Card>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div 
                  className="products-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: showFilters 
                      ? 'repeat(auto-fit, minmax(280px, 1fr))'
                      : 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    justifyItems: 'center',
                  }}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      size="standard"
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

      <style jsx>{`
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
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