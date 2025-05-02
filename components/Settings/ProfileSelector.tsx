import React, { useState } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { useSettings, UserProfile } from '@/Context/SettingsContext';

const ProfileSelector: React.FC = () => {
  const { profiles, activeProfile, createProfile, activateProfile, deleteProfile } = useSettings();
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName('');
      setShowNewProfileForm(false);
    }
  };

  const handleDeleteClick = (profileId: string) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete);
      setProfileToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium" style={{ color: themeColors.darkTeal }}>Профили настроек</h3>
        <button
          className="px-3 py-1 text-sm rounded-md text-white"
          style={{ backgroundColor: themeColors.teal }}
          onClick={() => setShowNewProfileForm(true)}
        >
          Создать профиль
        </button>
      </div>

      {/* Список профилей */}
      <div className="space-y-3">
        {profiles.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">У вас пока нет сохраненных профилей настроек</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <div 
              key={profile.id} 
              className={`px-4 py-3 rounded-md flex justify-between items-center ${
                profile.isActive 
                  ? 'border-2 border-current' 
                  : 'border border-gray-200'
              }`}
              style={profile.isActive ? { borderColor: themeColors.teal } : {}}
            >
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{profile.name}</span>
                  {profile.isActive && (
                    <span 
                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${themeColors.teal}20`, color: themeColors.teal }}
                    >
                      Активный
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Создан: {formatDate(profile.createdAt)}
                </div>
              </div>
              <div className="flex space-x-2">
                {!profile.isActive && (
                  <button 
                    className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => activateProfile(profile.id)}
                  >
                    Активировать
                  </button>
                )}
                <button 
                  className="text-xs px-2 py-1 rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  onClick={() => handleDeleteClick(profile.id)}
                  disabled={profiles.length <= 1}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Форма создания нового профиля */}
      {showNewProfileForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>Создание нового профиля</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название профиля
              </label>
              <input
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Например: Рабочий профиль"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
                onClick={() => {
                  setShowNewProfileForm(false);
                  setNewProfileName('');
                }}
              >
                Отмена
              </button>
              <button 
                className="px-4 py-2 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: themeColors.teal }}
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-medium text-red-600 mb-4">Подтверждение удаления</h3>
            <p className="mb-4">Вы уверены, что хотите удалить этот профиль настроек? Это действие нельзя отменить.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Отмена
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
                onClick={confirmDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;