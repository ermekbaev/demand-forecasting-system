// lib/Data/exportTemplates.ts
import { ExportOptions } from './dataExporter';

/**
 * Интерфейс для шаблона экспорта данных
 */
export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  isDefault?: boolean;
  options: ExportOptions;
  selectedFields: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Получение всех сохраненных шаблонов экспорта
 * @returns Массив шаблонов экспорта
 */
export function getExportTemplates(): ExportTemplate[] {
  try {
    const templatesString = localStorage.getItem('exportTemplates');
    if (!templatesString) return [];
    
    const templates: any[] = JSON.parse(templatesString);
    
    // Преобразуем даты из строк в объекты Date
    return templates.map(template => ({
      ...template,
      createdAt: new Date(template.createdAt),
      updatedAt: new Date(template.updatedAt)
    }));
  } catch (error) {
    console.error('Ошибка при загрузке шаблонов экспорта:', error);
    return [];
  }
}

/**
 * Получение шаблона экспорта по умолчанию
 * @returns Шаблон экспорта по умолчанию или null
 */
export function getDefaultExportTemplate(): ExportTemplate | null {
  const templates = getExportTemplates();
  return templates.find(template => template.isDefault) || null;
}

/**
 * Сохранение нового шаблона экспорта
 * @param template Объект шаблона экспорта без id, createdAt и updatedAt
 * @returns Сохраненный шаблон экспорта с id, createdAt и updatedAt
 */
export function saveExportTemplate(
  template: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt'>
): ExportTemplate {
  const templates = getExportTemplates();
  
  // Если новый шаблон установлен как шаблон по умолчанию,
  // снимаем этот флаг со всех остальных шаблонов
  if (template.isDefault) {
    templates.forEach(t => { t.isDefault = false; });
  }
  
  // Создаем новый шаблон
  const newTemplate: ExportTemplate = {
    ...template,
    id: `template-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Добавляем шаблон в список и сохраняем
  templates.push(newTemplate);
  localStorage.setItem('exportTemplates', JSON.stringify(templates));
  
  return newTemplate;
}

/**
 * Обновление существующего шаблона экспорта
 * @param id Идентификатор шаблона для обновления
 * @param updates Объект с обновлениями для шаблона
 * @returns Обновленный шаблон экспорта или null, если шаблон не найден
 */
export function updateExportTemplate(
  id: string,
  updates: Partial<Omit<ExportTemplate, 'id' | 'createdAt'>>
): ExportTemplate | null {
  const templates = getExportTemplates();
  const templateIndex = templates.findIndex(t => t.id === id);
  
  if (templateIndex === -1) return null;
  
  // Если обновленный шаблон установлен как шаблон по умолчанию,
  // снимаем этот флаг со всех остальных шаблонов
  if (updates.isDefault) {
    templates.forEach(t => { t.isDefault = false; });
  }
  
  // Обновляем шаблон
  const updatedTemplate: ExportTemplate = {
    ...templates[templateIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  templates[templateIndex] = updatedTemplate;
  localStorage.setItem('exportTemplates', JSON.stringify(templates));
  
  return updatedTemplate;
}

/**
 * Удаление шаблона экспорта
 * @param id Идентификатор шаблона для удаления
 * @returns true, если шаблон успешно удален, false в противном случае
 */
export function deleteExportTemplate(id: string): boolean {
  const templates = getExportTemplates();
  const templateIndex = templates.findIndex(t => t.id === id);
  
  if (templateIndex === -1) return false;
  
  templates.splice(templateIndex, 1);
  localStorage.setItem('exportTemplates', JSON.stringify(templates));
  
  return true;
}

/**
 * Создание предопределенного шаблона экспорта
 * @param templateType Тип предопределенного шаблона
 * @param fields Доступные поля для экспорта
 * @returns Созданный шаблон экспорта
 */
export function createPredefinedTemplate(
  templateType: 'standard' | 'full' | 'minimal' | 'forecast',
  fields: string[]
): ExportTemplate {
  let template: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt'>;
  
  // Находим поля-кандидаты для различных категорий
  const dateFields = fields.filter(f => 
    f.toLowerCase().includes('date') || 
    f.toLowerCase().includes('time')
  );
  
  const valueFields = fields.filter(f => 
    f.toLowerCase().includes('value') || 
    f.toLowerCase().includes('quantity') || 
    f.toLowerCase().includes('amount') || 
    f.toLowerCase().includes('count')
  );
  
  const idFields = fields.filter(f => 
    f.toLowerCase().includes('id') || 
    f.toLowerCase().includes('code')
  );
  
  const categoryFields = fields.filter(f => 
    f.toLowerCase().includes('category') || 
    f.toLowerCase().includes('type') || 
    f.toLowerCase().includes('group')
  );
  
  const nameFields = fields.filter(f => 
    f.toLowerCase().includes('name') || 
    f.toLowerCase().includes('title') || 
    f.toLowerCase().includes('product')
  );
  
  switch (templateType) {
    case 'standard':
      // Стандартный шаблон включает основные поля
      template = {
        name: 'Стандартный шаблон',
        description: 'Основные поля для экспорта данных',
        format: 'csv',
        isDefault: false,
        options: {
          includeHeaders: true,
          includeSummary: false
        },
        selectedFields: [
          ...dateFields.slice(0, 1),
          ...idFields.slice(0, 1),
          ...nameFields.slice(0, 1),
          ...categoryFields.slice(0, 1),
          ...valueFields.slice(0, 2)
        ]
      };
      break;
    case 'full':
      // Полный шаблон включает все поля
      template = {
        name: 'Полный экспорт',
        description: 'Все доступные поля',
        format: 'xlsx',
        isDefault: false,
        options: {
          includeHeaders: true,
          includeSummary: true
        },
        selectedFields: [...fields]
      };
      break;
    case 'minimal':
      // Минимальный шаблон включает только самые необходимые поля
      template = {
        name: 'Минимальный экспорт',
        description: 'Только самые необходимые поля',
        format: 'csv',
        isDefault: false,
        options: {
          includeHeaders: true,
          includeSummary: false
        },
        selectedFields: [
          ...dateFields.slice(0, 1),
          ...valueFields.slice(0, 1)
        ]
      };
      break;
    case 'forecast':
      // Шаблон для экспорта прогнозов
      template = {
        name: 'Экспорт прогнозов',
        description: 'Оптимизировано для данных прогноза',
        format: 'xlsx',
        isDefault: false,
        options: {
          includeHeaders: true,
          includeSummary: true
        },
        selectedFields: [
          ...dateFields.slice(0, 1),
          ...valueFields.slice(0, 1),
          ...fields.filter(f => 
            f.toLowerCase().includes('forecast') || 
            f.toLowerCase().includes('predict') || 
            f.toLowerCase().includes('upper') || 
            f.toLowerCase().includes('lower')
          )
        ]
      };
      break;
  }
  
  // Если не удалось сформировать список полей, включаем все доступные поля
  if (template.selectedFields.length === 0) {
    template.selectedFields = [...fields];
  }
  
  // Убираем возможные дубликаты полей
  template.selectedFields = [...new Set(template.selectedFields)];
  
  return saveExportTemplate(template);
}

/**
 * Получение списка типов предопределенных шаблонов
 * @returns Массив объектов с id, name и description для каждого типа шаблона
 */
export function getPredefinedTemplateTypes(): Array<{id: string; name: string; description: string}> {
  return [
    {
      id: 'standard',
      name: 'Стандартный шаблон',
      description: 'Основные поля для экспорта данных'
    },
    {
      id: 'full',
      name: 'Полный экспорт',
      description: 'Все доступные поля'
    },
    {
      id: 'minimal',
      name: 'Минимальный экспорт',
      description: 'Только самые необходимые поля'
    },
    {
      id: 'forecast',
      name: 'Экспорт прогнозов',
      description: 'Оптимизировано для данных прогноза'
    }
  ];
}