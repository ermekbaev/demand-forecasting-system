import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';

// Компонент для настроек отдельной модели прогнозирования
interface ModelSettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const ModelSettingsSection: React.FC<ModelSettingsSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3" style={{ color: themeColors.darkTeal }}>{title}</h3>
      {children}
    </div>
  );
};

// Основной компонент вкладки настроек
const ForecastSettingsTab: React.FC = () => {
  // Состояния для различных настроек
  const [linearRegSettings, setLinearRegSettings] = useState({
    factors: '1',
    regularization: 'none'
  });
  
  const [arimaSettings, setArimaSettings] = useState({
    p: 1,
    d: 1,
    q: 1,
    autoParams: true
  });
  
  const [expSmoothingSettings, setExpSmoothingSettings] = useState({
    modelType: 'simple',
    alpha: 0.2
  });
  
  const [generalSettings, setGeneralSettings] = useState({
    autoSelectModel: true,
    confidenceIntervals: true,
    saveIntermediateCalcs: false
  });
  
  // Обработчик сброса настроек
  const handleResetSettings = () => {
    // Сбрасываем настройки до значений по умолчанию
    setLinearRegSettings({
      factors: '1',
      regularization: 'none'
    });
    
    setArimaSettings({
      p: 1,
      d: 1,
      q: 1,
      autoParams: true
    });
    
    setExpSmoothingSettings({
      modelType: 'simple',
      alpha: 0.2
    });
    
    setGeneralSettings({
      autoSelectModel: true,
      confidenceIntervals: true,
      saveIntermediateCalcs: false
    });
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Настройки моделей прогнозирования</h2>
      
      {/* Настройки линейной регрессии */}
      <ModelSettingsSection title="Линейная регрессия">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Количество факторов
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              value={linearRegSettings.factors}
              onChange={(e) => setLinearRegSettings({...linearRegSettings, factors: e.target.value})}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="auto">Автоматически</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Регуляризация
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              value={linearRegSettings.regularization}
              onChange={(e) => setLinearRegSettings({...linearRegSettings, regularization: e.target.value})}
            >
              <option value="none">Нет</option>
              <option value="l1">L1 (Lasso)</option>
              <option value="l2">L2 (Ridge)</option>
              <option value="elastic">Elastic Net</option>
            </select>
          </div>
        </div>
      </ModelSettingsSection>

      {/* Настройки ARIMA */}
      <ModelSettingsSection title="ARIMA">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              p (AR порядок)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={arimaSettings.p}
              onChange={(e) => setArimaSettings({...arimaSettings, p: parseInt(e.target.value)})}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              d (разность)
            </label>
            <input
              type="number"
              min="0"
              max="2"
              value={arimaSettings.d}
              onChange={(e) => setArimaSettings({...arimaSettings, d: parseInt(e.target.value)})}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              q (MA порядок)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={arimaSettings.q}
              onChange={(e) => setArimaSettings({...arimaSettings, q: parseInt(e.target.value)})}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={arimaSettings.autoParams}
              onChange={(e) => setArimaSettings({...arimaSettings, autoParams: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 shadow-sm"
            />
            <span className="ml-2 text-sm text-gray-700">Использовать автоматический подбор параметров</span>
          </label>
        </div>
      </ModelSettingsSection>

      {/* Настройки экспоненциального сглаживания */}
      <ModelSettingsSection title="Экспоненциальное сглаживание">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип модели
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              value={expSmoothingSettings.modelType}
              onChange={(e) => setExpSmoothingSettings({...expSmoothingSettings, modelType: e.target.value})}
            >
              <option value="simple">Простое сглаживание</option>
              <option value="holt">Двойное (Холта)</option>
              <option value="holt_winters">Тройное (Холта-Винтерса)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alpha (уровень)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={expSmoothingSettings.alpha}
              onChange={(e) => setExpSmoothingSettings({...expSmoothingSettings, alpha: parseFloat(e.target.value)})}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </ModelSettingsSection>

      {/* Общие настройки */}
      <ModelSettingsSection title="Общие настройки">
        <div className="space-y-3">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={generalSettings.autoSelectModel}
                onChange={(e) => setGeneralSettings({...generalSettings, autoSelectModel: e.target.checked})}
                className="rounded border-gray-300 text-indigo-600 shadow-sm"
              />
              <span className="ml-2 text-sm text-gray-700">Автоматически выбирать лучшую модель</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={generalSettings.confidenceIntervals}
                onChange={(e) => setGeneralSettings({...generalSettings, confidenceIntervals: e.target.checked})}
                className="rounded border-gray-300 text-indigo-600 shadow-sm"
              />
              <span className="ml-2 text-sm text-gray-700">Включать доверительные интервалы</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={generalSettings.saveIntermediateCalcs}
                onChange={(e) => setGeneralSettings({...generalSettings, saveIntermediateCalcs: e.target.checked})}
                className="rounded border-gray-300 text-indigo-600 shadow-sm"
              />
              <span className="ml-2 text-sm text-gray-700">Сохранять все промежуточные расчеты</span>
            </label>
          </div>
        </div>
      </ModelSettingsSection>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-4">
        <button 
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          onClick={handleResetSettings}
        >
          Сбросить настройки
        </button>
      </div>
    </div>
  );
};

export default ForecastSettingsTab;