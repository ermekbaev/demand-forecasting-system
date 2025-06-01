import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/ui/Icon'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
        primary: 'border-primary-200 bg-primary-100 text-primary-800 dark:border-primary-800 dark:bg-primary-900 dark:text-primary-200',
        secondary: 'border-neutral-200 bg-white text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
        success: 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        warning: 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-200',
        error: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200',
        info: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200',
        outline: 'border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800',
        gradient: 'border-transparent bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-md',
        premium: 'border-amber-300 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 shadow-sm dark:from-amber-900 dark:to-amber-800 dark:text-amber-100',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
        xl: 'px-5 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: IconName
  removable?: boolean
  onRemove?: () => void
  count?: number
  dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    icon, 
    removable = false, 
    onRemove, 
    count,
    dot = false,
    children, 
    ...props 
  }, ref) => {
    // Если передан count, показываем число
    const displayContent = count !== undefined ? (count > 99 ? '99+' : count.toString()) : children

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {/* Точка для индикатора */}
        {dot && (
          <div className="w-2 h-2 rounded-full bg-current opacity-60" />
        )}
        
        {/* Иконка слева */}
        {icon && (
          <Icon 
            name={icon} 
            size={size === 'sm' ? 'xs' : size === 'lg' || size === 'xl' ? 'sm' : 'xs'} 
          />
        )}
        
        {/* Контент */}
        {displayContent}
        
        {/* Кнопка удаления */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex-shrink-0 ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors"
          >
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

// Notification Badge Component
interface NotificationBadgeProps extends Omit<BadgeProps, 'children' | 'count'> {
  count: number
  max?: number
  showZero?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  children: React.ReactNode
}

const NotificationBadge = React.forwardRef<HTMLDivElement, NotificationBadgeProps>(
  ({
    count,
    max = 99,
    showZero = false,
    position = 'top-right',
    variant = 'error',
    size = 'sm',
    children,
    className,
    ...props
  }, ref) => {
    const shouldShow = count > 0 || (count === 0 && showZero)
    const displayCount = count > max ? `${max}+` : count.toString()

    const positionClasses = {
      'top-right': '-top-1 -right-1',
      'top-left': '-top-1 -left-1',
      'bottom-right': '-bottom-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
    }

    return (
      <div ref={ref} className="relative inline-flex">
        {children}
        {shouldShow && (
          <Badge
            variant={variant}
            size={size}
            className={cn(
              'absolute z-10 min-w-[1.25rem] h-5 px-1 flex items-center justify-center',
              positionClasses[position],
              className
            )}
            {...props}
          >
            {displayCount}
          </Badge>
        )}
      </div>
    )
  }
)
NotificationBadge.displayName = "NotificationBadge"

// Status Badge Component
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'idle'
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, size = 'sm', className, ...props }, ref) => {
    const statusConfig = {
      online: { variant: 'success' as const, label: 'В сети', dot: true },
      offline: { variant: 'default' as const, label: 'Не в сети', dot: true },
      away: { variant: 'warning' as const, label: 'Отошел', dot: true },
      busy: { variant: 'error' as const, label: 'Занят', dot: true },
      idle: { variant: 'info' as const, label: 'Неактивен', dot: true },
    }

    const config = statusConfig[status]

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        size={size}
        dot={config.dot}
        className={className}
        {...props}
      >
        {config.label}
      </Badge>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

// Category Badge Component
interface CategoryBadgeProps extends BadgeProps {
  category: string
  color?: string
}

const CategoryBadge = React.forwardRef<HTMLDivElement, CategoryBadgeProps>(
  ({ category, color, style, ...props }, ref) => {
    const badgeStyle = color 
      ? {
          backgroundColor: `${color}20`,
          borderColor: `${color}40`,
          color: color,
          ...style
        }
      : style

    return (
      <Badge
        ref={ref}
        variant="outline"
        style={badgeStyle}
        {...props}
      >
        {category}
      </Badge>
    )
  }
)
CategoryBadge.displayName = "CategoryBadge"

export { 
  Badge, 
  NotificationBadge, 
  StatusBadge, 
  CategoryBadge, 
  badgeVariants,
  type BadgeProps,
  type NotificationBadgeProps,
  type StatusBadgeProps,
  type CategoryBadgeProps
}