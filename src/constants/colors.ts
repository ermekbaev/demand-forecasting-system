// src/constants/colors.ts
/**
 * Премиальная цветовая схема с изумрудными акцентами.
 * Более темная и элегантная палитра для современного дизайна.
 */

// Изумрудная палитра
const emeraldColorLight = '#10b981'; // emerald-500
const emeraldColorDark = '#34d399';   // emerald-400
const emeraldAccent = '#065f46';      // emerald-800
const emeraldLight = '#6ee7b7';       // emerald-300

// Темная цветовая схема для светлой темы
const textColorLight = '#0f172a';      // slate-900
const backgroundColorLight = '#f8fafc'; // slate-50
const cardColorLight = '#ffffff';
const borderColorLight = '#e2e8f0';    // slate-200

// Темная тема
const textColorDark = '#f1f5f9';       // slate-100
const backgroundColorDark = '#0f172a';  // slate-900
const cardColorDark = '#1e293b';        // slate-800
const borderColorDark = '#334155';      // slate-700

export const Colors = {
  light: {
    // Основные цвета
    text: textColorLight,
    background: backgroundColorLight,
    tint: emeraldColorLight,
    icon: '#64748b',              // slate-500
    tabIconDefault: '#94a3b8',    // slate-400
    tabIconSelected: emeraldColorLight,
    
    // Поверхности
    card: cardColorLight,
    cardBackground: '#f1f5f9',    // slate-100
    border: borderColorLight,
    
    // Интерактивные элементы
    notification: '#ef4444',      // red-500
    placeholder: '#64748b',       // slate-500
    searchBackground: '#f1f5f9',  // slate-100
    disabled: '#cbd5e1',          // slate-300
    
    // Статусы
    error: '#dc2626',             // red-600
    success: emeraldColorLight,
    warning: '#d97706',           // amber-600
    info: '#0284c7',              // sky-600
    
    // Дополнительные изумрудные тона
    emeraldPrimary: emeraldColorLight,
    emeraldSecondary: '#059669',  // emerald-600
    emeraldAccent: emeraldAccent,
    emeraldLight: emeraldLight,
    emeraldDark: '#064e3b',       // emerald-900
  },
  dark: {
    // Основные цвета
    text: textColorDark,
    background: backgroundColorDark,
    tint: emeraldColorDark,
    icon: '#94a3b8',              // slate-400
    tabIconDefault: '#64748b',    // slate-500
    tabIconSelected: emeraldColorDark,
    
    // Поверхности
    card: cardColorDark,
    cardBackground: '#334155',    // slate-700
    border: borderColorDark,
    
    // Интерактивные элементы
    notification: '#f87171',      // red-400
    placeholder: '#94a3b8',       // slate-400
    searchBackground: '#334155',  // slate-700
    disabled: '#475569',          // slate-600
    
    // Статусы
    error: '#ef4444',             // red-500
    success: emeraldColorDark,
    warning: '#f59e0b',           // amber-500
    info: '#06b6d4',              // cyan-500
    
    // Дополнительные изумрудные тона
    emeraldPrimary: emeraldColorDark,
    emeraldSecondary: '#10b981',  // emerald-500
    emeraldAccent: '#6ee7b7',     // emerald-300
    emeraldLight: '#a7f3d0',      // emerald-200
    emeraldDark: '#022c22',       // emerald-950
  },
};

// Типы для цветовой схемы
export type ColorScheme = keyof typeof Colors;
export type ColorNames = keyof typeof Colors.light & keyof typeof Colors.dark;

// CSS переменные для использования в стилях
export const cssVariables = {
  light: {
    '--color-text': Colors.light.text,
    '--color-background': Colors.light.background,
    '--color-tint': Colors.light.tint,
    '--color-icon': Colors.light.icon,
    '--color-card': Colors.light.card,
    '--color-card-background': Colors.light.cardBackground,
    '--color-border': Colors.light.border,
    '--color-notification': Colors.light.notification,
    '--color-placeholder': Colors.light.placeholder,
    '--color-search-background': Colors.light.searchBackground,
    '--color-disabled': Colors.light.disabled,
    '--color-error': Colors.light.error,
    '--color-success': Colors.light.success,
    '--color-warning': Colors.light.warning,
    '--color-info': Colors.light.info,
    
    // Изумрудные градиенты и цвета
    '--emerald-primary': Colors.light.emeraldPrimary,
    '--emerald-secondary': Colors.light.emeraldSecondary,
    '--emerald-accent': Colors.light.emeraldAccent,
    '--emerald-light': Colors.light.emeraldLight,
    '--emerald-dark': Colors.light.emeraldDark,
    
    // Градиенты
    '--gradient-primary': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    '--gradient-hero': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #065f46 100%)',
    '--gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    '--gradient-emerald': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    '--gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    '--gradient-button': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    '--gradient-button-hover': 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
  },
  dark: {
    '--color-text': Colors.dark.text,
    '--color-background': Colors.dark.background,
    '--color-tint': Colors.dark.tint,
    '--color-icon': Colors.dark.icon,
    '--color-card': Colors.dark.card,
    '--color-card-background': Colors.dark.cardBackground,
    '--color-border': Colors.dark.border,
    '--color-notification': Colors.dark.notification,
    '--color-placeholder': Colors.dark.placeholder,
    '--color-search-background': Colors.dark.searchBackground,
    '--color-disabled': Colors.dark.disabled,
    '--color-error': Colors.dark.error,
    '--color-success': Colors.dark.success,
    '--color-warning': Colors.dark.warning,
    '--color-info': Colors.dark.info,
    
    // Изумрудные градиенты и цвета
    '--emerald-primary': Colors.dark.emeraldPrimary,
    '--emerald-secondary': Colors.dark.emeraldSecondary,
    '--emerald-accent': Colors.dark.emeraldAccent,
    '--emerald-light': Colors.dark.emeraldLight,
    '--emerald-dark': Colors.dark.emeraldDark,
    
    // Градиенты для темной темы
    '--gradient-primary': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '--gradient-hero': 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)',
    '--gradient-card': 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
    '--gradient-emerald': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '--gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    '--gradient-button': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '--gradient-button-hover': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
  },
};