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

// Премиальные иконки
const HeartIcon = ({ filled = false, size = 20 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
    <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ShoppingBagIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="m16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const StarIcon = ({ filled = false, size = 14 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#10b981" : "none"} stroke="#10b981" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const DiamondIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M6 3h12l4 6-10 12L2 9z"/>
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

  // Размеры карточки
  const getCardDimensions = () => {
    switch (size) {
      case 'compact':
        return { width: '100%', imageHeight: '180px' };
      case 'large':
        return { width: '100%', imageHeight: '280px' };
      default:
        return { width: '100%', imageHeight: '220px' };
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAddToCart?.(product);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  // Премиальные стили
  const cardStyle: CSSProperties = {
    width,
    position: 'relative',
    overflow: 'hidden',
    background: isHovered 
      ? 'var(--gradient-surface)' 
      : 'var(--color-card)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered 
      ? 'var(--shadow-emerald-lg)' 
      : 'var(--shadow-md)',
    borderRadius: '24px',
    border: `1px solid ${isHovered ? 'var(--emerald-200)' : 'var(--color-border)'}`,
  };

  const imageContainerStyle: CSSProperties = {
    position: 'relative',
    height: imageHeight,
    overflow: 'hidden',
    borderRadius: '20px 20px 0 0',
    background: 'linear-gradient(135deg, var(--slate-50) 0%, var(--slate-100) 100%)',
  };

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    display: imageLoading ? 'none' : 'block',
  };

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#ffffff',
    zIndex: 3,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    letterSpacing: '0.5px',
  };

  const quickActionsStyle: CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.8)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 3,
  };

  const actionButtonStyle: CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    //@ts-ignore
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const priceStyle: CSSProperties = {
    background: 'var(--gradient-emerald)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: size === 'compact' ? '20px' : '22px',
    fontWeight: '800',
    letterSpacing: '-0.01em',
  };

  return (
    <Card
      variant="elevated"
      hover={false}
      padding="none"
      className={`premium-card ${className}`}
      style={cardStyle}
      //@ts-ignore
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Изображение товара */}
      <div style={imageContainerStyle}>
        {/* Overlay градиент */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 95, 70, 0.2) 100%)'
            : 'transparent',
          transition: 'all 0.4s ease',
          zIndex: 2,
        }} />

        {imageLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-surface)',
          }}>
            <div
              className="animate-spin rounded-full h-10 w-10 border-3"
              style={{ 
                background: 'var(--gradient-emerald)',
                WebkitMask: 'radial-gradient(circle at center, transparent 60%, black 61%)',
                mask: 'radial-gradient(circle at center, transparent 60%, black 61%)',
              }}
            />
          </div>
        )}
        
        <img
          src={product.imageUrl}
          alt={product.Name}
          style={imageStyle}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false);
            e.currentTarget.src = 'https://placehold.co/320x260/e5e7eb/64748b?text=Нет+фото';
          }}
        />

        {/* Премиальные бейджи */}
        {product.isNew && (
          <div style={{
            ...badgeStyle,
            background: 'linear-gradient(135deg, var(--emerald-500), var(--emerald-600))',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <DiamondIcon size={10} />
            NEW
          </div>
        )}
        
        {product.isSale && getDiscountPercent() > 0 && (
          <div style={{
            ...badgeStyle,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            top: product.isNew ? '60px' : '16px',
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
                color: isFavorite ? '#ef4444' : '#64748b',
                background: isFavorite ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.95)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.boxShadow = isFavorite 
                  ? '0 12px 30px rgba(239, 68, 68, 0.4)'
                  : '0 12px 30px rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <HeartIcon filled={isFavorite} size={20} />
            </button>

            <button
              onClick={handleQuickView}
              style={{
                ...actionButtonStyle,
                color: '#64748b',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.color = 'var(--emerald-600)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <EyeIcon size={20} />
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
          marginBottom: '10px',
        }}>
          <div style={{
            padding: '4px 12px',
            background: 'var(--gradient-emerald)',
            borderRadius: '20px',
            display: 'inline-block',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}>
              {product.brandName}
            </span>
          </div>
          
          {product.rating && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 8px',
              background: 'var(--color-card-background)',
              borderRadius: '12px',
            }}>
              <StarIcon filled />
              <span style={{ 
                fontSize: '12px', 
                color: 'var(--color-text)',
                fontWeight: '600',
              }}>
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Название товара */}
        <h3 style={{
          fontSize: size === 'compact' ? '16px' : '18px',
          fontWeight: '700',
          color: 'var(--color-text)',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          letterSpacing: '-0.01em',
        }}>
          {product.Name}
        </h3>

        {/* Категория */}
        {product.categoryName && (
          <p style={{
            fontSize: '13px',
            color: 'var(--color-placeholder)',
            marginBottom: '16px',
            fontWeight: '500',
          }}>
            {product.categoryName}
          </p>
        )}

        {/* Цвета и размеры с улучшенным дизайном */}
        {(product.colors || product.sizes) && (
          <div style={{ marginBottom: '16px' }}>
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ 
                    fontSize: '11px', 
                    color: 'var(--color-placeholder)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Цвета:
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {product.colors.slice(0, 3).map((color, index) => (
                      <span 
                        key={index}
                        style={{
                          padding: '2px 8px',
                          background: 'var(--color-card-background)',
                          borderRadius: '12px',
                          fontSize: '10px',
                          color: 'var(--color-text)',
                          fontWeight: '500',
                        }}
                      >
                        {color}
                      </span>
                    ))}
                    {product.colors.length > 3 && (
                      <span style={{ 
                        fontSize: '10px', 
                        color: 'var(--emerald-600)',
                        fontWeight: '600',
                      }}>
                        +{product.colors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ 
                    fontSize: '11px', 
                    color: 'var(--color-placeholder)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Размеры:
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {product.sizes.slice(0, 4).map((size, index) => (
                      <span 
                        key={index}
                        style={{
                          padding: '2px 6px',
                          background: 'var(--color-card-background)',
                          borderRadius: '8px',
                          fontSize: '10px',
                          color: 'var(--color-text)',
                          fontWeight: '600',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}
                      >
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span style={{ 
                        fontSize: '10px', 
                        color: 'var(--emerald-600)',
                        fontWeight: '600',
                      }}>
                        +{product.sizes.length - 4}
                      </span>
                    )}
                  </div>
                </div>
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
                color: 'var(--color-placeholder)',
                textDecoration: 'line-through',
                marginTop: '4px',
                fontWeight: '500',
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
              minWidth: '130px',
              background: isHovered 
                ? 'var(--gradient-button-hover)' 
                : 'var(--gradient-button)',
              borderRadius: '16px',
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '13px',
              boxShadow: isHovered 
                ? 'var(--shadow-emerald)' 
                : 'var(--shadow-md)',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ShoppingBagIcon size={16} />
            {addingToCart ? 'Добавляю...' : 'В корзину'}
          </Button>
        </div>
      </div>

      {/* Декоративный элемент внизу карточки */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '4px',
        background: isHovered 
          ? 'var(--gradient-emerald)' 
          : 'var(--color-border)',
        borderRadius: '2px 2px 0 0',
        transition: 'all 0.3s ease',
      }} />
    </Card>
  );
}