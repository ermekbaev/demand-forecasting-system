'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
// В src/app/page.tsx в самом начале после других импортов
import { SearchBar } from '../components/search/SearchBar';

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

// Иконки с обновленным дизайном
const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const ArrowRightIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

const TrendingUpIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
  </svg>
);

const SparklesIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

const DiamondIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12l4 6-10 12L2 9z"/>
    <path d="m12 22 4-16"/>
    <path d="m8 6 4 16"/>
    <path d="M2 9h20"/>
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
        
        // Загружаем продукты (первые 12 для главной страницы)
        const productsResponse = await fetch('/api/products?limit=12');
        // Можно вернуть featured=true позже, когда убедимся что API работает
        if (!productsResponse.ok) {
          throw new Error('Ошибка загрузки продуктов');
        }
        const productsData = await productsResponse.json();
        console.log('📡 Ответ API товаров:', productsData);
        
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
        console.log('🛍️ Загружено товаров на главную страницу:', transformedProducts.length);

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
// Заменить старую функцию на эту:
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  if (loading) {
    return (
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
              margin: '0 auto 24px',
            }}
          />
          <div style={{
            width: '200px',
            height: '4px',
            background: 'var(--color-border)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '0 auto 16px',
          }}>
            <div className="loading-progress" style={{ height: '100%', borderRadius: '2px' }} />
          </div>
          <p style={{ color: 'var(--color-placeholder)', fontSize: '16px', fontWeight: '500' }}>
            Загружаем коллекцию...
          </p>
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
        background: 'var(--color-background)',
        padding: '20px',
      }}>
        <Card variant="elevated" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--gradient-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              opacity: 0.8,
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
            </div>
            <h2 style={{ color: 'var(--color-error)', marginBottom: '8px', fontSize: '20px', fontWeight: '600' }}>
              Ошибка загрузки
            </h2>
            <p style={{ color: 'var(--color-placeholder)', marginBottom: '24px', lineHeight: '1.5' }}>
              {error}
            </p>
          </div>
          <Button variant="gradient" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Премиальный героический баннер */}
      <section className="hero-gradient" style={{
        position: 'relative',
        padding: '100px 20px 120px',
        overflow: 'visible',
        background: 'var(--gradient-hero)',
        zIndex: 1,
      }}>
        {/* Декоративные элементы с анимацией */}
        <div className="animate-float" style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '120px',
          height: '120px',
          background: 'rgba(52, 211, 153, 0.1)',
          borderRadius: '50%',
          border: '1px solid rgba(52, 211, 153, 0.2)',
        }} />
        <div className="animate-float" style={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          width: '80px',
          height: '80px',
          background: 'rgba(16, 185, 129, 0.15)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animationDelay: '2s',
        }} />
        <div className="animate-float" style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '60px',
          height: '60px',
          background: 'rgba(6, 95, 70, 0.2)',
          borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
          animationDelay: '4s',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Премиальный бейдж */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px 24px',
            borderRadius: '50px',
            marginBottom: '32px',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            <DiamondIcon size={18} />
            <span style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
              PREMIUM COLLECTION 2024
            </span>
          </div>

          {/* Главный заголовок с градиентом */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: '900',
            marginBottom: '32px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}>
            <span style={{ color: '#ffffff' }}>Элегантность</span>
            <br />
            <span className="text-gradient" style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              в каждой детали
            </span>
          </h1>

          <p style={{
            fontSize: '20px',
            marginBottom: '48px',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '400',
          }}>
            Откройте для себя эксклюзивную коллекцию премиальной одежды и обуви. 
            Безупречное качество, современный дизайн и непревзойденный комфорт.
          </p>

          {/* Премиальный поиск */}
            <div style={{
              maxWidth: '600px',
              margin: '0 auto 56px',
              position: 'relative',
            }}>
              <SearchBar 
                placeholder="Поиск премиальных товаров..."
                variant="hero"
                onSearch={handleSearch}
                showSuggestions={true}
              />
            </div>

          {/* Кнопки действий */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/catalog'}
              className="glass"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(16px)',
                fontWeight: '600',
                padding: '16px 32px',
              }}
            >
              Каталог
              <ArrowRightIcon size={20} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.location.href = '/popular'}
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: '600',
                padding: '16px 32px',
              }}
            >
              <TrendingUpIcon size={20} />
              Тренды
            </Button>
          </div>
        </div>

        {/* Дополнительные декоративные элементы */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '100px',
          background: 'radial-gradient(ellipse, rgba(52, 211, 153, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </section>

      {/* Основной контент с обновленным дизайном */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '60px 12px' }}>
        
        {/* Секция категорий */}
        {categories.length > 0 && (
          <section style={{ marginBottom: '70px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
            }}>
              <div>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'var(--gradient-emerald)',
                  borderRadius: '20px',
                  marginBottom: '12px',
                }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
                    КАТЕГОРИИ
                  </span>
                </div>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  Выберите стиль
                </h2>
                <p style={{
                  color: 'var(--color-placeholder)',
                  fontSize: '18px',
                  fontWeight: '400',
                }}>
                  Откройте для себя мир премиальной моды
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/categories'}
                style={{
                  borderColor: 'var(--emerald-500)',
                  color: 'var(--emerald-600)',
                  fontWeight: '600',
                }}
              >
                Все категории
                <ArrowRightIcon size={16} />
              </Button>
            </div>

            <div 
              className="categories-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                justifyItems: 'stretch',
                width: '100%',
              }}
            >
              {categories.slice(0, 4).map((category, index) => (
                <Card
                  key={category.slug}
                  variant="elevated"
                  hover
                  padding="none"
                  onClick={() => window.location.href = `/category/${category.slug}`}
                  className="premium-card emerald-accent"
                  style={{
                    cursor: 'pointer',
                    background: 'var(--gradient-surface)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '200px',
                    width: '100%',
                  }}
                >
                  {/* Декоративный градиент */}
                  <div style={{
                    height: '120px',
                    background: `linear-gradient(135deg, var(--emerald-600) 0%, var(--emerald-700) 100%)`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {/* Декоративные элементы */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '24px',
                      height: '24px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      width: '12px',
                      height: '12px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                    }} />
                    
                    {/* Название категории */}
                    <div className="glass" style={{
                      padding: '8px 20px',
                      borderRadius: '20px',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}>
                      <span style={{
                        fontWeight: '700',
                        color: '#ffffff',
                        fontSize: '14px',
                        letterSpacing: '0.5px',
                      }}>
                        {category.name}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '80px',
                  }}>
                    <p style={{
                      color: 'var(--color-placeholder)',
                      fontSize: '12px',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}>
                      {category.count} товаров
                    </p>
                    <div style={{
                      width: '30px',
                      height: '2px',
                      background: 'var(--gradient-emerald)',
                      margin: '0 auto',
                      borderRadius: '1px',
                    }} />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Секция продуктов */}
        {products.length > 0 && (
          <section>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'var(--gradient-emerald)',
                  borderRadius: '20px',
                  marginBottom: '12px',
                }}>
                  <SparklesIcon size={14} />
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
                    КОЛЛЕКЦИЯ
                  </span>
                </div>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  Премиальные товары
                </h2>
                <p style={{
                  color: 'var(--color-placeholder)',
                  fontSize: '18px',
                  fontWeight: '400',
                }}>
                  Самые востребованные позиции сезона
                </p>
              </div>
              <Button 
                variant="gradient"
                onClick={() => window.location.href = '/catalog'}
                style={{
                  background: 'var(--gradient-button)',
                  fontWeight: '600',
                  boxShadow: 'var(--shadow-emerald)',
                }}
              >
                Смотреть все
                <ArrowRightIcon size={16} />
              </Button>
            </div>

            <div 
              className="products-grid-compact"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px',
                justifyItems: 'stretch',
                width: '100%',
              }}
            >
              {products.map((product) => (
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
                    categoryName: product.categoryName,
                    originalPrice: product.originalPrice,
                    isNew: product.isNew,
                    isSale: product.isSale,
                    rating: product.rating,
                  }}
                  size="standard"
                  showQuickActions
                  onAddToCart={(product: any) => handleProductAction('add-to-cart', product)}
                  onToggleFavorite={(product: any) => handleProductAction('toggle-favorite', product)}
                  onQuickView={(product: any) => handleProductAction('quick-view', product)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Премиальная CTA секция */}
        <section style={{
          marginTop: '70px',
          padding: '50px 24px',
          background: 'var(--gradient-surface)',
          borderRadius: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}>
          {/* Декоративные элементы */}
          <div className="animate-float" style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'var(--gradient-emerald)',
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(60px)',
          }} />
          <div className="animate-float" style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            background: 'var(--gradient-emerald)',
            borderRadius: '50%',
            opacity: 0.08,
            filter: 'blur(40px)',
            animationDelay: '3s',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'var(--gradient-emerald)',
              borderRadius: '30px',
              marginBottom: '24px',
            }}>
              <DiamondIcon size={16} />
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
                ЭКСКЛЮЗИВ
              </span>
            </div>
            
            <h3 style={{
              fontSize: '42px',
              fontWeight: '800',
              color: 'var(--color-text)',
              marginBottom: '16px',
              letterSpacing: '-0.01em',
            }}>
              Станьте частью сообщества
            </h3>
            <p style={{
              fontSize: '20px',
              color: 'var(--color-placeholder)',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
              fontWeight: '400',
            }}>
              Получайте эксклюзивные предложения, первыми узнавайте о новых коллекциях 
              и получите скидку 15% на первый заказ
            </p>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              maxWidth: '500px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <input
                type="email"
                placeholder="Ваш email адрес"
                style={{
                  flex: 1,
                  minWidth: '280px',
                  padding: '18px 24px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: 'var(--color-card)',
                  color: 'var(--color-text)',
                  fontWeight: '500',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--emerald-500)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
              <Button 
                variant="gradient" 
                size="lg"
                style={{
                  background: 'var(--gradient-button)',
                  fontWeight: '600',
                  padding: '18px 32px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-emerald)',
                }}
              >
                Подписаться
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-placeholder)',
                fontSize: '14px',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--emerald-500)',
                  borderRadius: '50%',
                }} />
                Бесплатная доставка от 5000₽
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-placeholder)',
                fontSize: '14px',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--emerald-500)',
                  borderRadius: '50%',
                }} />
                Гарантия качества
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-placeholder)',
                fontSize: '14px',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--emerald-500)',
                  borderRadius: '50%',
                }} />
                Возврат 30 дней
              </div>
            </div>
          </div>
        </section>

        {/* Секция статистики */}
        <section style={{
          marginTop: '60px',
          padding: '40px 0',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                color: 'var(--emerald-600)',
                marginBottom: '8px',
              }}>
                10K+
              </div>
              <p style={{
                color: 'var(--color-placeholder)',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                Довольных клиентов
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                color: 'var(--emerald-600)',
                marginBottom: '8px',
              }}>
                500+
              </div>
              <p style={{
                color: 'var(--color-placeholder)',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                Брендов в каталоге
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                color: 'var(--emerald-600)',
                marginBottom: '8px',
              }}>
                98%
              </div>
              <p style={{
                color: 'var(--color-placeholder)',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                Положительных отзывов
              </p>
            </div>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                color: 'var(--emerald-600)',
                marginBottom: '8px',
              }}>
                24/7
              </div>
              <p style={{
                color: 'var(--color-placeholder)',
                fontSize: '16px',
                fontWeight: '500',
              }}>
                Поддержка клиентов
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CSS анимации для премиального эффекта */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(3deg); 
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .hero-gradient {
          background: var(--gradient-hero);
          background-size: 400% 400%;
          animation: gradient-shift 20s ease infinite;
        }

        .text-gradient {
          background: linear-gradient(135deg, #34d399 0%, #6ee7b7 50%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .premium-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-emerald-lg);
        }

        .emerald-accent:hover {
          box-shadow: var(--shadow-emerald-lg);
        }

        /* Адаптивность */
        @media (max-width: 640px) {
          .hero-gradient {
            padding: 50px 12px 70px;
          }
          
          h1 {
            font-size: clamp(28px, 6vw, 48px) !important;
          }
          
          .glass {
            flex-direction: column;
            gap: 16px;
          }
          
          .glass input {
            padding: 16px 24px;
          }
          
          .products-grid-compact {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          
          .categories-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .container {
            padding: 50px 8px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .products-grid-compact {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .products-grid-compact {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
          }
          
          .categories-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 1025px) and (max-width: 1200px) {
          .products-grid-compact {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 18px !important;
          }
          
          .categories-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 1201px) and (max-width: 1400px) {
          .products-grid-compact {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 18px !important;
          }
          
          .categories-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 1401px) {
          .products-grid-compact {
            grid-template-columns: repeat(5, 1fr) !important;
            gap: 20px !important;
          }
          
          .categories-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}