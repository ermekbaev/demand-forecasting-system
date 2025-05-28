'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Возможные значения темы
type ThemeType = 'light' | 'dark' | 'system';

// Интерфейс контекста темы
interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark'; // Актуальная применяемая тема
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

// Создаем контекст
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Провайдер темы
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Получаем системную тему устройства
  const [deviceTheme, setDeviceTheme] = useState<'light' | 'dark'>('light');
  
  // Состояние выбранной темы
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // Актуальная применяемая тема (светлая или темная)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Отслеживаем системную тему
  useEffect(() => {
    // Проверяем поддержку медиа-запросов
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Устанавливаем начальное значение
      setDeviceTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Слушаем изменения системной темы
      const handleChange = (e: MediaQueryListEvent) => {
        setDeviceTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  // Загружаем сохраненную тему при первой загрузке
  useEffect(() => {
    const loadSavedTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    if (typeof window !== 'undefined') {
      loadSavedTheme();
    }
  }, []);

  // Обновляем текущую тему при изменении системной темы или выбранной темы
  useEffect(() => {
    let newTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      // Если выбрана системная тема, используем тему устройства
      newTheme = deviceTheme;
    } else {
      // Иначе используем выбранную пользователем тему
      newTheme = theme;
    }
    
    setCurrentTheme(newTheme);
    
    // Добавляем класс к body для CSS
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  }, [deviceTheme, theme]);

  // Функция для установки темы
  const setTheme = async (newTheme: ThemeType) => {
    try {
      // Сохраняем тему в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Функция для переключения между светлой и темной темой
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Предоставляем контекст
  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования темы
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};