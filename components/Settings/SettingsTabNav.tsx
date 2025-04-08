import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';

export type SettingsTab = 'general' | 'appearance' | 'accounts';

interface SettingsTabNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SettingsTabNav: React.FC<SettingsTabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        <button
          onClick={() => onTabChange('general')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'general'
              ? `border-current text-current`
              : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
          } transition-colors`}
          style={activeTab === 'general' ? { color: themeColors.teal } : {}}
        >
          Общие
        </button>
        <button
          onClick={() => onTabChange('appearance')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'appearance'
              ? `border-current text-current`
              : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
          } transition-colors ml-6`}
          style={activeTab === 'appearance' ? { color: themeColors.teal } : {}}
        >
          Внешний вид
        </button>
        <button
          onClick={() => onTabChange('accounts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'accounts'
              ? `border-current text-current`
              : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
          } transition-colors ml-6`}
          style={activeTab === 'accounts' ? { color: themeColors.teal } : {}}
        >
          Учетные записи
        </button>
      </nav>
    </div>
  );
};

export default SettingsTabNav;