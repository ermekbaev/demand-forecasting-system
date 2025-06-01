import { useTheme } from '@/context/ThemeContext';

// Типы для Tailwind классов
export interface TailwindThemeClasses {
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  bg: {
    primary: string;
    secondary: string;
    card: string;
    muted: string;
  };
  border: {
    primary: string;
    secondary: string;
    accent: string;
  };
  button: {
    primary: string;
    secondary: string;
    ghost: string;
    destructive: string;
  };
  input: string;
  badge: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface UseAppThemeReturn {
  theme: 'light' | 'dark';
  isDark: boolean;
  classes: TailwindThemeClasses;
  toggleTheme: () => void;
}

/**
 * Хук для получения Tailwind классов в зависимости от темы
 */
export const useAppTheme = (): UseAppThemeReturn => {
  const { currentTheme, toggleTheme } = useTheme();
  
  const classes: TailwindThemeClasses = {
    text: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground', 
      muted: 'text-muted-foreground',
      accent: 'text-primary',
    },
    bg: {
      primary: 'bg-background',
      secondary: 'bg-muted',
      card: 'bg-card',
      muted: 'bg-muted/50',
    },
    border: {
      primary: 'border-border',
      secondary: 'border-muted',
      accent: 'border-primary',
    },
    button: {
      primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
    },
    input: 'bg-background border-input',
    badge: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };

  return {
    theme: currentTheme,
    isDark: currentTheme === 'dark',
    classes,
    toggleTheme,
  };
};

/**
 * Хук для получения конкретного Tailwind класса для элемента
 */
export const useThemeClass = (
  element: keyof TailwindThemeClasses | string,
  variant?: string
) => {
  const { classes } = useAppTheme();
  
  if (typeof element === 'string') {
    return element; // Если передан готовый класс
  }
  
  const elementClasses = classes[element];
  
  if (typeof elementClasses === 'string') {
    return elementClasses;
  }
  
  if (variant && typeof elementClasses === 'object') {
    return elementClasses[variant as keyof typeof elementClasses] || '';
  }
  
  return '';
};