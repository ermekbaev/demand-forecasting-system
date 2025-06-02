import React from 'react';
import { BrandCard } from './BrandCard';
import { cn } from '@/lib/utils';

interface Brand {
  slug: string;
  name: string;
  logo?: string;
  productsCount?: number;
  isPopular?: boolean;
  description?: string;
}

interface BrandGridProps {
  brands: Brand[];
  className?: string;
}

export function BrandGrid({ brands, className }: BrandGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4',
      className
    )}>
      {brands.map((brand) => (
        <BrandCard key={brand.slug} brand={brand} variant="compact" />
      ))}
    </div>
  );
}