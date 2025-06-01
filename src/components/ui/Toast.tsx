'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Иконки
const CheckCircleIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const InformationCircleIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export function Toast({ id, type, title, message, action, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300); // Время анимации исчезновения
  };

  const getToastStyles = () => {
    const baseClasses = cn(
      'relative p-4 rounded-lg shadow-lg border min-w-[300px] max-w-sm transition-all duration-300',
      'transform',
      isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    );

    const typeClasses = {
      success: 'border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
      error: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/50',
      warning: 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/50',
      info: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/50',
    };

    return cn(baseClasses, typeClasses[type]);
  };

  const getIcon = () => {
    const iconClasses = "flex-shrink-0";
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={cn(iconClasses, "text-emerald-500")} />;
      case 'error':
        return <XCircleIcon className={cn(iconClasses, "text-red-500")} />;
      case 'warning':
        return <ExclamationTriangleIcon className={cn(iconClasses, "text-amber-500")} />;
      case 'info':
        return <InformationCircleIcon className={cn(iconClasses, "text-blue-500")} />;
      default:
        return null;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-emerald-800 dark:text-emerald-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-amber-800 dark:text-amber-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-foreground';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return 'text-emerald-700 dark:text-emerald-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'warning':
        return 'text-amber-700 dark:text-amber-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={getToastStyles()}>
      {/* Кнопка закрытия */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
      >
        <XMarkIcon size={16} />
      </button>

      {/* Содержимое */}
      <div className="flex items-start space-x-3 pr-6">
        {/* Иконка */}
        <div className="mt-0.5">
          {getIcon()}
        </div>

        {/* Текст */}
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-semibold", getTitleColor())}>
            {title}
          </h4>
          {message && (
            <p className={cn("text-sm mt-1", getMessageColor())}>
              {message}
            </p>
          )}

          {/* Действие */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "text-sm font-medium mt-2 hover:underline",
                type === 'success' && "text-emerald-600 hover:text-emerald-700",
                type === 'error' && "text-red-600 hover:text-red-700", 
                type === 'warning' && "text-amber-600 hover:text-amber-700",
                type === 'info' && "text-blue-600 hover:text-blue-700"
              )}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}