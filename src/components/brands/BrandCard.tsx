import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Brand {
  slug: string;
  name: string;
  logo?: string;
  productsCount?: number;
  isPopular?: boolean;
  description?: string;
}

interface BrandCardProps {
  brand: Brand;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function BrandCard({ brand, variant = 'default', className }: BrandCardProps) {
  const cardSizes = {
    default: 'h-32',
    compact: 'h-24',
    featured: 'h-40',
  };

  return (
    <Link href={`/brands/${brand.slug}`}>
      <Card
        variant="elevated"
        hover
        className={cn(
          'relative overflow-hidden cursor-pointer group transition-all duration-300',
          cardSizes[variant],
          className
        )}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
        
        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-center items-center text-center">
          {/* Logo */}
          {brand.logo ? (
            <div className="w-12 h-12 mb-3 relative">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 mb-3 bg-primary/20 rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Brand Name */}
          <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
            {brand.name}
          </h3>

          {/* Products Count */}
          {brand.productsCount && (
            <p className="text-sm text-muted-foreground">
              {brand.productsCount} товаров
            </p>
          )}

          {/* Popular Badge */}
          {brand.isPopular && (
            <Badge 
              variant="default" 
              size="sm" 
              className="absolute top-3 right-3"
            >
              Популярный
            </Badge>
          )}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </Link>
  );
}