import { useTheme } from '@/context/ThemeContext';
import { Colors, ColorNames } from '@/constants/colors';  // Исправлено на Colors с большой буквы

// Типы для хука
export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  cardBackground: string;
  border: string;
  notification: string;
  placeholder: string;
  searchBackground: string;
  disabled: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface UseAppThemeReturn {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  isDark: boolean;
}

/**
 * Хук для получения текущей темы и цветов
 */
export const useAppTheme = (): UseAppThemeReturn => {
  const { currentTheme } = useTheme();
  
  const colors = Colors[currentTheme];
  
  return {
    theme: currentTheme,
    colors,
    isDark: currentTheme === 'dark',
  };
};

/**
 * Хук для получения конкретного цвета темы
 */
export const useAppThemeColor = (
  props: { light?: string; dark?: string },
  colorName: ColorNames
) => {
  const { theme } = useAppTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
};