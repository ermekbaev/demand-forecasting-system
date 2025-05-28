// 📁 src/app/api/search/route.ts
import { NextRequest } from 'next/server';
import { searchProducts, getFullImageUrl } from '../../../services/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '25');
    
    if (!query && !category && !brand) {
      return Response.json(
        { error: 'Search query, category, or brand is required' },
        { status: 400 }
      );
    }
    
    const filters = {
      categories: category ? [category] : undefined,
      brands: brand ? [brand] : undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    };
    
    const products = await searchProducts(query, filters);
    
    // Ограничиваем результаты
    const limitedProducts = products.slice(0, limit);
    
    // Преобразуем для фронтенда
    const results = limitedProducts.map(product => ({
      slug: product.slug,
      Name: product.Name,
      brandName: product.brand?.Brand_Name || 'Unknown',
      Price: product.Price,
      imageUrl: getFullImageUrl(product.Image?.url),
      categoryName: product.category?.Name,
      rating: 4.0 + Math.random(),
    }));
    
    return Response.json({
      results,
      query,
      total: products.length,
      filters: { category, brand, minPrice, maxPrice },
    });
    
  } catch (error) {
    console.error('Search API Error:', error);
    return Response.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}