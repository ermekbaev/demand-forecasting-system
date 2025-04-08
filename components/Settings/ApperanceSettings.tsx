import React from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import SettingsSection from './SettingsSection';
import ColorPicker from './ColorPicker';
import SettingsButton from './SettingsButton';

const AppearanceSettings: React.FC = () => {
  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Настройки внешнего вида</h2>
      
      <div className="space-y-6">
        <SettingsSection title="Тема">
          <div className="grid grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg cursor-pointer bg-white border-indigo-500 ring-2 ring-indigo-500">
              <div className="h-20 bg-white border border-gray-200 rounded-md mb-2"></div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Светлая</p>
            </div>
            <div className="border p-4 rounded-lg cursor-pointer">
              <div className="h-20 bg-gray-800 border border-gray-700 rounded-md mb-2"></div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Темная</p>
            </div>
            <div className="border p-4 rounded-lg cursor-pointer">
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
                colors={[
                  themeColors.teal,
                  themeColors.bluishGray,
                  themeColors.darkTeal,
                  "#4F46E5", // indigo-600
                  "#9333EA"  // purple-600
                ]}
                selectedColor={themeColors.teal}
                onColorSelect={(color) => console.log('Selected color:', color)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Размер шрифта
              </label>
              <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
                <option value="sm">Маленький</option>
                <option value="md" selected>Средний</option>
                <option value="lg">Большой</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Макет панели">
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg cursor-pointer bg-white border-indigo-500 ring-2 ring-indigo-500">
              <div className="h-20 bg-white rounded-md mb-2 overflow-hidden">
                <div className="h-4 w-1/6 bg-gray-800 float-left"></div>
                <div className="h-4 w-5/6 bg-gray-100 float-left"></div>
                <div className="h-16 w-1/6 bg-gray-200 float-left"></div>
                <div className="h-16 w-5/6 bg-white float-left"></div>
              </div>
              <p className="text-sm font-medium" style={{ color: themeColors.darkTeal }}>Боковое меню</p>
            </div>
            <div className="border p-4 rounded-lg cursor-pointer">
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
          onClick={() => console.log('Применить изменения')}
        >
          Применить изменения
        </SettingsButton>
      </div>
    </div>
  );
};

export default AppearanceSettings;