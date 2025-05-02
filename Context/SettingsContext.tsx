import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Типы для настроек
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  layout: 'sidebar' | 'top';
}

export interface GeneralSettings {
  dateFormat: string;
  csvDelimiter: string;
  numberFormat: string;
  currency: string;
  forecastPeriod: number;
  forecastUnit: 'days' | 'weeks' | 'months';
  forecastMethod: 'auto' | 'linear' | 'arima' | 'exp_smoothing';
  autoUpdateForecasts: boolean;
  showNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface AccountSettings {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklySummary: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
  settings: {
    general: GeneralSettings;
    appearance: AppearanceSettings;
    account: AccountSettings;
  }
}

// Интерфейс для контекста настроек
interface SettingsContextType {
  // Настройки
  generalSettings: GeneralSettings;
  setGeneralSettings: (settings: GeneralSettings) => void;
  
  appearanceSettings: AppearanceSettings;
  setAppearanceSettings: (settings: AppearanceSettings) => void;
  
  accountSettings: AccountSettings;
  setAccountSettings: (settings: AccountSettings) => void;
  
  // Профили
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  
  // Методы
  createProfile: (name: string) => void;
  activateProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  
  // Применение настроек
  applyTheme: (theme: 'light' | 'dark' | 'system') => void;
  applyPrimaryColor: (color: string) => void;
  applyFontSize: (size: 'sm' | 'md' | 'lg') => void;
  applyLayout: (layout: 'sidebar' | 'top') => void;
  
  // Сброс настроек
  resetSettings: () => void;
  
  // Сохранение настроек
  saveSettings: () => void;
}

// Значения по умолчанию для настроек
const defaultGeneralSettings: GeneralSettings = {
  dateFormat: 'DD.MM.YYYY',
  csvDelimiter: ',',
  numberFormat: '1,000.00',
  currency: 'RUB',
  forecastPeriod: 30,
  forecastUnit: 'days',
  forecastMethod: 'auto',
  autoUpdateForecasts: true,
  showNotifications: true,
  autoBackup: true,
  backupFrequency: 'weekly'
};

const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  primaryColor: '#622347', // соответствует themeColors.teal
  fontSize: 'md',
  layout: 'sidebar'
};

const defaultAccountSettings: AccountSettings = {
  name: 'Пользователь',
  lastName: 'Системы',
  email: 'user@example.com',
  phone: '+7 (999) 123-45-67',
  emailNotifications: true,
  browserNotifications: true,
  weeklySummary: true
};

// Создаем контекст
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Провайдер настроек
export function SettingsProvider({ children }: { children: ReactNode }) {
  // Состояния для настроек
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);
  const [accountSettings, setAccountSettings] = useState<AccountSettings>(defaultAccountSettings);
  
  // Состояния для профилей
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Загрузка настроек из localStorage при инициализации
  useEffect(() => {
    try {
      // Загружаем общие настройки
      const savedGeneralSettings = localStorage.getItem('generalSettings');
      if (savedGeneralSettings) {
        setGeneralSettings(JSON.parse(savedGeneralSettings));
      }
      
      // Загружаем настройки внешнего вида
      const savedAppearanceSettings = localStorage.getItem('appearanceSettings');
      if (savedAppearanceSettings) {
        setAppearanceSettings(JSON.parse(savedAppearanceSettings));
      }
      
      // Загружаем настройки аккаунта
      const savedAccountSettings = localStorage.getItem('accountSettings');
      if (savedAccountSettings) {
        setAccountSettings(JSON.parse(savedAccountSettings));
      }
      
      // Загружаем профили
      const savedProfiles = localStorage.getItem('userProfiles');
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        // Преобразуем строковые даты обратно в объекты Date
        const restoredProfiles = parsedProfiles.map((profile: any) => ({
          ...profile,
          createdAt: new Date(profile.createdAt)
        }));
        setProfiles(restoredProfiles);
      }
      
      // Загружаем активный профиль
      const activeProfileId = localStorage.getItem('activeProfileId');
      if (activeProfileId && savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        const active = parsedProfiles.find((p: any) => p.id === activeProfileId);
        if (active) {
          setActiveProfile({
            ...active,
            createdAt: new Date(active.createdAt)
          });
        }
      }
      
      // Применяем тему
      if (savedAppearanceSettings) {
        const parsedSettings: AppearanceSettings = JSON.parse(savedAppearanceSettings);
        applyTheme(parsedSettings.theme);
        applyPrimaryColor(parsedSettings.primaryColor);
        applyFontSize(parsedSettings.fontSize);
      }
    } catch (err) {
      console.error('Ошибка при загрузке настроек:', err);
    }
  }, []);

  // Сохранение настроек в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
  }, [generalSettings]);

  useEffect(() => {
    localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
  }, [appearanceSettings]);

  useEffect(() => {
    localStorage.setItem('accountSettings', JSON.stringify(accountSettings));
  }, [accountSettings]);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem('activeProfileId', activeProfile.id);
    }
  }, [activeProfile]);

  // Методы для работы с профилями
  const createProfile = (name: string) => {
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      name,
      createdAt: new Date(),
      isActive: true,
      settings: {
        general: { ...generalSettings },
        appearance: { ...appearanceSettings },
        account: { ...accountSettings }
      }
    };
    
    setProfiles([...profiles, newProfile]);
    setActiveProfile(newProfile);
  };
  
  const activateProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      // Обновляем активный статус всех профилей
      const updatedProfiles = profiles.map(p => ({
        ...p,
        isActive: p.id === id
      }));
      
      setProfiles(updatedProfiles);
      setActiveProfile(profile);
      
      // Загружаем настройки профиля
      setGeneralSettings(profile.settings.general);
      setAppearanceSettings(profile.settings.appearance);
      setAccountSettings(profile.settings.account);
      
      // Применяем настройки темы
      applyTheme(profile.settings.appearance.theme);
      applyPrimaryColor(profile.settings.appearance.primaryColor);
      applyFontSize(profile.settings.appearance.fontSize);
    }
  };
  
  const deleteProfile = (id: string) => {
    // Нельзя удалить последний профиль
    if (profiles.length <= 1) {
      return;
    }
    
    const updatedProfiles = profiles.filter(p => p.id !== id);
    setProfiles(updatedProfiles);
    
    // Если удаляем активный профиль, активируем другой
    if (activeProfile && activeProfile.id === id) {
      const newActive = updatedProfiles[0];
      setActiveProfile(newActive);
      
      // Загружаем настройки нового активного профиля
      setGeneralSettings(newActive.settings.general);
      setAppearanceSettings(newActive.settings.appearance);
      setAccountSettings(newActive.settings.account);
      
      // Применяем настройки темы
      applyTheme(newActive.settings.appearance.theme);
      applyPrimaryColor(newActive.settings.appearance.primaryColor);
      applyFontSize(newActive.settings.appearance.fontSize);
    }
  };

  // Применение настроек
  function applyTheme(theme: 'light' | 'dark' | 'system') {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Обновляем только изменившиеся значения
    const newTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    
    if (newTheme === 'dark') {
      root.classList.add('dark-theme');
      
      // Устанавливаем переменные для темной темы
      root.style.setProperty('--background', '#0e1d21');
      root.style.setProperty('--foreground', '#ededed');
      root.style.setProperty('--border-color', '#333333');
      root.style.setProperty('--muted', '#666666');
    } else {
      root.classList.remove('dark-theme');
      
      // Устанавливаем переменные для светлой темы
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      root.style.setProperty('--border-color', '#e2e8f0');
      root.style.setProperty('--muted', '#abafb5');
    }
  }
  
  function applyPrimaryColor(color: string) {
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--color-teal', color); // Для совместимости с существующим кодом
  }
  
  function applyFontSize(size: 'sm' | 'md' | 'lg') {
    const root = document.documentElement;
    const sizeMap = {
      'sm': '0.875rem',
      'md': '1rem',
      'lg': '1.125rem'
    };
    
    root.style.setProperty('--base-font-size', sizeMap[size]);
    document.body.style.fontSize = sizeMap[size];
  }
  
  function applyLayout(layout: 'sidebar' | 'top') {
    // Здесь будет код для изменения макета приложения
    // В текущей реализации не требуется, так как макет фиксированный
  }

  // Сброс настроек
  const resetSettings = () => {
    setGeneralSettings(defaultGeneralSettings);
    setAppearanceSettings(defaultAppearanceSettings);
    setAccountSettings(defaultAccountSettings);
    
    // Применяем стандартные настройки темы
    applyTheme(defaultAppearanceSettings.theme);
    applyPrimaryColor(defaultAppearanceSettings.primaryColor);
    applyFontSize(defaultAppearanceSettings.fontSize);
  };
  
  // Сохранение настроек в активный профиль
  const saveSettings = () => {
    if (activeProfile) {
      const updatedProfile = {
        ...activeProfile,
        settings: {
          general: generalSettings,
          appearance: appearanceSettings,
          account: accountSettings
        }
      };
      
      const updatedProfiles = profiles.map(p => 
        p.id === activeProfile.id ? updatedProfile : p
      );
      
      setProfiles(updatedProfiles);
      setActiveProfile(updatedProfile);
    }
    
    // Если нет активного профиля, создаем новый
    if (!activeProfile && profiles.length === 0) {
      createProfile('Основной профиль');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        generalSettings,
        setGeneralSettings,
        appearanceSettings,
        setAppearanceSettings,
        accountSettings,
        setAccountSettings,
        profiles,
        activeProfile,
        createProfile,
        activateProfile,
        deleteProfile,
        applyTheme,
        applyPrimaryColor,
        applyFontSize,
        applyLayout,
        resetSettings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Хук для использования контекста настроек
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}