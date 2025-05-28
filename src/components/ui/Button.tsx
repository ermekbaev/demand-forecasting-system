'use client';

import React, { CSSProperties, MouseEvent } from 'react';
import { useAppTheme } from '@/hooks/useTheme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void; // ✅ Исправлена типизация
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties; // ✅ Добавлено для передачи внешних стилей
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
  style = {}, // ✅ Добавлено значение по умолчанию
}: ButtonProps) {
  const { colors, isDark } = useAppTheme();

  const getVariantStyles = (): CSSProperties => { // ✅ Добавлена типизация возвращаемого значения
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.tint,
          color: '#ffffff',
          border: 'none',
        };
      
      case 'gradient':
        return {
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          border: 'none',
        };
      
      case 'secondary':
        return {
          backgroundColor: colors.card,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        };
      
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.tint,
          border: `1px solid ${colors.tint}`,
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.text,
          border: 'none',
        };
      
      default:
        return {};
    }
  };

  const getSizeStyles = (): CSSProperties => { // ✅ Добавлена типизация
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          borderRadius: '0.375rem',
        };
      case 'lg':
        return {
          padding: '0.875rem 2rem',
          fontSize: '1.125rem',
          borderRadius: '0.5rem',
        };
      default: // md
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
        };
    }
  };

  // ✅ Убираем проблемные hover стили из объекта
  const baseStyles: CSSProperties = {
    fontWeight: '600',
    transition: 'all 0.2s ease',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style, // ✅ Объединяем с внешними стилями
  };

  // ✅ Отдельные функции для hover эффектов
  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    switch (variant) {
      case 'primary':
        e.currentTarget.style.backgroundColor = 'var(--green-600)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        break;
      case 'gradient':
        e.currentTarget.style.background = 'var(--gradient-button-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.3)';
        break;
      case 'secondary':
        e.currentTarget.style.backgroundColor = colors.cardBackground;
        e.currentTarget.style.borderColor = colors.tint;
        break;
      case 'outline':
        e.currentTarget.style.backgroundColor = colors.tint;
        e.currentTarget.style.color = '#ffffff';
        break;
      case 'ghost':
        e.currentTarget.style.backgroundColor = colors.cardBackground;
        e.currentTarget.style.color = colors.tint;
        break;
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    // Возвращаем исходные стили
    const originalStyles = { ...getSizeStyles(), ...getVariantStyles() };
    Object.assign(e.currentTarget.style, originalStyles);
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`button-component ${className}`}
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && (
        <div 
          className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
          style={{ borderColor: 'currentColor transparent currentColor currentColor' }}
        />
      )}
      {children}
    </button>
  );
}