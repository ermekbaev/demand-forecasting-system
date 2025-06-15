// components/DataExport/ExportTemplateManager.tsx
import React, { useState, useEffect } from 'react';
import { themeColors } from '@/lib/Theme/Colors';
import { ExportTemplate, getExportTemplates, saveExportTemplate, updateExportTemplate, deleteExportTemplate, getPredefinedTemplateTypes, createPredefinedTemplate } from '@/lib/Data/exportTempletes';
import SettingsButton from '@/components/Settings/SettingsButton';
import { ExportOptions } from '@/lib/Data/dataExporter';

interface ExportTemplateManagerProps {
  fields: string[];
  onSelectTemplate: (template: ExportTemplate) => void;
  onCloseManager: () => void;
}

const ExportTemplateManager: React.FC<ExportTemplateManagerProps> = ({
  fields,
  onSelectTemplate,
  onCloseManager
}) => {
  // Состояния
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  
  // Состояние для формы создания/редактирования шаблона
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    format: 'csv' | 'xlsx' | 'json' | 'pdf';
    isDefault: boolean;
    includeHeaders: boolean;
    includeSummary: boolean;
    selectedFields: string[];
  }>({
    name: '',
    description: '',
    format: 'csv',
    isDefault: false,
    includeHeaders: true,
    includeSummary: false,
    selectedFields: [...fields]
  });
  
  // Загрузка шаблонов при инициализации
  useEffect(() => {
    const loadedTemplates = getExportTemplates();
    setTemplates(loadedTemplates);
  }, []);
  
  // Обработчик выбора шаблона
  const handleSelectTemplate = (template: ExportTemplate) => {
    setSelectedTemplate(template);
    onSelectTemplate(template);
  };
  
  // Обработчик открытия формы создания шаблона
  const handleOpenCreateForm = () => {
    setFormData({
      name: '',
      description: '',
      format: 'csv',
      isDefault: false,
      includeHeaders: true,
      includeSummary: false,
      selectedFields: [...fields]
    });
    setShowCreateForm(true);
  };
  
  // Обработчик открытия формы редактирования шаблона
  const handleOpenEditForm = (template: ExportTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      format: template.format,
      isDefault: template.isDefault || false,
      includeHeaders: template.options.includeHeaders,
      includeSummary: template.options.includeSummary,
      selectedFields: [...template.selectedFields]
    });
    setShowEditForm(true);
  };
  
  // Обработчик создания шаблона
  const handleCreateTemplate = () => {
    const template: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description,
      format: formData.format,
      isDefault: formData.isDefault,
      options: {
        includeHeaders: formData.includeHeaders,
        includeSummary: formData.includeSummary
      },
      selectedFields: formData.selectedFields
    };
    
    const newTemplate = saveExportTemplate(template);
    setTemplates([...templates, newTemplate]);
    setShowCreateForm(false);
  };
  
  // Обработчик редактирования шаблона
  const handleUpdateTemplate = () => {
    if (!selectedTemplate) return;
    
    const updates: Partial<Omit<ExportTemplate, 'id' | 'createdAt'>> = {
      name: formData.name,
      description: formData.description,
      format: formData.format,
      isDefault: formData.isDefault,
      options: {
        includeHeaders: formData.includeHeaders,
        includeSummary: formData.includeSummary
      },
      selectedFields: formData.selectedFields
    };
    
    const updatedTemplate = updateExportTemplate(selectedTemplate.id, updates);
    
    if (updatedTemplate) {
      // Обновляем список шаблонов
      const updatedTemplates = templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      );
      setTemplates(updatedTemplates);
    }
    
    setShowEditForm(false);
  };
  
  // Обработчик удаления шаблона
  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    
    const success = deleteExportTemplate(selectedTemplate.id);
    
    if (success) {
      // Обновляем список шаблонов
      const updatedTemplates = templates.filter(t => t.id !== selectedTemplate.id);
      setTemplates(updatedTemplates);
    }
    
    setShowDeleteConfirmation(false);
  };
  
  // Обработчик создания предопределенного шаблона
  const handleCreatePredefinedTemplate = (templateType: 'standard' | 'full' | 'minimal' | 'forecast') => {
    const newTemplate = createPredefinedTemplate(templateType, fields);
    setTemplates([...templates, newTemplate]);
  };
  
  // Обработчик изменения выбранных полей
  const handleFieldToggle = (field: string) => {
    if (formData.selectedFields.includes(field)) {
      setFormData({
        ...formData,
        selectedFields: formData.selectedFields.filter(f => f !== field)
      });
    } else {
      setFormData({
        ...formData,
        selectedFields: [...formData.selectedFields, field]
      });
    }
  };
  
  // Форматирование даты
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Получение иконки для формата файла
  const getFormatIcon = (format: string): string => {
    switch (format) {
      case 'csv':
        return '📄';
      case 'xlsx':
        return '📊';
      case 'json':
        return '📋';
      case 'pdf':
        return '📑';
      default:
        return '📁';
    }
  };
  
  // Список предопределенных шаблонов
  const predefinedTemplates = getPredefinedTemplateTypes();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium" style={{ color: themeColors.darkTeal }}>
            Управление шаблонами экспорта
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onCloseManager}
          >
            ✕
          </button>
        </div>
        
        {/* Список шаблонов */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
            Ваши шаблоны
          </h3>
          
          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {templates.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">У вас пока нет сохраненных шаблонов</p>
              </div>
            ) : (
              templates.map(template => (
                <div 
                  key={template.id} 
                  className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{getFormatIcon(template.format)}</span>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                      <div className="flex text-xs mt-1">
                        <span className="text-gray-500 mr-2">
                          Обновлен: {formatDate(template.updatedAt)}
                        </span>
                        {template.isDefault && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                            По умолчанию
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button 
                      className="text-gray-500 hover:text-blue-600 p-1 mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditForm(template);
                      }}
                    >
                      ✎
                    </button>
                    <button 
                      className="text-gray-500 hover:text-red-600 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Предопределенные шаблоны */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2" style={{ color: themeColors.darkTeal }}>
            Предопределенные шаблоны
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {predefinedTemplates.map((template:any) => (
              <div 
                key={template.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCreatePredefinedTemplate(template.id as any)}
              >
                <p className="font-medium">{template.name}</p>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Кнопки действий */}
        <div className="flex justify-between items-center">
          <div>
            <SettingsButton 
              variant="secondary"
              onClick={handleOpenCreateForm}
            >
              Создать новый шаблон
            </SettingsButton>
          </div>
          <div>
            <SettingsButton 
              variant="outline"
              onClick={onCloseManager}
              className="mr-2"
            >
              Отмена
            </SettingsButton>
          </div>
        </div>
        
        {/* Форма создания шаблона */}
        {showCreateForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>
                Создание шаблона экспорта
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название шаблона
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Базовый экспорт продаж"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    className="block w-full p-2 border border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Краткое описание шаблона"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Формат файла
                  </label>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'csv' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'csv' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'csv' })}
                    >
                      CSV
                    </button>
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'xlsx' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'xlsx' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'xlsx' })}
                    >
                      Excel (XLSX)
                    </button>
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'json' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'json' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'json' })}
                    >
                      JSON
                    </button>
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'pdf' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'pdf' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'pdf' })}
                    >
                      PDF
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="include-headers"
                    type="checkbox"
                    checked={formData.includeHeaders}
                    onChange={(e) => setFormData({ ...formData, includeHeaders: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-headers" className="ml-3 block text-sm font-medium text-gray-700">
                    Включить заголовки столбцов
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="include-summary"
                    type="checkbox"
                    checked={formData.includeSummary}
                    onChange={(e) => setFormData({ ...formData, includeSummary: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-summary" className="ml-3 block text-sm font-medium text-gray-700">
                    Включить сводную информацию
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="is-default"
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-default" className="ml-3 block text-sm font-medium text-gray-700">
                    Использовать как шаблон по умолчанию
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Выберите поля для экспорта
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fields.map(field => (
                        <div key={field} className="flex items-center">
                          <input
                            id={`field-${field}`}
                            type="checkbox"
                            checked={formData.selectedFields.includes(field)}
                            onChange={() => handleFieldToggle(field)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`field-${field}`} className="ml-2 text-sm text-gray-700 truncate">
                            {field}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <SettingsButton 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Отмена
                </SettingsButton>
                <SettingsButton 
                  variant="primary"
                  onClick={handleCreateTemplate}
                  disabled={!formData.name.trim() || formData.selectedFields.length === 0}
                >
                  Создать шаблон
                </SettingsButton>
              </div>
            </div>
          </div>
        )}
        
        {/* Форма редактирования шаблона */}
        {showEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-lg font-medium mb-4" style={{ color: themeColors.darkTeal }}>
                Редактирование шаблона
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название шаблона
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    className="block w-full p-2 border border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Формат файла
                  </label>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'csv' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'csv' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'csv' })}
                    >
                      CSV
                    </button>
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'xlsx' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'xlsx' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'xlsx' })}
                    >
                      Excel (XLSX)
                    </button>
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'json' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'json' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'json' })}
                    >
                      JSON
                    </button>
                    <button 
                      className={`px-4 py-2 bg-white border ${formData.format === 'pdf' 
                        ? 'border-current bg-gray-50' 
                        : 'border-gray-300'} rounded-md shadow-sm text-sm font-medium transition-colors`}
                      style={formData.format === 'pdf' ? { color: themeColors.teal } : {}}
                      onClick={() => setFormData({ ...formData, format: 'pdf' })}
                    >
                      PDF
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="include-headers-edit"
                    type="checkbox"
                    checked={formData.includeHeaders}
                    onChange={(e) => setFormData({ ...formData, includeHeaders: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-headers-edit" className="ml-3 block text-sm font-medium text-gray-700">
                    Включить заголовки столбцов
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="include-summary-edit"
                    type="checkbox"
                    checked={formData.includeSummary}
                    onChange={(e) => setFormData({ ...formData, includeSummary: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include-summary-edit" className="ml-3 block text-sm font-medium text-gray-700">
                    Включить сводную информацию
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="is-default-edit"
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is-default-edit" className="ml-3 block text-sm font-medium text-gray-700">
                    Использовать как шаблон по умолчанию
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Выберите поля для экспорта
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fields.map(field => (
                        <div key={field} className="flex items-center">
                          <input
                            id={`field-edit-${field}`}
                            type="checkbox"
                            checked={formData.selectedFields.includes(field)}
                            onChange={() => handleFieldToggle(field)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`field-edit-${field}`} className="ml-2 text-sm text-gray-700 truncate">
                            {field}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <SettingsButton 
                  variant="outline"
                  onClick={() => setShowEditForm(false)}
                >
                  Отмена
                </SettingsButton>
                <SettingsButton 
                  variant="primary"
                  onClick={handleUpdateTemplate}
                  disabled={!formData.name.trim() || formData.selectedFields.length === 0}
                >
                  Сохранить изменения
                </SettingsButton>
              </div>
            </div>
          </div>
        )}
        
        {/* Диалог подтверждения удаления */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="text-lg font-medium text-red-600 mb-4">Подтверждение удаления</h3>
              <p className="mb-4">Вы уверены, что хотите удалить шаблон "{selectedTemplate?.name}"? Это действие нельзя отменить.</p>
              <div className="flex justify-end space-x-3">
                <SettingsButton 
                  variant="outline"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Отмена
                </SettingsButton>
                <SettingsButton 
                  variant="danger"
                  onClick={handleDeleteTemplate}
                >
                  Удалить
                </SettingsButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportTemplateManager;