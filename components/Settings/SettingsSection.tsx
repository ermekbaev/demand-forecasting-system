import React, { ReactNode } from 'react';
import { themeColors } from '@/lib/Theme/Colors';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
};

export default SettingsSection;