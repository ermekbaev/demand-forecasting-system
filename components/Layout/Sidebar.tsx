import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { themeColors } from '@/lib/Theme/Colors';
import { useSettings } from '@/Context/SettingsContext';

// Определение типа для элементов навигации
type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  onToggle?: (collapsed: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { appearanceSettings, setAppearanceSettings, applyTheme } = useSettings();
  
  // Функция для переключения темы (вынесена из обработчика события)
  const toggleTheme = () => {
    const newTheme = appearanceSettings.theme === 'dark' ? 'light' : 'dark';
    setAppearanceSettings({ ...appearanceSettings, theme: newTheme });
    applyTheme(newTheme);
  };
  
  // Применяем настройки цвета к сайдбару
  const sidebarStyle = {
    backgroundColor: appearanceSettings.theme === 'dark' 
      ? themeColors.darkest 
      : '#1a202c' // Темный фон даже в светлой теме для сайдбара
  };

  const navItems: NavItem[] = [
    {
      name: 'Дашборд',
      path: '/dashboard',
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
          />
        </svg>
      ),
    },
    {
      name: 'Данные',
      path: '/dashboard/data-management',
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      ),
    },
    {
      name: 'Прогнозирование',
      path: '/dashboard/forecasting',
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" 
          />
        </svg>
      ),
    },
    {
      name: 'Настройки',
      path: '/dashboard/settings',
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      ),
    },
  ];

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    
    // Оповещаем родительский компонент об изменении состояния
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  // Эффект для обновления состояния при изменении маршрута
  useEffect(() => {
    // При смене маршрута на мобильных устройствах скрываем сайдбар
    const handleRouteChange = () => {
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true);
        if (onToggle) {
          onToggle(true);
        }
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, collapsed, onToggle]);

  return (
    <aside 
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out h-screen fixed top-0 left-0 overflow-y-auto z-20`}
      style={sidebarStyle}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700">
        {!collapsed && (
          <span className="text-white font-bold text-xl">Прогноз</span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'justify-start'
                  } py-3 px-4 rounded-md ${
                    isActive
                      ? 'bg-opacity-20 bg-white'
                      : 'hover:bg-opacity-10 hover:bg-white'
                  } transition-colors`}
                  style={{ color: isActive ? appearanceSettings.primaryColor || themeColors.teal : 'white' }}
                >
                  <span className="inline-block">{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Добавляем элемент для переключения темы в футере сайдбара */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center justify-center">
          <button
            className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors"
            onClick={toggleTheme} // Используем функцию toggleTheme вместо inline-функции
            title={`Переключить на ${appearanceSettings.theme === 'dark' ? 'светлую' : 'темную'} тему`}
          >
            {appearanceSettings.theme === 'dark' ? (
              // Иконка солнца для тёмной темы
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Иконка луны для светлой темы
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;