import React, { useState, useEffect } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import SettingsSection from './SettingsSection';
import ColorPicker from './ColorPicker';
import SettingsButton from './SettingsButton';
import { useSettings } from '@/Context/SettingsContext';

const AppearanceSettings: React.FC = () => {
  const { appearanceSettings, setAppearanceSettings, applyTheme, applyPrimaryColor, applyFontSize, saveSettings } = useSettings();
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Обработчик изменения темы
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setAppearanceSettings({ ...appearanceSettings, theme });
    applyTheme(theme);
  };
  
  // Обработчик изменения цвета
  const handleColorChange = (color: string) => {
    setAppearanceSettings({ ...appearanceSettings, primaryColor: color });
    applyPrimaryColor(color);
  };
  
  // Обработчик изменения размера шрифта
  const handleFontSizeChange = (fontSize: 'sm' | 'md' | 'lg') => {
    setAppearanceSettings({ ...appearanceSettings, fontSize });
    applyFontSize(fontSize);
  };
  
  // Обработчик изменения макета
  const handleLayoutChange = (layout: 'sidebar' | 'top') => {
    setAppearanceSettings({ ...appearanceSettings, layout });
  };
  
  // Обработчик сохранения настроек
  const handleSaveChanges = () => {
    saveSettings();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };
  
  // Массив доступных цветов для выбора
  const availableColors = [
    themeColors.teal,
    themeColors.bluishGray,
    themeColors.darkTeal,
    "#4F46E5", // indigo-600
    "#9333EA", // purple-600
    "#14B8A6", // teal-500
    "#F59E0B", // amber-500
    "#EF4444"  // red-500
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Настройки внешнего вида</h2>
      
      {isSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
          Настройки успешно сохранены!
        </div>
      )}
      
      <div className="space-y-6">
        <SettingsSection title="Тема">
          <div className="grid grid-cols-3 gap-4">
            <div 
              className={`border p-4 rounded-lg cursor-pointer ${
                appearanceSettings.theme === 'light' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="h-20 bg-white border border-gray-200 rounded-md mb-2"></div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Светлая</p>
            </div>
            <div 
              className={`border p-4 rounded-lg cursor-pointer ${
                appearanceSettings.theme === 'dark' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="h-20 bg-gray-800 border border-gray-700 rounded-md mb-2"></div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Темная</p>
            </div>
            <div 
              className={`border p-4 rounded-lg cursor-pointer ${
                appearanceSettings.theme === 'system' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
              onClick={() => handleThemeChange('system')}
            >
              <div className="h-20 bg-gradient-to-b from-white to-gray-800 border border-gray-300 rounded-md mb-2"></div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>По умолчанию системы</p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Цветовая схема">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Основной цвет</p>
              <ColorPicker 
                colors={availableColors}
                selectedColor={appearanceSettings.primaryColor}
                onColorSelect={handleColorChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Размер шрифта
              </label>
              <select 
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                style={{ color: themeColors.darkTeal }}
                value={appearanceSettings.fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value as 'sm' | 'md' | 'lg')}
              >
                <option value="sm">Маленький</option>
                <option value="md">Средний</option>
                <option value="lg">Большой</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Макет панели">
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border p-4 rounded-lg cursor-pointer ${
                appearanceSettings.layout === 'sidebar' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
              onClick={() => handleLayoutChange('sidebar')}
            >
              <div className="h-20 bg-white rounded-md mb-2 overflow-hidden">
                <div className="h-4 w-1/6 bg-gray-800 float-left"></div>
                <div className="h-4 w-5/6 bg-gray-100 float-left"></div>
                <div className="h-16 w-1/6 bg-gray-200 float-left"></div>
                <div className="h-16 w-5/6 bg-white float-left"></div>
              </div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Боковое меню</p>
            </div>
            <div 
              className={`border p-4 rounded-lg cursor-pointer ${
                appearanceSettings.layout === 'top' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
              onClick={() => handleLayoutChange('top')}
            >
              <div className="h-20 bg-white rounded-md mb-2 overflow-hidden">
                <div className="h-4 w-full bg-gray-800"></div>
                <div className="h-4 w-full bg-gray-200 mt-1"></div>
                <div className="h-11 w-full bg-white"></div>
              </div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Верхнее меню</p>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="mt-6 flex justify-end">
        <SettingsButton 
          variant="primary"
          onClick={handleSaveChanges}
        >
          Применить изменения
        </SettingsButton>
      </div>
    </div>
  );
};

export default AppearanceSettings;