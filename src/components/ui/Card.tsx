import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg',
        elevated: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl hover:shadow-2xl hover:-translate-y-1',
        outlined: 'bg-transparent border-2 border-neutral-200 dark:border-neutral-700',
        ghost: 'bg-transparent',
        premium: 'bg-gradient-card dark:bg-gradient-dark-card border border-neutral-200 dark:border-neutral-700 shadow-premium hover:shadow-xl hover:-translate-y-1',
        glass: 'glass dark:glass-dark shadow-glass',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding }),
          hover && 'hover:shadow-xl hover:-translate-y-1 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight text-neutral-900 dark:text-neutral-100",
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-700", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Специальный компонент для карточек товаров
const ProductCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    aspectRatio?: 'square' | 'portrait' | 'landscape'
    imageSlot?: React.ReactNode
    badgeSlot?: React.ReactNode
    actionSlot?: React.ReactNode
  }
>(({ 
  className, 
  variant = 'elevated', 
  padding = 'none',
  aspectRatio = 'portrait',
  imageSlot,
  badgeSlot,
  actionSlot,
  children,
  ...props 
}, ref) => {
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }

  return (
    <Card
      ref={ref}
      variant={variant}
      padding={padding}
      className={cn(
        'group overflow-hidden relative',
        className
      )}
      {...props}
    >
      {/* Image Container */}
      {imageSlot && (
        <div className={cn('relative overflow-hidden bg-neutral-100 dark:bg-neutral-800', aspectClasses[aspectRatio])}>
          {imageSlot}
          
          {/* Badge Overlay */}
          {badgeSlot && (
            <div className="absolute top-3 left-3 z-10">
              {badgeSlot}
            </div>
          )}
          
          {/* Action Overlay */}
          {actionSlot && (
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {actionSlot}
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </Card>
  )
})
ProductCard.displayName = "ProductCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  ProductCard,
  cardVariants
}