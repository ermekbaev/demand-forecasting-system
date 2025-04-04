import { themeColors } from '@/lib/Theme/Colors';
import React from 'react';


type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title = 'Система прогнозирования спроса' }) => {
  return (
    <header 
      className="w-full h-16 flex items-center justify-between px-6 shadow-sm"
      style={{ backgroundColor: themeColors.teal }}
    >
      <div className="flex items-center">
        <h1 className="text-white text-xl font-medium">{title}</h1>
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
          <span className="text-sm font-medium" style={{ color: themeColors.teal }}>ПР</span>
        </div>
      </div>
    </header>
  );
};

export default Header;