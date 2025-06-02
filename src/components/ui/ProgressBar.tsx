// src/components/ui/ProgressBar.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  variant = 'default',
  size = 'default',
  className,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3',
  };

  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{label}</span>
          <span>{progressValue}%</span>
        </div>
      )}
      
      {/* Контейнер прогресс-бара */}
      <div className={cn('w-full bg-border rounded-full overflow-hidden', sizeClasses[size])}>
        {/* Полоса прогресса - используем transform для ширины */}
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-300 origin-left',
            variantClasses[variant]
          )}
          style={{ transform: `scaleX(${progressValue / 100})` }}
        />
      </div>
    </div>
  );
}

// Альтернативный подход через CSS Grid (еще чище)
export function ProgressBarGrid({
  progress,
  variant = 'default',
  size = 'default',
  className,
}: Omit<ProgressBarProps, 'showLabel' | 'label'>) {
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3',
  };

  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full bg-border rounded-full overflow-hidden', sizeClasses[size], className)}>
      <div 
        className={cn(
          'h-full rounded-full transition-all duration-300',
          variantClasses[variant]
        )}
        style={{ width: `${progressValue}%` }}
      />
    </div>
  );
}

// Специальный компонент для прогресса доставки
interface ShippingProgressProps {
  current: number;
  target: number;
  className?: string;
}

export function ShippingProgress({ current, target, className }: ShippingProgressProps) {
  const progress = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);
  const formatPrice = (price: number) => `${price.toLocaleString()}₽`;

  return (
    <div className={cn('bg-muted/50 rounded-lg p-4', className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 text-primary">
          🚚
        </div>
        <span className="text-sm font-semibold text-foreground">
          Бесплатная доставка
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        {remaining > 0 
          ? `Добавьте товаров на ${formatPrice(remaining)} для бесплатной доставки`
          : 'Поздравляем! Бесплатная доставка активирована! 🎉'
        }
      </p>
      
      <ProgressBar 
        progress={progress} 
        variant={progress >= 100 ? 'success' : 'default'}
        size="default"
      />
    </div>
  );
}