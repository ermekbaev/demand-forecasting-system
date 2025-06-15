import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import SettingsSection from './SettingsSection';
import SettingsButton from './SettingsButton';
import { useSettings } from '@/Context/SettingsContext';

const GeneralSettings: React.FC = () => {
  const { generalSettings, setGeneralSettings, saveSettings } = useSettings();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Обработчик изменения настроек
  const handleSettingChange = (field: keyof typeof generalSettings, value: any) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value
    });
  };

  // Обработчик сохранения настроек
  const handleSaveSettings = () => {
    saveSettings();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Обработчик очистки данных
  const handleClearData = () => {
    setShowConfirmation(true);
  };

  // Обработчик подтверждения очистки данных
  const confirmClearData = () => {
    localStorage.clear();
    setShowConfirmation(false);
    alert('Все данные успешно очищены. Пожалуйста, перезагрузите страницу.');
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Общие настройки</h2>
      
      {isSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
          Настройки успешно сохранены!
        </div>
      )}
      
      <div className="space-y-6">
        <SettingsSection title="Форматы данных">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Формат даты
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={generalSettings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              >
                <option value="DD.MM.YYYY">ДД.ММ.ГГГГ</option>
                <option value="MM.DD.YYYY">ММ.ДД.ГГГГ</option>
                <option value="YYYY-MM-DD">ГГГГ-ММ-ДД</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Разделитель в CSV
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={generalSettings.csvDelimiter}
                onChange={(e) => handleSettingChange('csvDelimiter', e.target.value)}
              >
                <option value=",">Запятая (,)</option>
                <option value=";">Точка с запятой (;)</option>
                <option value="\t">Табуляция</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Формат чисел
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={generalSettings.numberFormat}
                onChange={(e) => handleSettingChange('numberFormat', e.target.value)}
              >
                <option value="1,000.00">1,000.00</option>
                <option value="1 000,00">1 000,00</option>
                <option value="1.000,00">1.000,00</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Единицы измерения
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={generalSettings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
              >
                <option value="RUB">Рубли (₽)</option>
                <option value="USD">Доллары ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Параметры прогнозирования">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Интервал прогноза по умолчанию
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  style={{ color: themeColors.darkTeal }}
                  min="1"
                  value={generalSettings.forecastPeriod}
                  onChange={(e) => handleSettingChange('forecastPeriod', parseInt(e.target.value))}
                  className="block w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <select 
                  className="ml-2 block w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  style={{ color: themeColors.darkTeal }}
                  value={generalSettings.forecastUnit}
                  onChange={(e) => handleSettingChange('forecastUnit', e.target.value as 'days' | 'weeks' | 'months')}
                >
                  <option value="days">Дней</option>
                  <option value="weeks">Недель</option>
                  <option value="months">Месяцев</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Метод прогнозирования по умолчанию
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={generalSettings.forecastMethod}
                onChange={(e) => handleSettingChange('forecastMethod', e.target.value as 'auto' | 'linear' | 'arima' | 'exp_smoothing')}
              >
                <option value="auto">Автоматический выбор</option>
                <option value="linear">Линейная регрессия</option>
                <option value="arima">ARIMA</option>
                <option value="exp_smoothing">Экспоненциальное сглаживание</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="auto-update"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={generalSettings.autoUpdateForecasts}
                onChange={(e) => handleSettingChange('autoUpdateForecasts', e.target.checked)}
              />
              <label htmlFor="auto-update" className="ml-2 block text-sm text-gray-700">
                Автоматически обновлять прогнозы при добавлении новых данных
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="notification-updates"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={generalSettings.showNotifications}
                onChange={(e) => handleSettingChange('showNotifications', e.target.checked)}
              />
              <label htmlFor="notification-updates" className="ml-2 block text-sm text-gray-700">
                Показывать уведомления об обновлении прогнозов
              </label>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Управление данными">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="backup-data"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={generalSettings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              />
              <label htmlFor="backup-data" className="ml-2 block text-sm text-gray-700">
                Автоматически создавать резервные копии данных
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Частота резервного копирования
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={generalSettings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value as 'daily' | 'weekly' | 'monthly')}
                disabled={!generalSettings.autoBackup}
              >
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
            <div className="mt-4">
              <button 
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium"
                onClick={handleClearData}
              >
                Очистить все данные
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-medium text-red-600 mb-4">Подтверждение</h3>
            <p className="mb-4">Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
                onClick={() => setShowConfirmation(false)}
              >
                Отмена
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
                onClick={confirmClearData}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <SettingsButton 
          variant="primary"
          onClick={handleSaveSettings}
        >
          Сохранить настройки
        </SettingsButton>
      </div>
    </div>
  );
};

export default GeneralSettings;