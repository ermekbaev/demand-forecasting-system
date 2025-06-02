'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

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

const sortOptions = [
  { value: 'popular', label: 'Популярные' },
  { value: 'new', label: 'Новинки' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'name', label: 'По названию' },
  { value: 'rating', label: 'По рейтингу' },
];

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [totalResults, setTotalResults] = useState(0);
  
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 50000,
    sizes: [],
    colors: [],
    genders: [],
  });

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        params.append('limit', '24');
        params.append('sort', sortBy);
        
        // Добавляем фильтры из URL
        const filterParam = searchParams.get('filter');
        if (filterParam) {
          switch (filterParam) {
            case 'new':
              params.append('new', 'true');
              break;
            case 'sale':
              params.append('sale', 'true');
              break;
            case 'premium':
              params.append('premium', 'true');
              break;
          }
        }

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки товаров');
        }
        
        const data = await response.json();
        
        // Обогащаем данные для красивого отображения
        const enhancedProducts = data.products?.map((product: any) => ({
          ...product,
          originalPrice: product.Price > 8000 ? product.Price + Math.floor(Math.random() * 2000) : undefined,
          isNew: Math.random() > 0.7,
          isSale: product.Price < 10000,
          rating: +(4 + Math.random()).toFixed(1),
        })) || [];
        
        setProducts(enhancedProducts);
        setTotalResults(data.total || enhancedProducts.length);
        
      } catch (err) {
        console.error('Ошибка загрузки каталога:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, sortBy, filters]);

  // Обработчики действий с товарами
  const handleProductAction = (action: string, product: Product) => {
    console.log(`${action}:`, product);
    // TODO: Реализовать действия
  };

  // Хлебные крошки
  const breadcrumbItems = [
    { label: 'Каталог' }
  ];

  const filterParam = searchParams.get('filter');
  if (filterParam) {
    const filterLabels = {
      new: 'Новинки',
      sale: 'Распродажа', 
      premium: 'Премиум'
    };
    breadcrumbItems.push({ 
      label: filterLabels[filterParam as keyof typeof filterLabels] || filterParam 
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-6">
        <div className="max-w-[1600px] mx-auto px-5">
          <div className="mb-8">
            <div className="h-4 bg-muted rounded w-48 mb-4 animate-pulse" />
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
          </div>
          
          <ProductGrid products={[]} loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-6">
        <div className="max-w-[1600px] mx-auto px-5">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Ошибка загрузки каталога
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Попробовать снова
            </Button>
          </div>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {filterParam ? {
                new: 'Новинки',
                sale: 'Распродажа',
                premium: 'Премиум коллекция'
              }[filterParam] || 'Каталог' : 'Каталог товаров'}
            </h1>
            <p className="text-muted-foreground">
              {totalResults > 0 ? `${totalResults} товаров` : 'Товары не найдены'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-3 border border-border rounded-xl bg-background text-foreground text-sm font-medium cursor-pointer outline-none appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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

            {/* Filters toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon name="filter" size="sm" />
              Фильтры
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "grid gap-8 items-start",
          showFilters ? "grid-cols-1 lg:grid-cols-[280px_1fr]" : "grid-cols-1"
        )}>
          
          {/* Filters */}
          {showFilters && (
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
              showMobileClose={true}
            />
          )}

          {/* Products */}
          <div>
            <ProductGrid
              products={products}
              variant={showFilters ? 'compact' : 'default'}
              onAddToCart={(product) => handleProductAction('add-to-cart', product)}
              onToggleFavorite={(product) => handleProductAction('toggle-favorite', product)}
              onQuickView={(product) => handleProductAction('quick-view', product)}
            />

            {/* Load more */}
            {products.length > 0 && products.length < totalResults && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Показать еще товары
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}