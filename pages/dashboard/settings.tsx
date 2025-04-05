import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'accounts'>('general');

  return (
    <DashboardLayout title="Настройки">
      {/* Навигация по вкладкам */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'general'
                ? `border-current text-current`
                : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
            style={activeTab === 'general' ? { color: themeColors.teal } : {}}
          >
            Общие
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'appearance'
                ? `border-current text-current`
                : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'appearance' ? { color: themeColors.teal } : {}}
          >
            Внешний вид
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'accounts'
                ? `border-current text-current`
                : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'accounts' ? { color: themeColors.teal } : {}}
          >
            Учетные записи
          </button>
        </nav>
      </div>

      {/* Общие настройки */}
      {activeTab === 'general' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Общие настройки</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Форматы данных</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Формат даты
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
                    <option value="DD.MM.YYYY">ДД.ММ.ГГГГ</option>
                    <option value="MM.DD.YYYY">ММ.ДД.ГГГГ</option>
                    <option value="YYYY-MM-DD">ГГГГ-ММ-ДД</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Разделитель в CSV
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
                    <option value=",">Запятая (,)</option>
                    <option value=";">Точка с запятой (;)</option>
                    <option value="\t">Табуляция</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Формат чисел
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
                    <option value="1,000.00">1,000.00</option>
                    <option value="1 000,00">1 000,00</option>
                    <option value="1.000,00">1.000,00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Единицы измерения
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
                    <option value="RUB">Рубли (₽)</option>
                    <option value="USD">Доллары ($)</option>
                    <option value="EUR">Евро (€)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Параметры прогнозирования</h3>
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
                      defaultValue="30"
                      className="block w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <select className="ml-2 block w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
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
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
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
                    defaultChecked
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
                    defaultChecked
                  />
                  <label htmlFor="notification-updates" className="ml-2 block text-sm text-gray-700">
                    Показывать уведомления об обновлении прогнозов
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Управление данными</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="backup-data"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="backup-data" className="ml-2 block text-sm text-gray-700">
                    Автоматически создавать резервные копии данных
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Частота резервного копирования
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" style={{ color: themeColors.darkTeal }}>
                    <option value="daily">Ежедневно</option>
                    <option value="weekly">Еженедельно</option>
                    <option value="monthly">Ежемесячно</option>
                  </select>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium">
                    Очистить все данные
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              className="px-4 py-2 rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: themeColors.teal }}
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      )}

      {/* Настройки внешнего вида */}
      {activeTab === 'appearance' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Настройки внешнего вида</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Тема</h3>
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
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Цветовая схема</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Основной цвет</p>
                  <div className="flex space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-indigo-500 cursor-pointer"
                      style={{ backgroundColor: themeColors.teal }}
                    ></div>
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                      style={{ backgroundColor: themeColors.bluishGray }}
                    ></div>
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                      style={{ backgroundColor: themeColors.darkTeal }}
                    ></div>
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-white cursor-pointer bg-indigo-600"
                    ></div>
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-white cursor-pointer bg-purple-600"
                    ></div>
                  </div>
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
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Макет панели</h3>
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
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              className="px-4 py-2 rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: themeColors.teal }}
            >
              Применить изменения
            </button>
          </div>
        </div>
      )}

      {/* Настройки учетных записей */}
      {activeTab === 'accounts' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.darkTeal }}>Настройки учетной записи</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Профиль пользователя</h3>
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
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Сменить пароль</h3>
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
                  <button 
                    className="px-4 py-2 text-sm rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
                    style={{ backgroundColor: themeColors.bluishGray }}
                  >
                    Изменить пароль
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Настройки уведомлений</h3>
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
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button className="px-4 py-2 text-sm text-red-600 font-medium">
              Удалить аккаунт
            </button>
            <button 
              className="px-4 py-2 rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: themeColors.teal }}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;