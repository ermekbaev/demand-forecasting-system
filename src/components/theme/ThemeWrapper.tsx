'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  // Применяем тему через CSS классы вместо инлайн стилей
  useEffect(() => {
    const root = document.documentElement;
    
    // Удаляем все предыдущие тематические классы
    root.classList.remove('theme-light', 'theme-dark');
    
    // Добавляем класс текущей темы
    root.classList.add(`theme-${currentTheme}`);
    
    // Также обновляем стандартный dark класс для совместимости
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentTheme]);

  return <>{children}</>;
}