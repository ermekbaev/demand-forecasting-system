// 📁 src/app/api/favorites/route.ts
import { NextRequest } from 'next/server';

// Временная функция получения userId (замените на вашу логику)
async function getUserId(request: NextRequest): Promise<string> {
  // Вариант 1: Из header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Декодируем токен и извлекаем userId
    const token = authHeader.replace('Bearer ', '');
    // TODO: Декодировать JWT токен
    return 'user_123'; // Временно
  }
  
  // Вариант 2: Из cookies (сессия)
  const sessionCookie = request.cookies.get('session');
  if (sessionCookie) {
    // TODO: Проверить сессию в базе данных
    return 'user_123'; // Временно
  }
  
  // Вариант 3: Анонимный пользователь (по IP или временный ID)
  const userAgent = request.headers.get('user-agent') || '';
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return `anon_${btoa(userAgent + forwarded).slice(0, 10)}`;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/favorites/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Favorites GET Error:', error);
    return Response.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = await getUserId(request);
    
    // Валидация входящих данных
    if (!body.productSlug) {
      return Response.json(
        { error: 'productSlug is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/favorites`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          userId,
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Favorites POST Error:', error);
    return Response.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');
    const colorId = searchParams.get('colorId');
    const userId = await getUserId(request);
    
    if (!productSlug) {
      return Response.json(
        { error: 'productSlug is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/favorites/${userId}/${productSlug}${colorId ? `?colorId=${colorId}` : ''}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Favorites DELETE Error:', error);
    return Response.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}