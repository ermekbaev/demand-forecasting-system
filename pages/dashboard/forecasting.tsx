import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { themeColors } from '@/lib/Theme/Colors';

const ForecastingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'results' | 'settings'>('create');

  return (
    <DashboardLayout title="Прогнозирование">
      {/* Навигация по вкладкам */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'create'
                ? `border-current text-current`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors`}
            style={activeTab === 'create' ? { color: themeColors.teal } : {}}
          >
            Создать прогноз
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'results'
                ? `border-current text-current`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'results' ? { color: themeColors.teal } : {}}
          >
            Результаты прогнозов
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'settings'
                ? `border-current text-current`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors ml-6`}
            style={activeTab === 'settings' ? { color: themeColors.teal } : {}}
          >
            Настройки моделей
          </button>
        </nav>
      </div>

      {/* Вкладка создания прогноза */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card">
              <h2 className="text-lg font-medium mb-4">Параметры прогноза</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Набор данных
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="sales_data">Данные о продажах</option>
                    <option value="uploaded_data">Загруженные данные</option>
                    <option value="sample_data">Пример данных</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Продукт / Категория
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="all">Все продукты</option>
                    <option value="electronics">Электроника</option>
                    <option value="appliances">Бытовая техника</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Метод прогнозирования
                  </label>
                  <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="linear">Линейная регрессия</option>
                    <option value="arima">ARIMA</option>
                    <option value="exp_smoothing">Экспоненциальное сглаживание</option>
                    <option value="auto">Автоматический выбор</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Горизонт прогнозирования
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      defaultValue="30"
                      className="block w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <select className="ml-2 block w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="days">Дней</option>
                      <option value="weeks">Недель</option>
                      <option value="months">Месяцев</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Учитывать сезонность
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="seasonality"
                        value="auto"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Автоматически</span>
                    </label>
                    <label className="inline-flex items-center ml-4">
                      <input
                        type="radio"
                        name="seasonality"
                        value="yes"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Да</span>
                    </label>
                    <label className="inline-flex items-center ml-4">
                      <input
                        type="radio"
                        name="seasonality"
                        value="no"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Нет</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    className="w-full py-2 px-4 rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
                    style={{ backgroundColor: themeColors.teal }}
                  >
                    Создать прогноз
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card">
              <h2 className="text-lg font-medium mb-4">Предварительный анализ данных</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Выберите набор данных и параметры для просмотра предварительного анализа.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Исторические данные</h3>
                  <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
                    <p className="text-gray-500">Здесь будет график исторических данных</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Статистика</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Среднее значение</p>
                      <p className="text-lg font-semibold" style={{ color: themeColors.bluishGray }}>42.5</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Медиана</p>
                      <p className="text-lg font-semibold" style={{ color: themeColors.bluishGray }}>40.0</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Минимум</p>
                      <p className="text-lg font-semibold" style={{ color: themeColors.bluishGray }}>10</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Максимум</p>
                      <p className="text-lg font-semibold" style={{ color: themeColors.bluishGray }}>85</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Сезонность и тренды</h3>
                  <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                    <p className="text-gray-500">Здесь будет график сезонности и трендов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Вкладка результатов прогнозов */}
      {activeTab === 'results' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Результаты прогнозирования</h2>
          
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="recent">Недавние прогнозы</option>
                <option value="accuracy">По точности</option>
                <option value="model">По модели</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {/* Карточка прогноза 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">Все продукты</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">Создан 01.04.2025</span>
                </div>
                <div className="flex items-center">
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full mr-2 bg-green-100 text-green-800"
                  >
                    Точность: 92%
                  </span>
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                  >
                    ARIMA
                  </span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                    <p className="text-gray-500">График прогноза</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Прогнозируемый период</p>
                    <p className="text-sm font-medium">30 дней (02.04.2025 - 02.05.2025)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ожидаемый объем продаж</p>
                    <p className="text-lg font-semibold" style={{ color: themeColors.teal }}>1,248 единиц</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Доверительный интервал</p>
                    <p className="text-sm">1,150 - 1,320 единиц</p>
                  </div>
                  <div className="pt-2 flex space-x-2">
                    <button 
                      className="text-sm font-medium px-3 py-1 rounded-md"
                      style={{ color: themeColors.teal }}
                    >
                      Подробнее
                    </button>
                    <button 
                      className="text-sm font-medium px-3 py-1 rounded-md border border-gray-300"
                    >
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Карточка прогноза 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">Электроника</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">Создан 31.03.2025</span>
                </div>
                <div className="flex items-center">
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full mr-2 bg-yellow-100 text-yellow-800"
                  >
                    Точность: 85%
                  </span>
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                  >
                    Линейная регрессия
                  </span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                    <p className="text-gray-500">График прогноза</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Прогнозируемый период</p>
                    <p className="text-sm font-medium">60 дней (01.04.2025 - 30.05.2025)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ожидаемый объем продаж</p>
                    <p className="text-lg font-semibold" style={{ color: themeColors.teal }}>832 единиц</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Доверительный интервал</p>
                    <p className="text-sm">760 - 890 единиц</p>
                  </div>
                  <div className="pt-2 flex space-x-2">
                    <button 
                      className="text-sm font-medium px-3 py-1 rounded-md"
                      style={{ color: themeColors.teal }}
                    >
                      Подробнее
                    </button>
                    <button 
                      className="text-sm font-medium px-3 py-1 rounded-md border border-gray-300"
                    >
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              Загрузить еще
            </button>
          </div>
        </div>
      )}

      {/* Вкладка настроек моделей */}
      {activeTab === 'settings' && (
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Настройки моделей прогнозирования</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Линейная регрессия</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество факторов
                </label>
                <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
                <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="none">Нет</option>
                  <option value="l1">L1 (Lasso)</option>
                  <option value="l2">L2 (Ridge)</option>
                  <option value="elastic">Elastic Net</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">ARIMA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  p (AR порядок)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  defaultValue="1"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  defaultValue="1"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  defaultValue="1"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">Использовать автоматический подбор параметров</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Экспоненциальное сглаживание</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип модели
                </label>
                <select className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
                  defaultValue="0.2"
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Общие настройки</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">Автоматически выбирать лучшую модель</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">Включать доверительные интервалы</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Сохранять все промежуточные расчеты</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              Сбросить настройки
            </button>
            <button 
              className="px-4 py-2 text-sm rounded-md text-white font-medium hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: themeColors.teal }}
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ForecastingPage;