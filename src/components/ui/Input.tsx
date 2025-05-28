'use client';

import React, { forwardRef } from 'react';
import { useAppTheme } from '@/hooks/useTheme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'search' | 'bordered';
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  variant = 'default',
  helperText,
  className = '',
  disabled,
  ...props
}, ref) => {
  const { colors, isDark } = useAppTheme();

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      padding: icon ? '0.75rem 0.75rem 0.75rem 2.5rem' : '0.75rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s ease',
      backgroundColor: colors.card,
      color: colors.text,
    };

    switch (variant) {
      case 'search':
        return {
          ...baseStyles,
          backgroundColor: colors.searchBackground,
          border: '1px solid transparent',
          ':focus': {
            backgroundColor: colors.card,
            borderColor: colors.tint,
            boxShadow: `0 0 0 3px ${colors.tint}20`, // 20% прозрачности
          }
        };
      
      case 'bordered':
        return {
          ...baseStyles,
          border: `1px solid ${colors.border}`,
          ':focus': {
            borderColor: colors.tint,
            boxShadow: `0 0 0 3px ${colors.tint}20`,
          }
        };
      
      default:
        return {
          ...baseStyles,
          border: `1px solid ${colors.border}`,
          ':focus': {
            borderColor: colors.tint,
            outline: 'none',
          }
        };
    }
  };

  const containerStyles = {
    position: 'relative' as const,
    width: '100%',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.text,
  };

  const inputStyles = {
    ...getVariantStyles(),
    ...(disabled && { 
      opacity: 0.6, 
      cursor: 'not-allowed',
      backgroundColor: colors.disabled 
    }),
    ...(error && { 
      borderColor: colors.error,
      ':focus': {
        borderColor: colors.error,
        boxShadow: `0 0 0 3px ${colors.error}20`,
      }
    }),
  };

  const iconStyles = {
    position: 'absolute' as const,
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.placeholder,
    pointerEvents: 'none' as const,
  };

  const errorStyles = {
    marginTop: '0.25rem',
    fontSize: '0.875rem',
    color: colors.error,
  };

  const helperStyles = {
    marginTop: '0.25rem',
    fontSize: '0.875rem',
    color: colors.placeholder,
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label style={labelStyles}>
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={iconStyles}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          disabled={disabled}
          style={inputStyles}
          onFocus={(e) => {
            const focusStyles = getVariantStyles()[':focus'];
            if (focusStyles && !error) {
              Object.assign(e.currentTarget.style, focusStyles);
            } else if (error) {
              e.currentTarget.style.borderColor = colors.error;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.error}20`;
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props}
        />
      </div>
      
      {error && (
        <div style={errorStyles}>
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div style={helperStyles}>
          {helperText}
        </div>
      )}
    </div>
  );
});