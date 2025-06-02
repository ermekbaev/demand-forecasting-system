import React from 'react';
import { Icon, type IconName } from './Icon';
import { cn } from '@/lib/utils';

interface IconSymbolProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function IconSymbol({ 
  name, 
  size = 'md', 
  variant = 'default', 
  className 
}: IconSymbolProps) {
  const variants = {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
  };

  return (
    <Icon 
      name={name} 
      size={size} 
      className={cn(variants[variant], className)} 
    />
  );
}