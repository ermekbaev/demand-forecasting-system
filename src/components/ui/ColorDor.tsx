// src/components/ui/ColorDot.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ColorDotProps {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  title?: string;
}

// Предопределенные цвета для безопасности
const SAFE_COLORS = {
  'черный': 'bg-black',
  'белый': 'bg-white border-gray-300',
  'красный': 'bg-red-500',
  'синий': 'bg-blue-500',
  'зеленый': 'bg-green-500',
  'желтый': 'bg-yellow-500',
  'серый': 'bg-gray-500',
  'розовый': 'bg-pink-500',
  'фиолетовый': 'bg-purple-500',
  'оранжевый': 'bg-orange-500',
  'коричневый': 'bg-amber-800',
  'бежевый': 'bg-amber-100',
  'navy': 'bg-navy-900',
  'тёмно-синий': 'bg-blue-900',
  'светло-серый': 'bg-gray-300',
  'тёмно-серый': 'bg-gray-700',
} as const;

export function ColorDot({
  color,
  selected = false,
  onClick,
  size = 'default',
  className,
  title,
}: ColorDotProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  // Получаем безопасный цвет или fallback
  const colorKey = color.toLowerCase() as keyof typeof SAFE_COLORS;
  const safeColorClass = SAFE_COLORS[colorKey] || 'bg-gray-400';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title || color}
      className={cn(
        'rounded-full border-2 transition-all duration-200 cursor-pointer',
        'hover:scale-110 hover:border-border',
        selected && 'border-primary scale-110 ring-2 ring-primary/20',
        !selected && 'border-border',
        safeColorClass,
        sizeClasses[size],
        className
      )}
    />
  );
}

// Компонент для группы цветов
interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  maxVisible?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
  maxVisible = 6,
  size = 'default',
  className,
}: ColorSelectorProps) {
  const visibleColors = colors.slice(0, maxVisible);
  const hiddenCount = Math.max(0, colors.length - maxVisible);

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {visibleColors.map((color, index) => (
        <ColorDot
          key={`${color}-${index}`}
          color={color}
          selected={selectedColor === color}
          onClick={() => onColorSelect?.(color)}
          size={size}
          title={color}
        />
      ))}
      
      {hiddenCount > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}