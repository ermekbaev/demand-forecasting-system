// utils/apiHelpers.ts
import { getFullImageUrl } from '@/services/api';
import type { Product as ApiProduct, Model } from '@/services/api';

// Интерфейс для форматированного продукта
export interface FormattedProduct {
  slug: string;
  Name: string;
  Description: string;
  Price: number;
  imageUrl: string;
  imageUrls: string[];
  brandName: string;
  brandSlug: string;
  categoryNames: string[];
  categoryIds: string[];
  categorySlugs: string[];
  genders: string[];
  colors: string[];
  sizes: number[];
}

export interface BrandWithProducts {
  name: string;
  slug: string;
  products: FormattedProduct[];
}

/**
 * Форматирует продукт из API в удобный формат для фронтенда
 */
export const formatApiProduct = async (
  item: ApiProduct, 
  models: Model[]
): Promise<FormattedProduct> => {
  // Извлекаем URL-ы изображений из моделей
  const imageUrls = extractImagesFromModels(models, item.slug);
  
  // Собираем данные о цветах из моделей
  let modelColors: string[] = [];
  
  console.log(`🎨 Обрабатываем цвета для продукта: ${item.Name}`);
  console.log('Модели для продукта:', models);
  
  if (models && models.length > 0) {
    const matchingModels = models.filter((model: Model) => 
      model.product?.slug === item.slug
    );
    
    console.log('Подходящие модели:', matchingModels);
    
    if (matchingModels.length > 0) {
      matchingModels.forEach((model: Model, index: number) => {
        console.log(`Модель ${index}:`, model);
        console.log(`Цвет модели ${index}:`, model.colors); // Изменено с model.color на model.colors
        
        if (model.colors && model.colors.Name) {  // Изменено с model.color на model.colors
          if (!modelColors.includes(model.colors.Name)) {
            modelColors.push(model.colors.Name);
            console.log(`✅ Добавлен цвет: ${model.colors.Name}`);
          } else {
            console.log(`⚠️ Цвет уже добавлен: ${model.colors.Name}`);
          }
        } else {
          console.log(`❌ У модели ${index} нет цвета или имени цвета`);
        }
      });
    } else {
      console.log('❌ Нет подходящих моделей для продукта');
    }
  } else {
    console.log('❌ Модели не найдены или пустой массив');
  }
  
  // Проверяем цвета напрямую из продукта
  let directColors: string[] = [];
  if (item.colors && Array.isArray(item.colors)) {
    console.log('Прямые цвета из продукта:', item.colors);
    directColors = item.colors.map(c => c?.Name || '').filter(Boolean);
    console.log('Обработанные прямые цвета:', directColors);
  } else {
    console.log('❌ Прямые цвета не найдены в продукте');
  }
  
  // Определяем итоговый список цветов
  const finalColors = modelColors.length > 0 ? modelColors : directColors;
  
  console.log('🎯 Итоговые цвета:', finalColors);
  
  // Собираем информацию о категориях
  const categoryNames: string[] = [];
  const categoryIds: string[] = [];
  const categorySlugs: string[] = [];
  
  if (item.category) {
    const category = item.category;
    if (category.slug) {
      const categoryName = category.NameEngl || category.Name;
      
      if (categoryName) {
        categoryNames.push(categoryName);
        categoryIds.push(category.id);
        categorySlugs.push(category.slug);
      }
    }
  }
  
  // Получаем доступные размеры
  const sizes = item.sizes && Array.isArray(item.sizes)
    ? item.sizes.map(size => size.Size)
    : [];
  
  // Возвращаем отформатированный объект продукта
  return {
    slug: item.slug || 'no-slug',
    Name: item.Name || 'No name',
    Description: item.Description || '',
    Price: item.Price || 0,
    imageUrl: imageUrls.length > 0 ? imageUrls[0] : getFullImageUrl(),
    imageUrls: imageUrls,
    brandName: item.brand?.Brand_Name || 'Unknown Brand',
    brandSlug: item.brand?.slug || 'unknown-brand',
    categoryNames,
    categoryIds,
    categorySlugs,
    genders: item.genders && Array.isArray(item.genders) 
      ? item.genders.map(g => g?.Geander_Name || '').filter(Boolean)
      : [],
    colors: finalColors,
    sizes: sizes,
  };
};

/**
 * Извлекает изображения из моделей для конкретного продукта
 */
export const extractImagesFromModels = (
  models: Model[], 
  productSlug: string
): string[] => {
  if (!models || !Array.isArray(models) || models.length === 0) {
    return [getFullImageUrl()];
  }

  // Фильтруем модели, соответствующие продукту
  const matchingModels = models.filter(
    (model: Model) => model.product?.slug === productSlug
  );

  if (matchingModels.length === 0) {
    return [getFullImageUrl()];
  }

  // Извлекаем URL-ы изображений из моделей
  const imageUrls: string[] = [];

  matchingModels.forEach((model: Model) => {
    if (model.images && model.images.length > 0) {
      model.images.forEach((image: any) => {
        let imageUrl: string | null = null;

        if (image.url) {
          imageUrl = getFullImageUrl(image.url);
        } else if (
          image.formats &&
          image.formats.small &&
          image.formats.small.url
        ) {
          imageUrl = getFullImageUrl(image.formats.small.url);
        }

        if (imageUrl && !imageUrls.includes(imageUrl)) {
          imageUrls.push(imageUrl);
        }
      });
    }
  });

  return imageUrls.length > 0 ? imageUrls : [getFullImageUrl()];
};

/**
 * Группирует продукты по брендам
 */
export const groupProductsByBrand = (products: FormattedProduct[]): BrandWithProducts[] => {
  const brandMap = new Map<string, BrandWithProducts>();
  
  products.forEach(product => {
    if (!brandMap.has(product.brandSlug)) {
      brandMap.set(product.brandSlug, {
        name: product.brandName,
        slug: product.brandSlug,
        products: []
      });
    }
    
    brandMap.get(product.brandSlug)?.products.push(product);
  });
  
  // Преобразуем Map в массив и сортируем по алфавиту
  return Array.from(brandMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

/**
 * Фильтрует продукты по категории
 */
export const filterProductsByCategory = (
  products: FormattedProduct[], 
  categoryName: string
): FormattedProduct[] => {
  if (!categoryName || categoryName === 'All') {
    return products;
  }
  
  return products.filter(product => {
    return product.categoryNames && product.categoryNames.some((cat: string) => 
      cat.toLowerCase() === categoryName.toLowerCase()
    );
  });
};

/**
 * Сортирует продукты по различным критериям
 */
export const sortProducts = (
  products: FormattedProduct[], 
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest'
): FormattedProduct[] => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'name':
      return sortedProducts.sort((a, b) => a.Name.localeCompare(b.Name));
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.Price - b.Price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.Price - a.Price);
    case 'newest':
      // Если у вас есть поле даты создания, используйте его
      return sortedProducts; // пока без сортировки
    default:
      return sortedProducts;
  }
};

/**
 * Получает минимальную и максимальную цену из списка продуктов
 */
export const getPriceRange = (products: FormattedProduct[]): { min: number; max: number } => {
  if (products.length === 0) {
    return { min: 0, max: 10000 };
  }
  
  const prices = products.map(p => p.Price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

/**
 * Получает уникальные значения для фильтров
 */
export const getFilterOptions = (products: FormattedProduct[]) => {
  const brands = new Set<string>();
  const categories = new Set<string>();
  const genders = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<number>();
  
  products.forEach(product => {
    // Бренды
    brands.add(product.brandName);
    
    // Категории
    product.categoryNames.forEach(cat => categories.add(cat));
    
    // Гендер
    product.genders.forEach(gender => genders.add(gender));
    
    // Цвета
    product.colors.forEach(color => colors.add(color));
    
    // Размеры
    product.sizes.forEach(size => sizes.add(size));
  });
  
  return {
    brands: Array.from(brands).sort(),
    categories: Array.from(categories).sort(),
    genders: Array.from(genders).sort(),
    colors: Array.from(colors).sort(),
    sizes: Array.from(sizes).sort((a, b) => a - b),
    priceRange: getPriceRange(products)
  };
};