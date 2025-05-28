/**
 * Цветовая схема приложения.
 * Определяет цвета для светлой и темной темы.
 */

// Основные цвета для светлой темы
const tintColorLight = '#0a7ea4';
const iconColorLight = '#687076';
const textColorLight = '#11181C';
const backgroundColorLight = '#fff';

// Основные цвета для темной темы
const tintColorDark = '#4eccff';
const iconColorDark = '#9BA1A6';
const textColorDark = '#ECEDEE';
const backgroundColorDark = '#121212';

export const Colors = {
  light: {
    text: textColorLight,
    background: backgroundColorLight,
    tint: tintColorLight,
    icon: iconColorLight,
    tabIconDefault: iconColorLight,
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBackground: '#F5F5F5',
    border: '#E0E0E0',
    notification: '#FF3B30',
    placeholder: '#999999',
    searchBackground: '#F5F5F5',
    disabled: '#CCCCCC',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
  },
  dark: {
    text: textColorDark,
    background: backgroundColorDark,
    tint: tintColorDark,
    icon: iconColorDark,
    tabIconDefault: iconColorDark,
    tabIconSelected: tintColorDark,
    card: '#1E1E1E',
    cardBackground: '#2C2C2C',
    border: '#3D3D3D',
    notification: '#FF453A',
    placeholder: '#666666',
    searchBackground: '#2C2C2C',
    disabled: '#4D4D4D',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
    info: '#0A84FF',
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
  },
};