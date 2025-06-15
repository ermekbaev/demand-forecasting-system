import React, { useState, ReactNode, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSettings } from '@/Context/SettingsContext';

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = 'Система прогнозирования спроса' 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { appearanceSettings } = useSettings();
  
  // Функция для получения информации о состоянии боковой панели
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Эффект для применения настроек макета
  useEffect(() => {
    // Если выбран верхний макет, то автоматически скрываем боковую панель
    if (appearanceSettings.layout === 'top') {
      setSidebarCollapsed(true);
    }
  }, [appearanceSettings.layout]);

  return (
    <div className={`flex h-screen ${
      appearanceSettings.theme === 'dark' ? 'dark-theme' : 
      appearanceSettings.theme === 'light' ? 'light-theme' : ''
    }`}>
      {/* Sidebar - отображается только при макете с боковой панелью */}
      {appearanceSettings.layout === 'sidebar' && (
        <Sidebar onToggle={handleSidebarToggle} />
      )}
      
      {/* Main Content */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          appearanceSettings.layout === 'sidebar' 
            ? (sidebarCollapsed ? 'ml-20' : 'ml-64') 
            : 'ml-0'
        }`}
      >
        {/* Header */}
        <Header title={title} showSidebarToggle={appearanceSettings.layout === 'top'} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200 text-center">
          © {new Date().getFullYear()} Система прогнозирования спроса. Все права защищены.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;