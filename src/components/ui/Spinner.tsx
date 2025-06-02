import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        default: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
      },
      variant: {
        default: 'text-foreground',
        primary: 'text-primary',
        secondary: 'text-muted-foreground',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ 
  className, 
  size, 
  variant, 
  label = 'Загрузка...', 
  ...props 
}: SpinnerProps) {
  return (
    <div 
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <div
        className={cn(spinnerVariants({ size, variant }))}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Компонент для полноэкранного лоадера
export function FullScreenSpinner({ 
  label = 'Загрузка...', 
  className 
}: { 
  label?: string; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="text-center">
        <Spinner size="xl" variant="primary" className="mb-4" />
        <p className="text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}