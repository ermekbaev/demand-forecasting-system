import React, { useState, ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = 'Система прогнозирования спроса' 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Функция для получения информации о состоянии боковой панели
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main Content */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Header */}
        <Header title={title} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Система прогнозирования спроса. Все права защищены.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;