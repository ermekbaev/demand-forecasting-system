import React from 'react';
import { CategoryCard } from './CategoryCard';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  count?: number;
  isPopular?: boolean;
}

interface CategoryListProps {
  categories: Category[];
  variant?: 'grid' | 'list';
  className?: string;
}

export function CategoryList({ categories, variant = 'grid', className }: CategoryListProps) {
  const gridClasses = variant === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'space-y-4';

  return (
    <div className={cn(gridClasses, className)}>
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category}
          variant={variant === 'grid' ? 'default' : 'compact'}
        />
      ))}
    </div>
  );
}