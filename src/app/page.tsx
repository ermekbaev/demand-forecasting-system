'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SearchBar } from '../components/search/SearchBar';
import { Icon } from '../components/ui/Icon';
import { cn } from '@/lib/utils';

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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Обработка поиска - выносим наверх перед useEffect
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  // Загрузка данных с API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем продукты (первые 12 для главной страницы)
        const productsResponse = await fetch('/api/products?limit=12');
        if (!productsResponse.ok) {
          throw new Error('Ошибка загрузки продуктов');
        }
        const productsData = await productsResponse.json();
        // console.log('📡 Ответ API товаров:', productsData);
        
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
        // console.log('🛍️ Загружено товаров на главную страницу:', transformedProducts.length);

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
    // console.log(`${action}:`, product);
    
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary mx-auto mb-6" />
          <div className="w-50 h-1 bg-border rounded overflow-hidden mx-auto mb-4">
            <div className="h-full bg-gradient-emerald rounded animate-loading-progress" />
          </div>
          <p className="text-muted-foreground text-base font-medium">
            Загружаем коллекцию...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-5">
        <Card variant="elevated" className="text-center max-w-md p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 opacity-80">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-foreground text-xl font-semibold mb-2">
              Ошибка загрузки
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
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
    <div className="min-h-screen bg-background">
      {/* Премиальный героический баннер */}
      <section className="bg-gradient-hero relative overflow-visible z-10 py-25 px-5 lg:py-30">
        {/* Декоративные элементы с анимацией */}
        <div className="animate-float absolute top-[15%] left-[8%] w-30 h-30 bg-emerald-500/10 rounded-full border border-emerald-500/20" />
        <div className="animate-float absolute top-1/2 right-[10%] w-20 h-20 bg-emerald-500/15 border border-emerald-400/20 delay-[2s]"
             style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
        <div className="animate-float absolute bottom-[20%] left-[15%] w-15 h-15 bg-emerald-800/20 border border-emerald-600/20 delay-[4s]"
             style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }} />

        <div className="max-w-screen-xl mx-auto relative z-10">
          {/* Премиальный бейдж */}
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full mb-8 border border-white/20 text-white/90">
            <Icon name="gem" size="sm" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              PREMIUM COLLECTION 2024
            </span>
          </div>

          {/* Главный заголовок с градиентом */}
          <h1 className="text-center mb-8 leading-tight tracking-tight">
            <span className="block text-white text-4xl sm:text-5xl lg:text-7xl font-black">
              Элегантность
            </span>
            <span className="block bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-7xl font-black">
              в каждой детали
            </span>
          </h1>

          <p className="text-center text-lg sm:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-normal">
            Откройте для себя эксклюзивную коллекцию премиальной одежды и обуви. 
            Безупречное качество, современный дизайн и непревзойденный комфорт.
          </p>

          {/* Премиальный поиск */}
          <div className="max-w-2xl mx-auto mb-14 relative z-50">
            <SearchBar 
              placeholder="Поиск премиальных товаров..."
              variant="hero"
              onSearch={handleSearch}
              showSuggestions={true}
            />
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-5 justify-center flex-wrap">
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/catalog'}
              className="glass border-white/20 text-white backdrop-blur-lg font-semibold px-8"
            >
              Каталог
              <Icon name="arrow-right" size="sm" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.location.href = '/popular'}
              className="text-white/90 border border-white/20 font-semibold px-8"
            >
              <Icon name="trending-up" size="sm" />
              Тренды
            </Button>
          </div>
        </div>

        {/* Дополнительные декоративные элементы */}
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-50 h-25 bg-emerald-500/30 rounded-full filter blur-3xl" />
      </section>

      {/* Основной контент с обновленным дизайном */}
      <div className="max-w-screen-2xl mx-auto px-3 py-15">
        
        {/* Секция категорий */}
        {categories.length > 0 && (
          <section className="mb-18">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <div className="inline-block px-4 py-2 bg-gradient-emerald rounded-full mb-3">
                  <span className="text-white text-xs font-bold tracking-wider uppercase">
                    КАТЕГОРИИ
                  </span>
                </div>
                <h2 className="text-foreground text-4xl font-extrabold mb-2 tracking-tight">
                  Выберите стиль
                </h2>
                <p className="text-muted-foreground text-lg font-normal">
                  Откройте для себя мир премиальной моды
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/categories'}
                className="border-emerald-500 text-emerald-600 font-semibold"
              >
                Все категории
                <Icon name="arrow-right" size="sm" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-stretch w-full">
              {categories.slice(0, 4).map((category, index) => (
                <Card
                  key={category.slug}
                  variant="elevated"
                  hover
                  padding="none"
                  onClick={() => window.location.href = `/category/${category.slug}`}
                  className="premium-card emerald-accent cursor-pointer bg-gradient-surface dark:bg-gradient-surface-dark overflow-hidden relative h-50 w-full"
                >
                  {/* Декоративный градиент */}
                  <div className="h-30 bg-gradient-to-br from-emerald-600 to-emerald-700 relative flex items-center justify-center">
                    {/* Декоративные элементы */}
                    <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 rounded-full" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 bg-white/30 rounded-full" />
                    
                    {/* Название категории */}
                    <div className="glass px-5 py-2 rounded-full text-center bg-white/15 backdrop-blur-md border border-white/20">
                      <span className="font-bold text-white text-sm tracking-wide">
                        {category.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 text-center flex flex-col justify-center h-20">
                    <p className="text-muted-foreground text-xs font-medium mb-1.5">
                      {category.count} товаров
                    </p>
                    <div className="w-8 h-0.5 bg-gradient-emerald mx-auto rounded" />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Секция продуктов */}
        {products.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-emerald rounded-full mb-3">
                  <Icon name="sparkles" size="sm" className="text-white" />
                  <span className="text-white text-xs font-bold tracking-wider uppercase">
                    КОЛЛЕКЦИЯ
                  </span>
                </div>
                <h2 className="text-foreground text-4xl font-extrabold mb-2 tracking-tight">
                  Премиальные товары
                </h2>
                <p className="text-muted-foreground text-lg font-normal">
                  Самые востребованные позиции сезона
                </p>
              </div>
              <Button 
                variant="gradient"
                onClick={() => window.location.href = '/catalog'}
                className="bg-gradient-button font-semibold shadow-emerald"
              >
                Смотреть все
                <Icon name="arrow-right" size="sm" />
              </Button>
            </div>

            <div className="products-grid-compact w-full">
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
        <section className="mt-18 p-12 bg-gradient-surface dark:bg-gradient-surface-dark rounded-3xl text-center relative overflow-hidden border border-border">
          {/* Декоративные элементы */}
          <div className="animate-float absolute -top-25 -right-25 w-75 h-75 bg-gradient-emerald rounded-full opacity-10 filter blur-3xl" />
          <div className="animate-float absolute -bottom-12 -left-12 w-50 h-50 bg-gradient-emerald rounded-full opacity-8 filter blur-2xl delay-[3s]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-emerald rounded-full mb-6">
              <Icon name="gem" size="sm" className="text-white" />
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                ЭКСКЛЮЗИВ
              </span>
            </div>
            
            <h3 className="text-foreground text-5xl font-extrabold mb-4 tracking-tight">
              Станьте частью сообщества
            </h3>
            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Получайте эксклюзивные предложения, первыми узнавайте о новых коллекциях 
              и получите скидку 15% на первый заказ
            </p>
            
            <div className="flex gap-4 max-w-lg mx-auto flex-wrap justify-center">
              <input
                type="email"
                placeholder="Ваш email адрес"
                className="flex-1 min-w-[280px] px-6 py-4 text-base font-medium bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              />
              <Button 
                variant="gradient" 
                size="lg"
                className="bg-gradient-button font-semibold px-8 py-4 rounded-2xl shadow-emerald"
              >
                Подписаться
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-8 flex justify-center items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Бесплатная доставка от 5000₽
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Гарантия качества
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Возврат 30 дней
              </div>
            </div>
          </div>
        </section>

        {/* Секция статистики */}
        <section className="mt-15 py-10 border-t border-b border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-emerald-600 text-4xl font-extrabold mb-2">
                10K+
              </div>
              <p className="text-muted-foreground text-base font-medium">
                Довольных клиентов
              </p>
            </div>
            <div>
              <div className="text-emerald-600 text-4xl font-extrabold mb-2">
                500+
              </div>
              <p className="text-muted-foreground text-base font-medium">
                Брендов в каталоге
              </p>
            </div>
            <div>
              <div className="text-emerald-600 text-4xl font-extrabold mb-2">
                98%
              </div>
              <p className="text-muted-foreground text-base font-medium">
                Положительных отзывов
              </p>
            </div>
            <div>
              <div className="text-emerald-600 text-4xl font-extrabold mb-2">
                24/7
              </div>
              <p className="text-muted-foreground text-base font-medium">
                Поддержка клиентов
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}