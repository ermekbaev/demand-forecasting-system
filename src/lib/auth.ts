// 📁 src/lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'; 

interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Извлекает userId из запроса (JWT токен, сессия или анонимный ID)
 */
export async function getUserId(request: NextRequest): Promise<string> {
  try {
    // Способ 1: JWT токен из Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        return decoded.userId;
      } catch (jwtError) {
        console.warn('Invalid JWT token:', jwtError);
      }
    }
    
    // Способ 2: Сессия из cookies
    const sessionCookie = request.cookies.get('session_id');
    if (sessionCookie) {
      // Здесь бы был запрос к базе данных для проверки сессии
      // const session = await getSessionFromDB(sessionCookie.value);
      // if (session && session.userId) return session.userId;
      
      // Временно возвращаем тестовый ID
      return `session_user_${sessionCookie.value.slice(0, 8)}`;
    }
    
    // Способ 3: User ID из параметров запроса (для API testing)
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      return userIdParam;
    }
    
    // Способ 4: Анонимный пользователь (создаем стабильный ID)
    return generateAnonymousUserId(request);
    
  } catch (error) {
    console.error('Error getting user ID:', error);
    return generateAnonymousUserId(request);
  }
}

/**
 * Генерирует стабильный анонимный ID пользователя
 */
function generateAnonymousUserId(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const forwarded = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  // Создаем стабильный hash на основе User-Agent и IP
  const fingerprint = `${userAgent}-${forwarded}`;
  const hash = btoa(fingerprint).replace(/[+/=]/g, '').slice(0, 12);
  
  return `anon_${hash}`;
}

/**
 * Проверяет, аутентифицирован ли пользователь
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
    
  } catch {
    return false;
  }
}

/**
 * Middleware для проверки аутентификации
 */
export async function requireAuth(request: NextRequest): Promise<string | null> {
  if (!(await isAuthenticated(request))) {
    return null;
  }
  
  return getUserId(request);
}

/**
 * Извлекает информацию о пользователе из токена
 */
export async function getUserInfo(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
    
  } catch {
    return null;
  }
}

// 📁 src/lib/api-client.ts
/**
 * Утилиты для работы с внешним API
 */

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

/**
 * Универсальная функция для запросов к внешнему API
 */
export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    cache = 'no-store',
  } = options;
  
  const url = `${process.env.API_BASE_URL}${endpoint}`;
  
  const requestOptions: RequestInit = {
    method,
    cache,
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Типизированные запросы к API
 */
export const api = {
  products: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      return apiRequest(`/products${query}`);
    },
    getById: (id: string) => apiRequest(`/products/${id}`),
    search: (query: string, filters?: Record<string, string>) => {
      const params = new URLSearchParams({ q: query, ...filters });
      return apiRequest(`/search?${params}`);
    },
  },
  
  categories: {
    getAll: () => apiRequest('/categories'),
    getById: (id: string) => apiRequest(`/categories/${id}`),
  },
  
  cart: {
    get: (userId: string) => apiRequest(`/cart/${userId}`),
    add: (userId: string, item: any) => apiRequest('/cart', {
      method: 'POST',
      body: { ...item, userId },
    }),
    update: (itemId: string, data: any) => apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: data,
    }),
    remove: (itemId: string, userId: string) => apiRequest(`/cart/${itemId}?userId=${userId}`, {
      method: 'DELETE',
    }),
  },
  
  favorites: {
    get: (userId: string) => apiRequest(`/favorites/${userId}`),
    add: (userId: string, item: any) => apiRequest('/favorites', {
      method: 'POST',
      body: { ...item, userId },
    }),
    remove: (userId: string, productSlug: string, colorId?: string) => {
      const query = colorId ? `?colorId=${colorId}` : '';
      return apiRequest(`/favorites/${userId}/${productSlug}${query}`, {
        method: 'DELETE',
      });
    },
  },
};