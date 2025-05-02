import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SettingsTabNav, { SettingsTab } from '@/components/Settings/SettingsTabNav';
import GeneralSettings from '@/components/Settings/GeneralSettings';
import AppearanceSettings from '@/components/Settings/ApperanceSettings';
import AccountSettings from '@/components/Settings/AccountSettings';
import ProfileSelector from '@/components/Settings/ProfileSelector';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };

  return (
    <DashboardLayout title="Настройки">
      {/* Селектор профилей */}
      <ProfileSelector />
      
      {/* Навигация по вкладкам */}
      <SettingsTabNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Содержимое вкладок */}
      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'appearance' && <AppearanceSettings />}
      {activeTab === 'accounts' && <AccountSettings />}
    </DashboardLayout>
  );
};

export default SettingsPage;