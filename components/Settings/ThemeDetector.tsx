import React, { useEffect } from 'react';
import { useSettings } from '@/Context/SettingsContext';

/**
 * Компонент для отслеживания системных предпочтений темы
 * и применения соответствующих настроек
 */
const ThemeDetector: React.FC = () => {
  const { appearanceSettings, applyTheme } = useSettings();

  useEffect(() => {
    // Первоначальное применение темы
    applyTheme(appearanceSettings.theme);
    
    // Отслеживание изменений системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Применяем системную тему только если выбрана опция "system"
      if (appearanceSettings.theme === 'system') {
        applyTheme('system');
      }
    };
    
    // Добавляем слушатель событий
    mediaQuery.addEventListener('change', handleChange);
    
    // Очистка при размонтировании
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [appearanceSettings.theme, applyTheme]);

  // Компонент ничего не рендерит
  return null;
};

export default ThemeDetector;