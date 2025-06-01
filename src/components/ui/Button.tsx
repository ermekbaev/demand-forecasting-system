import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Иконка загрузки
const LoaderIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary/50',
        destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-destructive/50',
        outline: 'border border-border bg-background text-foreground shadow-sm hover:bg-muted hover:shadow-md focus:ring-primary/50',
        secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md focus:ring-secondary/50',
        ghost: 'text-foreground hover:bg-muted hover:text-foreground focus:ring-primary/50',
        link: 'text-primary underline-offset-4 hover:underline focus:ring-primary/50',
        premium: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-amber-500/50 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800',
        gradient: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-emerald-500/50 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 px-4 py-2 text-xs',
        lg: 'h-12 px-8 py-4 text-base',
        xl: 'h-14 px-10 py-5 text-lg',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    loadingText = 'Загрузка...',
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Shimmer effect для premium кнопок */}
        {variant === 'premium' && (
          <div className="absolute inset-0 -top-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-700" />
        )}
        
        {loading ? (
          <>
            <LoaderIcon size={16} />
            {loadingText}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }