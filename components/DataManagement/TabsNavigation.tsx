// components/DataManagement/TabsNavigation.tsx
import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';

type TabType = 'upload' | 'view' | 'export';

interface TabsNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  hasData: boolean;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab, hasData }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'upload'
              ? `border-current text-current`
              : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
          } transition-colors`}
          style={activeTab === 'upload' ? { color: themeColors.teal } : {}}
        >
          Загрузка данных
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'view'
              ? `border-current text-current`
              : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
          } transition-colors ml-6`}
          style={activeTab === 'view' ? { color: themeColors.teal } : {}}
          disabled={!hasData}
        >
          Просмотр данных
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'export'
              ? `border-current text-current`
              : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
          } transition-colors ml-6`}
          style={activeTab === 'export' ? { color: themeColors.teal } : {}}
          disabled={!hasData}
        >
          Экспорт данных
        </button>
      </nav>
    </div>
  );
};

export default TabsNavigation;