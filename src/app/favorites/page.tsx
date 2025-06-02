'use client';

import React, { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка избранного
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        // Загружаем из localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          const favoriteItems = JSON.parse(savedFavorites);
          
          // Здесь можно загрузить полную информацию о товарах по их ID
          // Пока используем моковые данные
          const mockFavorites: Product[] = favoriteItems.slice(0, 6).map((item: any, index: number) => ({
            slug: `favorite-product-${index}`,
            Name: `Избранный товар ${index + 1}`,
            Price: 5000 + Math.floor(Math.random() * 10000),
            imageUrl: 'https://placehold.co/400x500/10b981/ffffff?text=Favorite',
            brandName: ['Nike', 'Adidas', 'New Balance'][Math.floor(Math.random() * 3)],
            colors: ['Черный', 'Белый', 'Серый'],
            sizes: [40, 41, 42, 43, 44],
            categoryName: 'Кроссовки',
            isNew: Math.random() > 0.7,
            isSale: Math.random() > 0.6,
            rating: +(4 + Math.random()).toFixed(1),
          }));
          
          setFavorites(mockFavorites);
        }
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Обработчики действий с товарами
  const handleRemoveFromFavorites = (product: Product) => {
    setFavorites(prev => prev.filter(item => item.slug !== product.slug));
    
    // Обновляем localStorage
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const favoriteItems = JSON.parse(savedFavorites);
        const updatedFavorites = favoriteItems.filter((item: any) => item.id !== product.slug);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        
        // Отправляем событие для обновления счетчиков
        window.dispatchEvent(new Event('favoritesUpdated'));
      }
    } catch (error) {
      console.error('Ошибка обновления избранного:', error);
    }
  };

  const handleProductAction = (action: string, product: Product) => {
    switch (action) {
      case 'add-to-cart':
        console.log('Добавляем в корзину:', product);
        break;
      case 'toggle-favorite':
        handleRemoveFromFavorites(product);
        break;
      case 'quick-view':
        window.location.href = `/products/${product.slug}`;
        break;
    }
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const breadcrumbItems = [
    { label: 'Избранное' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-6">
        <div className="max-w-[1600px] mx-auto px-5">
          <div className="mb-8">
            <div className="h-4 bg-muted rounded w-32 mb-4 animate-pulse" />
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          </div>
          
          <ProductGrid products={[]} loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-[1600px] mx-auto px-5">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Icon name="heart" size="lg" className="text-primary" />
              Избранное
            </h1>
            <p className="text-muted-foreground">
              {favorites.length > 0 ? `${favorites.length} товаров в избранном` : 'Избранных товаров нет'}
            </p>
          </div>

          {/* Clear all */}
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFavorites}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Icon name="trash" size="sm" />
              Очистить все
            </Button>
          )}
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <Card variant="elevated" className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="heart" size="xl" className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Избранных товаров пока нет
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Добавляйте понравившиеся товары в избранное, нажимая на иконку сердечка. 
              Так вы не потеряете их и сможете быстро найти позже.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => window.location.href = '/catalog'}
                variant="default"
                size="lg"
              >
                Перейти в каталог
                <Icon name="arrow-right" size="sm" />
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="lg"
              >
                На главную
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Products Grid */}
            <ProductGrid
              products={favorites}
              onAddToCart={(product) => handleProductAction('add-to-cart', product)}
              onToggleFavorite={(product) => handleProductAction('toggle-favorite', product)}
              onQuickView={(product) => handleProductAction('quick-view', product)}
            />

            {/* Recommendations */}
            <div className="mt-16 pt-16 border-t border-border">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Возможно, вам также понравится
                </h2>
                <p className="text-muted-foreground">
                  Похожие товары на основе ваших предпочтений
                </p>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => window.location.href = '/catalog'}
                  variant="outline"
                  size="lg"
                >
                  Смотреть рекомендации
                  <Icon name="arrow-right" size="sm" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}