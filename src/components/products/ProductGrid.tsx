import React from 'react';
import { ProductCard } from './ProductCard';
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

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product, isFavorite: boolean) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductGrid({
  products,
  loading = false,
  className,
  variant = 'default',
  onAddToCart,
  onToggleFavorite,
  onQuickView,
}: ProductGridProps) {
  const gridClasses = {
    default: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6',
    compact: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
    large: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
  };

  if (loading) {
    return (
      <div className={cn(gridClasses[variant], className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted rounded-xl aspect-[4/5] mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-6 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Товары не найдены
        </h3>
        <p className="text-muted-foreground">
          Попробуйте изменить параметры поиска
        </p>
      </div>
    );
  }

  return (
    <div className={cn(gridClasses[variant], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          size={variant === 'compact' ? 'compact' : 'standard'}
          showQuickActions
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}