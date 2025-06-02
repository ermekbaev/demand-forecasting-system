import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function CategoryCard({ category, variant = 'default', className }: CategoryCardProps) {
  const cardSizes = {
    default: 'aspect-[4/3]',
    compact: 'aspect-square',
    featured: 'aspect-[3/2]',
  };

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        variant="elevated"
        hover
        className={cn(
          'relative overflow-hidden cursor-pointer group',
          cardSizes[variant],
          className
        )}
        padding="none"
      >
        {/* Background Image or Gradient */}
        {category.image ? (
          <div className="absolute inset-0">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        )}

        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-end text-white">
          {/* Popular Badge */}
          {category.isPopular && (
            <Badge 
              variant="secondary" 
              size="sm" 
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
            >
              Популярная
            </Badge>
          )}

          {/* Category Info */}
          <div>
            <h3 className="font-bold text-xl mb-2 group-hover:transform group-hover:translate-y-[-4px] transition-transform duration-300">
              {category.name}
            </h3>
            
            {category.count && (
              <p className="text-white/80 text-sm font-medium">
                {category.count} товаров
              </p>
            )}
            
            {category.description && variant === 'featured' && (
              <p className="text-white/70 text-sm mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}