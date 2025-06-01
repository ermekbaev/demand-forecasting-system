import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard as BaseProductCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, NotificationBadge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { cn, formatPrice } from '@/lib/utils'

interface Product {
  slug: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  colors?: string[]
  sizes?: string[]
  category?: string
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
  variant?: 'default' | 'compact' | 'detailed'
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
  variant = 'default',
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

  const images = product.images || [product.image]
  const currentImage = images[currentImageIndex] || product.image
  
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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

  const aspectRatio = variant === 'compact' ? 'square' : 'portrait'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <BaseProductCard
        variant="elevated"
        aspectRatio={aspectRatio}
        hover
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group h-full"
        imageSlot={
          <div className="relative w-full h-full">
            {/* Main Image */}
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                isHovered && "scale-110"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Image Navigation */}
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
            
            {/* Hover Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/20 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )} />
          </div>
        }
        badgeSlot={
          <div className="flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="premium" size="sm" icon="sparkles">
                Новинка
              </Badge>
            )}
            {product.isSale && discountPercent && (
              <Badge variant="error" size="sm">
                -{discountPercent}%
              </Badge>
            )}
            {product.isLimited && (
              <Badge variant="gradient" size="sm" icon="zap">
                Limited
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="outline" size="sm">
                Нет в наличии
              </Badge>
            )}
          </div>
        }
        actionSlot={
          showQuickActions && (
            <div className="flex flex-col gap-2">
              {/* Favorite Button */}
              <Button
                size="icon-sm"
                variant={isFavorite ? "default" : "secondary"}
                onClick={handleToggleFavorite}
                className={cn(
                  "rounded-full shadow-lg backdrop-blur-sm",
                  isFavorite 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-white/90 hover:bg-white text-neutral-700"
                )}
              >
                <Icon 
                  name="heart" 
                  size="sm" 
                  className={isFavorite ? "fill-current" : ""} 
                />
              </Button>
              
              {/* Quick View Button */}
              <Button
                size="icon-sm"
                variant="secondary"
                onClick={handleQuickView}
                className="rounded-full shadow-lg bg-white/90 hover:bg-white text-neutral-700 backdrop-blur-sm"
              >
                <Icon name="eye" size="sm" />
              </Button>
            </div>
          )
        }
      >
        {/* Product Info */}
        <div className="space-y-3">
          {/* Brand and Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" size="sm">
              {product.brand}
            </Badge>
            {product.category && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {product.category}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <Link 
            href={`/products/${product.slug}`}
            className="block"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size="xs"
                    className={cn(
                      i < Math.floor(product.rating!)
                        ? "text-amber-400 fill-current"
                        : "text-neutral-300 dark:text-neutral-600"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {product.rating.toFixed(1)}
              </span>
              {product.reviewCount && (
                <span className="text-xs text-neutral-500 dark:text-neutral-500">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
          
          {/* Colors */}
          {showColorOptions && product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
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
                        ? "border-primary-500 scale-110" 
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Sizes */}
          {showSizeOptions && product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
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
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
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
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              loading={isAddingToCart}
              disabled={!product.inStock}
              className="min-w-[100px]"
              leftIcon={<Icon name="shopping-bag" size="xs" />}
            >
              {!product.inStock ? 'Нет в наличии' : 'В корзину'}
            </Button>
          </div>
        </div>
      </BaseProductCard>
    </motion.div>
  )
}