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
    gradient: string;
    premium: string;
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

// Объект с Tailwind цветами для прямого использования
export interface TailwindColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  muted: string;
  accent: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  tint: string; // для совместимости со старым кодом
  placeholder: string;
}

export interface UseAppThemeReturn {
  theme: 'light' | 'dark';
  isDark: boolean;
  classes: TailwindThemeClasses;
  colors: TailwindColors;
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
      gradient: 'bg-gradient-emerald hover:opacity-90 text-white shadow-emerald',
      premium: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-premium',
    },
    input: 'bg-background border-input focus:border-primary focus:ring-ring/20',
    badge: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };

  // Цвета для прямого использования
  const colors: TailwindColors = {
    background: currentTheme === 'dark' ? '#0f172a' : '#ffffff',
    foreground: currentTheme === 'dark' ? '#f1f5f9' : '#0f172a',
    primary: currentTheme === 'dark' ? '#34d399' : '#10b981',
    secondary: currentTheme === 'dark' ? '#1e293b' : '#f1f5f9',
    muted: currentTheme === 'dark' ? '#334155' : '#f1f5f9',
    accent: currentTheme === 'dark' ? '#334155' : '#f1f5f9',
    destructive: currentTheme === 'dark' ? '#ef4444' : '#dc2626',
    border: currentTheme === 'dark' ? '#334155' : '#e2e8f0',
    input: currentTheme === 'dark' ? '#334155' : '#e2e8f0',
    ring: currentTheme === 'dark' ? '#34d399' : '#10b981',
    card: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
    success: currentTheme === 'dark' ? '#34d399' : '#10b981',
    warning: currentTheme === 'dark' ? '#f59e0b' : '#d97706',
    error: currentTheme === 'dark' ? '#ef4444' : '#dc2626',
    info: currentTheme === 'dark' ? '#06b6d4' : '#0284c7',
    tint: currentTheme === 'dark' ? '#34d399' : '#10b981', // для совместимости
    placeholder: currentTheme === 'dark' ? '#94a3b8' : '#64748b',
  };

  return {
    theme: currentTheme,
    isDark: currentTheme === 'dark',
    classes,
    colors,
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

/**
 * Хук для получения цвета темы
 */
export const useThemeColor = (colorName: keyof TailwindColors) => {
  const { colors } = useAppTheme();
  return colors[colorName];
};

// Экспорт дополнительных утилит
export const getResponsiveClass = (base: string, sm?: string, md?: string, lg?: string, xl?: string) => {
  const classes = [base];
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  return classes.join(' ');
};

export const getSpacingClass = (type: 'p' | 'm' | 'px' | 'py' | 'mx' | 'my', size: number) => {
  return `${type}-${size}`;
};

export const getTextClass = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl', weight?: 'normal' | 'medium' | 'semibold' | 'bold') => {
  const classes = [`text-${size}`];
  if (weight) classes.push(`font-${weight}`);
  return classes.join(' ');
};