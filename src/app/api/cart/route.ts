// 📁 src/app/api/cart/route.ts
import { NextRequest } from 'next/server';

// Функция получения userId (такая же как в favorites)
async function getUserId(request: NextRequest): Promise<string> {
  // Вариант 1: Из header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    // TODO: Декодировать JWT токен и извлечь userId
    return 'user_123'; // Временно
  }
  
  // Вариант 2: Из cookies (сессия)
  const sessionCookie = request.cookies.get('session');
  if (sessionCookie) {
    // TODO: Проверить сессию в базе данных
    return 'user_123'; // Временно
  }
  
  // Вариант 3: Анонимный пользователь
  const userAgent = request.headers.get('user-agent') || '';
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return `anon_${btoa(userAgent + forwarded).slice(0, 10)}`;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/cart/${userId}`,
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
    console.error('Cart GET Error:', error);
    return Response.json(
      { error: 'Failed to fetch cart' },
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
    
    if (!body.quantity || body.quantity < 1) {
      return Response.json(
        { error: 'quantity must be greater than 0' },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/cart`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          userId,
          addedAt: new Date().toISOString(),
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Cart POST Error:', error);
    return Response.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = await getUserId(request);
    
    // Обновление количества товара в корзине
    if (!body.cartItemId) {
      return Response.json(
        { error: 'cartItemId is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/cart/${body.cartItemId}`,
      {
        method: 'PUT',
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
    console.error('Cart PUT Error:', error);
    return Response.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');
    const userId = await getUserId(request);
    
    if (!cartItemId) {
      return Response.json(
        { error: 'cartItemId is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/cart/${cartItemId}?userId=${userId}`,
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
    console.error('Cart DELETE Error:', error);
    return Response.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}