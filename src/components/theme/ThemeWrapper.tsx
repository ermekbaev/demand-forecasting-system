'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cssVariables } from '@/constants/colors';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  // Применяем CSS переменные к :root
  useEffect(() => {
    const root = document.documentElement;
    const variables = cssVariables[currentTheme];
    
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [currentTheme]);

  return <>{children}</>;
}