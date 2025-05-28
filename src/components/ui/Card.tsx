'use client';

import React, { CSSProperties, MouseEvent } from 'react';
import { useAppTheme } from '@/hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
  hover?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void; // ✅ Исправлена типизация
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: CSSProperties; // ✅ Добавлено для внешних стилей
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  onClick,
  padding = 'md',
  style = {}, // ✅ Добавлено значение по умолчанию
}: CardProps) {
  const { colors, isDark } = useAppTheme();

  const getPaddingStyles = (): CSSProperties => { // ✅ Добавлена типизация
    switch (padding) {
      case 'none':
        return { padding: '0' };
      case 'sm':
        return { padding: '0.75rem' };
      case 'lg':
        return { padding: '2rem' };
      default: // md
        return { padding: '1.5rem' };
    }
  };

  const getVariantStyles = (): CSSProperties => { // ✅ Исправлена типизация
    const baseStyles: CSSProperties = {
      borderRadius: '0.75rem',
      transition: 'all 0.3s ease',
      cursor: onClick ? 'pointer' : 'default',
      ...getPaddingStyles(),
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: colors.card,
          boxShadow: isDark 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.border}`,
        };
      
      case 'bordered':
        return {
          ...baseStyles,
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
        };
      
      case 'gradient':
        return {
          ...baseStyles,
          background: 'var(--gradient-card)',
          border: `1px solid var(--green-200)`,
        };
      
      default: // default
        return {
          ...baseStyles,
          backgroundColor: colors.card,
          boxShadow: isDark 
            ? '0 1px 3px rgba(0, 0, 0, 0.2)' 
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        };
    }
  };

  // ✅ Исправленные обработчики hover эффектов
  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (!hover) return;

    switch (variant) {
      case 'elevated':
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = isDark 
          ? '0 8px 25px rgba(0, 0, 0, 0.4)' 
          : '0 8px 25px rgba(0, 0, 0, 0.15)';
        break;
      case 'bordered':
        e.currentTarget.style.borderColor = colors.tint;
        e.currentTarget.style.boxShadow = `0 0 0 1px ${colors.tint}20`;
        break;
      case 'gradient':
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${colors.tint}30`;
        break;
      default:
        e.currentTarget.style.boxShadow = isDark 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.15)';
        break;
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!hover) return;
    
    // Возвращаем исходные стили
    const originalStyles = getVariantStyles();
    Object.assign(e.currentTarget.style, originalStyles);
  };

  // ✅ Объединяем все стили
  const finalStyles: CSSProperties = {
    ...getVariantStyles(),
    ...style, // Внешние стили имеют приоритет
  };

  return (
    <div
      className={`card-component ${className}`}
      style={finalStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// Дополнительные подкомпоненты для структурирования
export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  const headerStyle: CSSProperties = { marginBottom: '1rem' };
  
  return (
    <div className={`card-header ${className}`} style={headerStyle}>
      {children}
    </div>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  const { colors } = useAppTheme();
  
  const footerStyle: CSSProperties = { 
    marginTop: '1rem', 
    paddingTop: '1rem',
    borderTop: `1px solid ${colors.border}` 
  };
  
  return (
    <div 
      className={`card-footer ${className}`} 
      style={footerStyle}
    >
      {children}
    </div>
  );
}