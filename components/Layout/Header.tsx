import { themeColors } from '@/lib/Theme/Colors';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/Context/SettingsContext';

type HeaderProps = {
  title?: string;
  showSidebarToggle?: boolean;
};

const Header: React.FC<HeaderProps> = ({ 
  title = 'Система прогнозирования спроса',
  showSidebarToggle = false
}) => {
  const { appearanceSettings } = useSettings();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Определяем цвет фона в зависимости от текущей темы
  const headerColor = {
    backgroundColor: appearanceSettings.primaryColor || themeColors.teal
  };
  
  // Навигационные пункты (для верхнего меню)
  const navItems = [
    { name: 'Дашборд', path: '/dashboard' },
    { name: 'Данные', path: '/dashboard/data-management' },
    { name: 'Прогнозирование', path: '/dashboard/forecasting' },
    { name: 'Настройки', path: '/dashboard/settings' }
  ];

  return (
    <header 
      className="w-full shadow-sm"
      style={headerColor}
    >
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          {/* Кнопка мобильного меню или переключения сайдбара */}
          {showSidebarToggle && (
            <button 
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors mr-3 md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          )}
          
          <h1 className="text-white text-xl font-medium">{title}</h1>
          
          {/* Навигационные пункты для верхнего меню (только на больших экранах) */}
          {showSidebarToggle && (
            <nav className="hidden md:flex ml-6 space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-white opacity-90 hover:opacity-100 px-3 py-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
              />
            </svg>
          </button>

          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-sm font-medium" style={{ color: appearanceSettings.primaryColor || themeColors.teal }}>ПР</span>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {showMobileMenu && showSidebarToggle && (
        <div className="bg-white py-2 px-4 md:hidden shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-gray-800 py-2 px-3 hover:bg-gray-100 rounded"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;