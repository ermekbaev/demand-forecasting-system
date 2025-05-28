// services/api.ts
import axios from 'axios';

// Конфигурация API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.104:1337/api";
export const IMG_API = process.env.NEXT_PUBLIC_IMG_API || "http://192.168.0.104:1337";

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов (для добавления токенов авторизации в будущем)
apiClient.interceptors.request.use(
  (config) => {
    // Добавляем токен авторизации, если есть
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов (для обработки ошибок)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Обработка различных типов ошибок
    if (error.response?.status === 401) {
      // Неавторизованный доступ
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Можно добавить редирект на страницу логина
      }
    }
    
    return Promise.reject(error);
  }
);

// Типы для API ответов
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Product {
  id: number;
  slug: string;
  Name: string;
  Description: string;
  Price: number;
  Image?: any;
  brand?: {
    id: number;
    slug: string;
    Brand_Name: string;
  };
  category?: {
    id: string;
    slug: string;
    Name: string;
    NameEngl?: string;
  };
  genders: Array<{ Geander_Name: string }>;
  colors: Array<{ Name: string }>;
  sizes?: Array<{ id: number; Size: number }>;
}

export interface Category {
  id: number;
  slug: string;
  Name: string;
  NameEngl?: string;
}

export interface Model {
  id: number;
  product?: {
    id: number;
    slug: string;
  };
  colors?: {  // Изменено с color на colors (множественное число)
    id: number;
    Name: string;
    colorCode?: string;
  };
  images?: Array<{
    id: number;
    url: string;
    formats?: {
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }>;
}

// ======================
// ПРОДУКТЫ
// ======================

/**
 * Получить все продукты
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<StrapiResponse<Product[]>>('/products?populate=*');
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return [];
  }
};

/**
 * Получить продукт по slug
 */
export const fetchProductById = async (slug: string) => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await apiClient.get(
      `/products?filters[slug][$eq]=${encodedSlug}&populate=*`
    );
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    throw error;
  }
};

/**
 * Поиск продуктов
 */
export const searchProducts = async (
  query: string, 
  filters?: {
    categories?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<Product[]> => {
  try {
    let url = `/products?populate=*`;
    
    // Добавляем поисковый запрос
    if (query) {
      url += `&filters[$or][0][Name][$containsi]=${encodeURIComponent(query)}`;
      url += `&filters[$or][1][Description][$containsi]=${encodeURIComponent(query)}`;
    }
    
    // Добавляем фильтры
    if (filters?.categories && filters.categories.length > 0) {
      filters.categories.forEach((category, index) => {
        url += `&filters[category][slug][$in][${index}]=${encodeURIComponent(category)}`;
      });
    }
    
    if (filters?.brands && filters.brands.length > 0) {
      filters.brands.forEach((brand, index) => {
        url += `&filters[brand][slug][$in][${index}]=${encodeURIComponent(brand)}`;
      });
    }
    
    if (filters?.minPrice !== undefined) {
      url += `&filters[Price][$gte]=${filters.minPrice}`;
    }
    
    if (filters?.maxPrice !== undefined) {
      url += `&filters[Price][$lte]=${filters.maxPrice}`;
    }
    
    const response = await apiClient.get<StrapiResponse<Product[]>>(url);
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка поиска товаров:', error);
    return [];
  }
};

// ======================
// КАТЕГОРИИ
// ======================

/**
 * Получить все категории
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<StrapiResponse<Category[]>>('/categories?populate=*');
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
    return [];
  }
};

// ======================
// МОДЕЛИ (для изображений)
// ======================

/**
 * Получить все модели
 */
export const fetchModels = async (productSlug?: string): Promise<Model[]> => {
  try {
    let url = '/models?populate=*';
    
    if (productSlug) {
      url += `&filters[product][slug][$eq]=${encodeURIComponent(productSlug)}`;
    }
    
    const response = await apiClient.get<StrapiResponse<Model[]>>(url);
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки моделей:', error);
    return [];
  }
};

/**
 * Получить модели по ID продукта
 */
export const fetchModelsByProductId = async (productId: number): Promise<Model[]> => {
  try {
    const response = await apiClient.get<StrapiResponse<Model[]>>(
      `/models?filters[product][id][$eq]=${productId}&populate=*`
    );
    
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка при загрузке моделей:', error);
    return [];
  }
};

// ======================
// БРЕНДЫ
// ======================

/**
 * Получить все бренды
 */
export const fetchBrands = async () => {
  try {
    const response = await apiClient.get('/brands?populate=*');
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки брендов:', error);
    return [];
  }
};

/**
 * Получить продукты бренда
 */
export const fetchProductsByBrand = async (brandSlug: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get<StrapiResponse<Product[]>>(
      `/products?filters[brand][slug][$eq]=${encodeURIComponent(brandSlug)}&populate=*`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки товаров бренда:', error);
    return [];
  }
};

// ======================
// УТИЛИТЫ
// ======================

/**
 * Проверка доступности API
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/products?pagination[limit]=1');
    return response.status === 200;
  } catch (error) {
    console.error('API недоступно:', error);
    return false;
  }
};

/**
 * Получить полный URL изображения
 */
export const getFullImageUrl = (
  relativePath?: string,
  defaultImage = "https://placehold.co/150x105/3E4246/FFFFFF?text=No+image"
): string => {
  if (!relativePath) return defaultImage;

  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${IMG_API}${path}`;
};