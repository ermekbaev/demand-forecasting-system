import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import SettingsSection from './SettingsSection';
import SettingsButton from './SettingsButton';
import { useSettings } from '@/Context/SettingsContext';

const AccountSettings: React.FC = () => {
  const { accountSettings, setAccountSettings, saveSettings } = useSettings();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Обработчики изменения профиля
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({ ...accountSettings, name: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({ ...accountSettings, lastName: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({ ...accountSettings, email: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({ ...accountSettings, phone: e.target.value });
  };

  // Обработчики изменения паролей
  const handlePasswordChange = (field: 'current' | 'new' | 'confirm', value: string) => {
    setPasswords({ ...passwords, [field]: value });
    setPasswordError('');
  };

  // Обработчик изменения настроек уведомлений
  const handleNotificationChange = (field: keyof typeof accountSettings, value: boolean) => {
    setAccountSettings({ ...accountSettings, [field]: value });
  };

  // Обработчик сохранения профиля
  const handleSaveChanges = () => {
    saveSettings();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Обработчик смены пароля
  const handleChangePassword = () => {
    // Проверки
    if (passwords.current === '') {
      setPasswordError('Пожалуйста, введите текущий пароль');
      return;
    }
    
    if (passwords.new === '') {
      setPasswordError('Пожалуйста, введите новый пароль');
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      setPasswordError('Новый пароль и подтверждение не совпадают');
      return;
    }
    
    // В реальном приложении здесь была бы логика обращения к API
    // для проверки текущего пароля и обновления на новый
    
    // Сбрасываем поля
    setPasswords({ current: '', new: '', confirm: '' });
    
    // Показываем сообщение об успехе
    alert('Пароль успешно изменен');
  };

  // Обработчик удаления аккаунта
  const handleDeleteAccount = () => {
    setIsDeleting(true);
  };

  // Подтверждение удаления аккаунта
  const confirmDeleteAccount = () => {
    // В реальном приложении здесь была бы логика обращения к API
    alert('Аккаунт успешно удален');
    setIsDeleting(false);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Настройки учетной записи</h2>
      
      {isSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
          Настройки успешно сохранены!
        </div>
      )}
      
      <div className="space-y-6">
        <SettingsSection title="Профиль пользователя">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-medium">
              {accountSettings.name.charAt(0)}{accountSettings.lastName.charAt(0)}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{accountSettings.name} {accountSettings.lastName}</p>
              <p className="text-sm text-black">{accountSettings.email}</p>
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
                value={accountSettings.name}
                onChange={handleNameChange}
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
                value={accountSettings.lastName}
                onChange={handleLastNameChange}
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
                value={accountSettings.email}
                onChange={handleEmailChange}
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
                value={accountSettings.phone}
                onChange={handlePhoneChange}
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
                value={passwords.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Новый пароль
              </label>
              <input
                type="password"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
              />
            </div>
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">
                {passwordError}
              </div>
            )}
            <div className="mt-2">
              <SettingsButton 
                variant="secondary"
                onClick={handleChangePassword}
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
                  checked={accountSettings.emailNotifications}
                  onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
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
                  checked={accountSettings.browserNotifications}
                  onChange={(e) => handleNotificationChange('browserNotifications', e.target.checked)}
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
                  checked={accountSettings.weeklySummary}
                  onChange={(e) => handleNotificationChange('weeklySummary', e.target.checked)}
                />
                <label htmlFor="weekly-summary" className="ml-2 block text-sm text-gray-700">
                  Получать еженедельный отчет о прогнозах
                </label>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-medium text-red-600 mb-4">Подтверждение удаления</h3>
            <p className="mb-4">Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить, и все ваши данные будут удалены.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
                onClick={() => setIsDeleting(false)}
              >
                Отмена
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
                onClick={confirmDeleteAccount}
              >
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <SettingsButton 
          variant="danger"
          onClick={handleDeleteAccount}
        >
          Удалить аккаунт
        </SettingsButton>
        <SettingsButton 
          variant="primary"
          onClick={handleSaveChanges}
        >
          Сохранить изменения
        </SettingsButton>
      </div>
    </div>
  );
};

export default AccountSettings;