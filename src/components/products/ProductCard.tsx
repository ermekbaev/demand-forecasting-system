'use client';

import React, { useState, CSSProperties, MouseEvent } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Типы для продукта
interface Product {
  slug: string;
  Name: string;
  brandName: string;
  Price: number;
  originalPrice?: number;
  imageUrl: string;
  categoryName?: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  colors?: string[];
  sizes?: (string | number)[];
  genders?: string[]
}

interface ProductCardProps {
  product: Product;
  size?: 'compact' | 'standard' | 'large';
  showQuickActions?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
}

// Иконки
const HeartIcon = ({ filled = false, size = 20 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ShoppingCartIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const StarIcon = ({ filled = false, size = 14 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#22c55e" : "none"} stroke="#22c55e" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

export function ProductCard({
  product,
  size = 'standard',
  showQuickActions = true,
  onAddToCart,
  onToggleFavorite,
  onQuickView,
  className = '',
}: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  console.log(product);
  

  // Размеры карточки
  const getCardDimensions = () => {
    switch (size) {
      case 'compact':
        return { width: '240px', imageHeight: '180px' };
      case 'large':
        return { width: '350px', imageHeight: '280px' };
      default:
        return { width: '300px', imageHeight: '240px' };
    }
  };

  const { width, imageHeight } = getCardDimensions();

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Расчет скидки
  const getDiscountPercent = () => {
    if (!product.originalPrice || product.originalPrice <= product.Price) return 0;
    return Math.round(((product.originalPrice - product.Price) / product.originalPrice) * 100);
  };

  // Обработчики
  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(product);
  };

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Имитация API
      onAddToCart?.(product);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  // Стили
  const cardStyle: CSSProperties = {
    width,
    position: 'relative',
    overflow: 'hidden',
    background: isHovered 
      ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' 
      : '#ffffff',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(34, 197, 94, 0.15)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const imageContainerStyle: CSSProperties = {
    position: 'relative',
    height: imageHeight,
    overflow: 'hidden',
    borderRadius: '12px 12px 0 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  };

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    display: imageLoading ? 'none' : 'block',
  };

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
    zIndex: 2,
  };

  const quickActionsStyle: CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateX(0)' : 'translateX(20px)',
    transition: 'all 0.3s ease',
  };

  const actionButtonStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const priceStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: size === 'compact' ? '18px' : '20px',
    fontWeight: '700',
  };

  return (
    <Card
      variant="elevated"
      hover={false}
      padding="none"
      className={className}
      style={cardStyle}
      //@ts-ignore
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Изображение товара */}
      <div style={imageContainerStyle}>
        {imageLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div
              className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
              style={{ borderColor: '#22c55e transparent #22c55e #22c55e' }}
            />
          </div>
        )}
        
        <img
          src={product.imageUrl}
          alt={product.Name}
          style={imageStyle}
          onLoad={() => {
            console.log('✅ Изображение загружено:', product.imageUrl);
            setImageLoading(false);
          }}
          onError={(e) => {
            console.error('❌ Ошибка загрузки изображения:', {
              url: product.imageUrl,
              error: e
            });
            setImageLoading(false);
            // Устанавливаем fallback изображение
            e.currentTarget.src = 'https://placehold.co/300x240/e5e7eb/9ca3af?text=Нет+фото';
          }}
        />

        {/* Бейджи */}
        {product.isNew && (
          <div style={{
            ...badgeStyle,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          }}>
            NEW
          </div>
        )}
        
        {product.isSale && getDiscountPercent() > 0 && (
          <div style={{
            ...badgeStyle,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            top: product.isNew ? '50px' : '12px',
          }}>
            -{getDiscountPercent()}%
          </div>
        )}

        {/* Быстрые действия */}
        {showQuickActions && (
          <div style={quickActionsStyle}>
            <button
              onClick={handleFavoriteClick}
              style={{
                ...actionButtonStyle,
                color: isFavorite ? '#ef4444' : '#6b7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = isFavorite ? '#fef2f2' : 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <HeartIcon filled={isFavorite} size={18} />
            </button>

            <button
              onClick={handleQuickView}
              style={{
                ...actionButtonStyle,
                color: '#6b7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.color = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              <EyeIcon size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Информация о товаре */}
      <div style={{ padding: '20px' }}>
        {/* Бренд и рейтинг */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#22c55e',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {product.brandName}
          </span>
          
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon filled />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Название товара */}
        <h3 style={{
          fontSize: size === 'compact' ? '14px' : '16px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.Name}
        </h3>

        {/* Категория */}
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '12px',
        }}>
          {product.categoryName}
        </p>

        {/* Цвета и размеры */}
        {(product.colors || product.sizes) && (
          <div style={{ marginBottom: '16px' }}>
            {product.colors && (
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  Цвета: {product.colors.slice(0, 3).join(', ')}
                  {product.colors.length > 3 && ` +${product.colors.length - 3}`}
                </span>
              </div>
            )}
            {product.sizes && (
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  Размеры: {product.sizes.slice(0, 4).join(', ')}
                  {product.sizes.length > 4 && ` +${product.sizes.length - 4}`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Цена и кнопка */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
        }}>
          <div>
            <div style={priceStyle}>
              {formatPrice(product.Price)}
            </div>
            {product.originalPrice && product.originalPrice > product.Price && (
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
                textDecoration: 'line-through',
                marginTop: '2px',
              }}>
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <Button
            variant="gradient"
            size="sm"
            loading={addingToCart}
            onClick={handleAddToCart}
            style={{
              minWidth: '120px',
              background: isHovered 
                ? 'linear-gradient(135deg, #16a34a, #15803d)' 
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
            }}
          >
            <ShoppingCartIcon size={14} />
            {addingToCart ? 'Добавляю...' : 'В корзину'}
          </Button>
        </div>
      </div>
    </Card>
  );
}