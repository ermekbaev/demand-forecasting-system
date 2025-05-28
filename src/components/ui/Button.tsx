'use client';

import React, { CSSProperties, MouseEvent } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  style = {},
}: ButtonProps) {

  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--gradient-button)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
        };
      
      case 'gradient':
        return {
          background: 'var(--gradient-button)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'var(--shadow-emerald)',
          position: 'relative',
          overflow: 'hidden',
        };
      
      case 'premium':
        return {
          background: 'var(--gradient-emerald)',
          color: '#ffffff',
          border: '1px solid var(--emerald-400)',
          boxShadow: 'var(--shadow-emerald-lg)',
          position: 'relative',
          overflow: 'hidden',
        };
      
      case 'secondary':
        return {
          backgroundColor: 'var(--color-card)',
          color: 'var(--color-text)',
          border: `1px solid var(--color-border)`,
          boxShadow: 'var(--shadow-sm)',
        };
      
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--emerald-600)',
          border: `1px solid var(--emerald-500)`,
          boxShadow: 'none',
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
          border: 'none',
          boxShadow: 'none',
        };
      
      default:
        return {};
    }
  };

  const getSizeStyles = (): CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: '13px',
          borderRadius: '12px',
          fontWeight: '600',
        };
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: '16px',
          borderRadius: '16px',
          fontWeight: '700',
        };
      case 'xl':
        return {
          padding: '20px 40px',
          fontSize: '18px',
          borderRadius: '20px',
          fontWeight: '700',
        };
      default: // md
        return {
          padding: '12px 24px',
          fontSize: '14px',
          borderRadius: '14px',
          fontWeight: '600',
        };
    }
  };

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    outline: 'none',
    position: 'relative',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    switch (variant) {
      case 'primary':
      case 'gradient':
      case 'premium':
        e.currentTarget.style.background = 'var(--gradient-button-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-emerald-lg)';
        break;
      case 'secondary':
        e.currentTarget.style.backgroundColor = 'var(--color-card-background)';
        e.currentTarget.style.borderColor = 'var(--emerald-500)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        break;
      case 'outline':
        e.currentTarget.style.backgroundColor = 'var(--emerald-500)';
        e.currentTarget.style.color = '#ffffff';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-emerald)';
        break;
      case 'ghost':
        e.currentTarget.style.backgroundColor = 'var(--color-card-background)';
        e.currentTarget.style.color = 'var(--emerald-600)';
        break;
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    // Возвращаем исходные стили
    const originalStyles = { ...getSizeStyles(), ...getVariantStyles() };
    Object.assign(e.currentTarget.style, originalStyles);
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const shimmerOverlay = (variant === 'gradient' || variant === 'premium') && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        transition: 'left 0.6s ease',
        pointerEvents: 'none',
      }}
      className="shimmer-overlay"
    />
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`premium-button ${className}`}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
      }}
    >
      {shimmerOverlay}
      
      {loading && (
        <div 
          className="animate-spin rounded-full border-2 border-t-transparent"
          style={{ 
            width: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
            height: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
            borderColor: 'currentColor transparent currentColor currentColor',
          }}
        />
      )}
      
      <span style={{ 
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}>
        {children}
      </span>

      <style jsx>{`
        .premium-button:hover .shimmer-overlay {
          left: 100%;
        }
        
        .premium-button:focus-visible {
          outline: 2px solid var(--emerald-500);
          outline-offset: 2px;
        }
        
        .premium-button:active {
          transform: translateY(0) scale(0.98) !important;
        }
      `}</style>
    </button>
  );
}