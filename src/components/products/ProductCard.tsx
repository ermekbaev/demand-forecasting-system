import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn, formatPrice } from '@/lib/utils'

// Иконки
const HeartIcon = ({ size = 16, className, filled = false }: { size?: number; className?: string; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={className}>
    <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const EyeIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const StarIcon = ({ size = 16, className, filled = false }: { size?: number; className?: string; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const ShoppingBagIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="m16 10a4 4 0 0 1-8 0"/>
  </svg>
);

interface Product {
  slug: string
  Name: string
  brandName: string
  Price: number
  originalPrice?: number
  imageUrl: string
  imageUrls?: string[]
  colors?: string[]
  sizes?: (string | number)[]
  categoryName?: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isSale?: boolean
  isLimited?: boolean
  discount?: number
  inStock?: boolean
  description?: string
}

interface ProductCardProps {
  product: Product
  size?: 'compact' | 'standard' | 'large'
  showQuickActions?: boolean
  showColorOptions?: boolean
  showSizeOptions?: boolean
  onAddToCart?: (product: Product) => void
  onToggleFavorite?: (product: Product, isFavorite: boolean) => void
  onQuickView?: (product: Product) => void
  isFavorite?: boolean
  className?: string
}

export function ProductCard({
  product,
  size = 'standard',
  showQuickActions = true,
  showColorOptions = false,
  showSizeOptions = false,
  onAddToCart,
  onToggleFavorite,
  onQuickView,
  isFavorite = false,
  className,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0])
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const images = product.imageUrls || [product.imageUrl]
  const currentImage = images[currentImageIndex] || product.imageUrl
  
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.Price) / product.originalPrice) * 100)
    : product.discount

  const handleAddToCart = async () => {
    if (!onAddToCart || isAddingToCart) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart(product)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product, !isFavorite)
  }

  const handleQuickView = () => {
    onQuickView?.(product)
  }

  // Размеры карточки
  const cardSizes = {
    compact: 'w-full max-w-[240px]',
    standard: 'w-full max-w-[280px]',
    large: 'w-full max-w-[320px]'
  }

  const imageSizes = {
    compact: 'aspect-square',
    standard: 'aspect-[4/5]',
    large: 'aspect-[3/4]'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(cardSizes[size], className)}
    >
      <Card
        variant="elevated"
        padding="none"
        hover
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group h-full overflow-hidden relative"
      >
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-muted', imageSizes[size])}>
          <Image
            src={currentImage}
            alt={product.Name}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentImageIndex 
                      ? "bg-white scale-125" 
                      : "bg-white/60 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="premium" size="sm" className="bg-emerald-500 text-white">
                Новинка
              </Badge>
            )}
            {product.isSale && discountPercent && (
              //@ts-ignore
              <Badge variant="destructive" size="sm">
                -{discountPercent}%
              </Badge>
            )}
            {product.isLimited && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" size="sm">
                Limited
              </Badge>
            )}
            {product.inStock === false && (
              <Badge variant="secondary" size="sm">
                Нет в наличии
              </Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          {showQuickActions && (
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Favorite Button */}
              <Button
                size="icon-sm"
                variant={isFavorite ? "default" : "secondary"}
                onClick={handleToggleFavorite}
                className={cn(
                  "rounded-full shadow-lg backdrop-blur-sm",
                  isFavorite 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-white/90 hover:bg-white text-foreground"
                )}
              >
                <HeartIcon size={14} filled={isFavorite} />
              </Button>
              
              {/* Quick View Button */}
              <Button
                size="icon-sm"
                variant="secondary"
                onClick={handleQuickView}
                className="rounded-full shadow-lg bg-white/90 hover:bg-white text-foreground backdrop-blur-sm"
              >
                <EyeIcon size={14} />
              </Button>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/20 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand and Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" size="sm" className="text-xs">
              {product.brandName}
            </Badge>
            {product.categoryName && (
              <span className="text-xs text-muted-foreground">
                {product.categoryName}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <Link 
            href={`/products/${product.slug}`}
            className="block group-link"
          >
            <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors leading-tight">
              {product.Name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={12}
                    filled={i < Math.floor(product.rating!)}
                    className={cn(
                      i < Math.floor(product.rating!)
                        ? "text-amber-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)}
              </span>
              {product.reviewCount && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
          
          {/* Colors */}
          {showColorOptions && product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Цвета:
              </p>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all",
                      selectedColor === color 
                        ? "border-primary scale-110" 
                        : "border-border hover:border-muted-foreground"
                    )}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Sizes */}
          {showSizeOptions && product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Размеры:
              </p>
              <div className="flex gap-1 flex-wrap">
                {product.sizes.slice(0, 6).map((size, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="h-6 px-2 text-xs"
                  >
                    {size}
                  </Button>
                ))}
                {product.sizes.length > 6 && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    +{product.sizes.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(product.Price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              loading={isAddingToCart}
              disabled={product.inStock === false}
              className="min-w-[100px]"
              leftIcon={<ShoppingBagIcon size={12} />}
            >
              {product.inStock === false ? 'Нет в наличии' : 'В корзину'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}