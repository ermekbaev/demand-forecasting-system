import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import SettingsSection from './SettingsSection';
import SettingsButton from './SettingsButton';

const AccountSettings: React.FC = () => {
  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Настройки учетной записи</h2>
      
      <div className="space-y-6">
        <SettingsSection title="Профиль пользователя">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-medium">
              ПР
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Пользователь Системы</p>
              <p className="text-sm text-black">user@example.com</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                style={{ color: themeColors.darkTeal }}
                defaultValue="Пользователь"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                style={{ color: themeColors.darkTeal }}
                defaultValue="Системы"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                style={{ color: themeColors.darkTeal }}
                defaultValue="user@example.com"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                style={{ color: themeColors.darkTeal }}
                defaultValue="+7 (999) 123-45-67"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Сменить пароль">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текущий пароль
              </label>
              <input
                type="password"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Новый пароль
              </label>
              <input
                type="password"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div className="mt-2">
              <SettingsButton 
                variant="secondary"
                onClick={() => console.log('Изменить пароль')}
              >
                Изменить пароль
              </SettingsButton>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Настройки уведомлений">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                  Получать уведомления по email
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="browser-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="browser-notifications" className="ml-2 block text-sm text-gray-700">
                  Показывать уведомления в браузере
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="weekly-summary"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="weekly-summary" className="ml-2 block text-sm text-gray-700">
                  Получать еженедельный отчет о прогнозах
                </label>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="mt-6 flex justify-between">
        <SettingsButton 
          variant="danger"
          onClick={() => console.log('Удалить аккаунт')}
        >
          Удалить аккаунт
        </SettingsButton>
        <SettingsButton 
          variant="primary"
          onClick={() => console.log('Сохранить изменения')}
        >
          Сохранить изменения
        </SettingsButton>
      </div>
    </div>
  );
};

export default AccountSettings;