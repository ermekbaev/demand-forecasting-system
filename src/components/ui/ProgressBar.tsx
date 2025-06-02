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
        {/* Полоса прогресса - используем только Tailwind классы */}
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-300',
            // Динамическая ширина через Tailwind утилиты
            progressValue === 0 && 'w-0',
            progressValue >= 1 && progressValue < 5 && 'w-1',
            progressValue >= 5 && progressValue < 10 && 'w-[5%]',
            progressValue >= 10 && progressValue < 15 && 'w-[10%]',
            progressValue >= 15 && progressValue < 20 && 'w-[15%]',
            progressValue >= 20 && progressValue < 25 && 'w-1/5',
            progressValue >= 25 && progressValue < 30 && 'w-1/4',
            progressValue >= 30 && progressValue < 35 && 'w-[30%]',
            progressValue >= 35 && progressValue < 40 && 'w-[35%]',
            progressValue >= 40 && progressValue < 45 && 'w-2/5',
            progressValue >= 45 && progressValue < 50 && 'w-[45%]',
            progressValue >= 50 && progressValue < 55 && 'w-1/2',
            progressValue >= 55 && progressValue < 60 && 'w-[55%]',
            progressValue >= 60 && progressValue < 65 && 'w-3/5',
            progressValue >= 65 && progressValue < 70 && 'w-[65%]',
            progressValue >= 70 && progressValue < 75 && 'w-[70%]',
            progressValue >= 75 && progressValue < 80 && 'w-3/4',
            progressValue >= 80 && progressValue < 85 && 'w-4/5',
            progressValue >= 85 && progressValue < 90 && 'w-[85%]',
            progressValue >= 90 && progressValue < 95 && 'w-[90%]',
            progressValue >= 95 && progressValue < 100 && 'w-[95%]',
            progressValue === 100 && 'w-full',
            variantClasses[variant]
          )}
        />
      </div>
    </div>
  );
}

// Альтернативная версия с CSS Grid (полностью без style)
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
  
  // Создаем массив из 100 сегментов для Grid прогресс-бара
  const segments = Array.from({ length: 100 }, (_, i) => i < progressValue);

  return (
    <div className={cn(
      'grid grid-cols-100 gap-px w-full bg-border rounded-full overflow-hidden',
      sizeClasses[size],
      className
    )}>
      {segments.map((filled, index) => (
        <div
          key={index}
          className={cn(
            'h-full transition-all duration-75',
            filled ? variantClasses[variant] : 'bg-transparent'
          )}
        />
      ))}
    </div>
  );
}

// Минималистичная версия для простых случаев
export function ProgressBarSimple({
  progress,
  variant = 'default',
}: {
  progress: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}) {
  const progressValue = Math.min(Math.max(progress, 0), 100);
  
  // Простая логика с фиксированными точками
  const getWidthClass = (value: number) => {
    if (value === 0) return 'w-0';
    if (value <= 10) return 'w-[10%]';
    if (value <= 20) return 'w-1/5';
    if (value <= 25) return 'w-1/4';
    if (value <= 30) return 'w-[30%]';
    if (value <= 40) return 'w-2/5';
    if (value <= 50) return 'w-1/2';
    if (value <= 60) return 'w-3/5';
    if (value <= 75) return 'w-3/4';
    if (value <= 80) return 'w-4/5';
    if (value <= 90) return 'w-[90%]';
    return 'w-full';
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  return (
    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
      <div 
        className={cn(
          'h-full rounded-full transition-all duration-300',
          getWidthClass(progressValue),
          variantClasses[variant]
        )}
      />
    </div>
  );
}

// Специальный компонент для прогресса доставки (без style атрибутов)
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
        <div className="text-primary text-base">
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
      
      <ProgressBarSimple 
        progress={progress} 
        variant={progress >= 100 ? 'success' : 'default'}
      />
    </div>
  );
}