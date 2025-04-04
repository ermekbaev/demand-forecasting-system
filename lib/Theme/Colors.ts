// Цветовая палитра приложения
export const themeColors = {
    gray: '#E0B4B2',
    lightGray: '#ABAFB5',
    bluishGray: '#677E8A',
    teal: '#622347',
    darkTeal: '#122E34',
    darkest: '#0E1D21',
  };
  
  // Функциональные цвета для использования в интерфейсе
  export const uiColors = {
    primary: themeColors.teal,
    secondary: themeColors.bluishGray,
    background: '#ffffff',
    backgroundDark: '#f5f5f5',
    text: '#333333',
    textLight: '#666666',
    border: '#e0e0e0',
    // Дополнительные функциональные цвета
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: themeColors.bluishGray,
  };
  
  // Настройки цветов для темной темы
  export const darkModeColors = {
    background: themeColors.darkest,
    backgroundLight: themeColors.darkTeal,
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#333333',
  };