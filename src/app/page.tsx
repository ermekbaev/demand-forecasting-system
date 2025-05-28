'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

import { DataDebugger } from '@/components/debug/DataDebugger';



// Типы на основе реальных данных API
interface Product {
  slug: string;
  Name: string;
  Price: number;
  imageUrl: string;
  brandName: string;
  colors?: string[];
  sizes?: (string | number)[]
  genders?: string[];
  categoryName?: string;
  originalPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
}

interface Category {
  name: string;
  count: number;
  slug: string;
}

// Иконки (остаются те же)
const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const ArrowRightIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

const TrendingUpIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
  </svg>
);

const SparklesIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных с API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем продукты (первые 8 для главной страницы)
        const productsResponse = await fetch('/api/products?limit=8&featured=true');
        if (!productsResponse.ok) {
          throw new Error('Ошибка загрузки продуктов');
        }
        const productsData = await productsResponse.json();
        
        // Преобразуем данные в нужный формат и добавляем дополнительные поля
        const transformedProducts = productsData.products?.map((product: any) => ({
          ...product,
          // Добавляем недостающие поля для красивого отображения
          originalPrice: product.Price > 5000 ? product.Price + Math.floor(Math.random() * 3000) : undefined,
          isNew: Math.random() > 0.7, // 30% товаров помечаем как новые
          isSale: product.Price < 10000, // Товары дешевле 10к помечаем как распродажа
          rating: +(4 + Math.random()).toFixed(1), // Рейтинг от 4.0 до 5.0
          categoryName: product.categoryName || 'Одежда',
        })) || [];
        
        setProducts(transformedProducts);

        // Загружаем категории
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Ошибка загрузки категорий');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);

      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Обработчики действий с товарами
  const handleProductAction = async (action: string, product: Product) => {
    console.log(`${action}:`, product);
    
    switch (action) {
      case 'add-to-cart':
        // Здесь будет логика добавления в корзину
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productSlug: product.slug,
              quantity: 1,
              size: product.sizes?.[0] || 42,
              colorId: 1,
            }),
          });
          if (response.ok) {
            // Показать уведомление об успехе
            console.log('Товар добавлен в корзину');
          }
        } catch (error) {
          console.error('Ошибка добавления в корзину:', error);
        }
        break;
        
      case 'toggle-favorite':
        // Логика избранного
        try {
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productSlug: product.slug,
              colorId: 1,
            }),
          });
          if (response.ok) {
            console.log('Товар добавлен/удален из избранного');
          }
        } catch (error) {
          console.error('Ошибка с избранным:', error);
        }
        break;
        
      case 'quick-view':
        // Открыть модальное окно или перейти на страницу товара
        window.location.href = `/products/${product.slug}`;
        break;
    }
  };

  // Обработка поиска
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        // Перенаправляем на страницу результатов поиска
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
            style={{ 
              borderColor: '#22c55e transparent #22c55e #22c55e',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Загружаем товары...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
      }}>
        <Card variant="elevated" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Ошибка загрузки</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

console.log(products, "==================PRODUCTS=====================");


  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Героический баннер */}
      <section style={{
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Декоративные элементы */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '50px',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
          }}>
            <SparklesIcon size={16} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              Новая коллекция весна-лето 2024
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: '800',
            marginBottom: '24px',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Стиль, который <br />
            <span style={{ color: '#ffffff' }}>вдохновляет</span>
          </h1>

          <p style={{
            fontSize: '18px',
            marginBottom: '40px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
          }}>
            Откройте для себя эксклюзивную коллекцию одежды и обуви 
            от ведущих мировых брендов. Качество, стиль и комфорт в каждой детали.
          </p>

          {/* Поиск с реальной функциональностью */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto 40px',
            position: 'relative',
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '50px',
              padding: '4px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
              <input
                type="text"
                placeholder="Найти товары..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  color: '#1f2937',
                  outline: 'none',
                }}
              />
              <Button
                variant="gradient"
                size="md"
                onClick={handleSearch}
                style={{
                  borderRadius: '50px',
                  minWidth: '120px',
                }}
              >
                <SearchIcon size={18} />
                Поиск
              </Button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/catalog'}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            >
              Каталог товаров
              <ArrowRightIcon size={18} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.location.href = '/popular'}
              style={{
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <TrendingUpIcon size={18} />
              Популярное
            </Button>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Категории с реальными данными */}
        {categories.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
            }}>
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}>
                  Популярные категории
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '16px',
                }}>
                  Выберите категорию и найдите идеальный стиль
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/categories'}
              >
                Все категории
                <ArrowRightIcon size={16} />
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}>
              {categories.slice(0, 4).map((category) => (
                <Card
                  key={category.slug}
                  variant="elevated"
                  hover
                  padding="none"
                  onClick={() => window.location.href = `/category/${category.slug}`}
                  style={{
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{
                    height: '160px',
                    background: `linear-gradient(135deg, #22c55e20, #16a34a20)`,
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '12px 24px',
                      borderRadius: '50px',
                      backdropFilter: 'blur(10px)',
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        fontSize: '16px',
                      }}>
                        {category.name}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '14px',
                    }}>
                      {category.count} товаров
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Популярные товары с реальными данными */}
        {products.length > 0 && (
          <section>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
            }}>
              <div>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px',
                }}>
                  Популярные товары
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '16px',
                }}>
                  Самые востребованные позиции этого сезона
                </p>
              </div>
              <Button 
                variant="gradient"
                onClick={() => window.location.href = '/catalog'}
              >
                Смотреть все
                <ArrowRightIcon size={16} />
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '32px',
            }}>
              {products.map((product, index) => (
                <div key={product.slug} style={{ position: 'relative' }}>
                    {index === 0 && (
                      <DataDebugger 
                        data={{
                          received: product,
                          expected: {
                            slug: "есть",
                            Name: "есть", 
                            brandName: product.brandName ? "✅" : "❌ отсутствует",
                            categoryName: product.categoryName ? "✅" : "❌ отсутствует",
                            imageUrl: product.imageUrl ? "✅" : "❌ отсутствует",
                            colors: product.colors?.length ? `✅ (${product.colors.length})` : "❌ отсутствует",
                            sizes: product.sizes?.length ? `✅ (${product.sizes.length})` : "❌ отсутствует"
                          }
                        }}
                        title="Отладка ProductCard"
                      />
                    )}
                <ProductCard
                  key={product.slug}
                  product={{
                    slug: product.slug,
                    Name: product.Name,
                    Price: product.Price,
                    imageUrl: product.imageUrl,
                    brandName: product.brandName,
                    colors: product.colors,
                    sizes: product.sizes,
                    genders: product.genders,
                  }}
                  size="standard"
                  showQuickActions
                  onAddToCart={(product:any) => handleProductAction('add-to-cart', product)}
                  onToggleFavorite={(product:any) => handleProductAction('toggle-favorite', product)}
                  onQuickView={(product:any) => handleProductAction('quick-view', product)}
                />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA секция остается без изменений */}
        <section style={{
          marginTop: '80px',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, #22c55e20, #16a34a10)',
            borderRadius: '50%',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '16px',
            }}>
              Подпишитесь на новости
            </h3>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px',
            }}>
              Будьте первыми, кто узнает о новых поступлениях, скидках и эксклюзивных предложениях
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '400px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <input
                type="email"
                placeholder="Ваш email"
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '16px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Button variant="gradient" size="lg">
                Подписаться
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
