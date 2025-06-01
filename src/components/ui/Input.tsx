'use client';

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon, type IconName } from '@/components/ui/Icon'

const inputVariants = cva(
  'flex w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:focus:border-primary-400',
        error: 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
        success: 'border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
        ghost: 'border-transparent bg-neutral-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-900 dark:focus:bg-neutral-800',
        search: 'border-transparent bg-neutral-50 pl-12 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-neutral-900 dark:focus:bg-neutral-800',
      },
      size: {
        sm: 'h-9 px-3 py-2 text-xs',
        default: 'h-11 px-4 py-3 text-sm',
        lg: 'h-12 px-6 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: IconName
  rightIcon?: IconName
  onLeftIconClick?: () => void
  onRightIconClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type = 'text',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error
    const inputVariant = hasError ? 'error' : variant

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2"
          >
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div 
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400",
                onLeftIconClick && "cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
              onClick={onLeftIconClick}
            >
              <Icon name={leftIcon} size="sm" />
            </div>
          )}
          
          {/* Input */}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant, size }),
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          
          {/* Right Icon */}
          {rightIcon && (
            <div 
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400",
                onRightIconClick && "cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
              onClick={onRightIconClick}
            >
              <Icon name={rightIcon} size="sm" />
            </div>
          )}
        </div>
        
        {/* Helper Text / Error */}
        {(error || helperText) && (
          <p className={cn(
            "mt-2 text-xs",
            hasError ? "text-red-500" : "text-neutral-500 dark:text-neutral-400"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Search Input Component
interface SearchInputProps extends Omit<InputProps, 'variant' | 'leftIcon'> {
  onSearch?: (value: string) => void
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    onSearch, 
    onClear, 
    showClearButton = true,
    placeholder = "Поиск...",
    value,
    onChange,
    ...props 
  }, ref) => {
    const [searchValue, setSearchValue] = React.useState(value || '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchValue(newValue)
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(searchValue)
      }
    }

    const handleClear = () => {
      setSearchValue('')
      onClear?.()
    }

    return (
      <Input
        ref={ref}
        variant="search"
        leftIcon="search"
        rightIcon={showClearButton && searchValue ? "close" : undefined}
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onRightIconClick={showClearButton ? handleClear : undefined}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Password Input Component
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showToggle?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={showToggle ? (showPassword ? 'eye-off' : 'eye') : undefined}
        onRightIconClick={showToggle ? togglePasswordVisibility : undefined}
        {...props}
      />
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// Textarea Component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2"
          >
            {label}
          </label>
        )}
        
        {/* Textarea */}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:border-primary-400',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          ref={ref}
          id={textareaId}
          {...props}
        />
        
        {/* Helper Text / Error */}
        {(error || helperText) && (
          <p className={cn(
            "mt-2 text-xs",
            hasError ? "text-red-500" : "text-neutral-500 dark:text-neutral-400"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { 
  Input, 
  SearchInput, 
  PasswordInput, 
  Textarea, 
  inputVariants,
  type InputProps,
  type SearchInputProps,
  type PasswordInputProps,
  type TextareaProps
}