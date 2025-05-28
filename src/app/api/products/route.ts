
// 📁 src/app/api/products/route.ts
import { NextRequest } from 'next/server';
import { fetchProducts, searchProducts, getFullImageUrl, type Product } from '../../../services/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    let products: Product[] = [];
    
    // Если есть поисковые параметры, используем searchProducts
    if (search || category || brand || minPrice || maxPrice) {
      const filters = {
        categories: category ? [category] : undefined,
        brands: brand ? [brand] : undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      };
      
      products = await searchProducts(search || '', filters);
    } else {
      // Иначе получаем все продукты
      products = await fetchProducts();
    }
    
    // Фильтрация featured товаров (если в Strapi нет поля featured)
    if (featured === 'true') {
      // Можно фильтровать по критериям: новые товары, высокий рейтинг, etc.
      products = products.filter(product => 
        product.Price > 5000 || // дорогие товары
        product.Name.toLowerCase().includes('nike') || // популярные бренды
        product.Name.toLowerCase().includes('adidas')
      );
    }
    
    // Ограничиваем количество
    const limitedProducts = products.slice(0, limit);
    
    // Преобразуем в формат для фронтенда
    const transformedProducts = limitedProducts.map(product => ({
      slug: product.slug,
      Name: product.Name,
      brandName: product.brand?.Brand_Name || 'Unknown',
      Price: product.Price,
      imageUrl: getFullImageUrl(product.Image?.url),
      colors: product.colors?.map(color => color.Name) || [],
      sizes: product.sizes?.map(size => size.Size.toString()) || [],
      genders: product.genders?.map(gender => gender.Geander_Name) || [],
      categoryName: product.category?.Name,
      description: product.Description,
      // Добавляем дополнительные поля для UI
      originalPrice: undefined, // Если есть в Strapi, добавьте
      isNew: false, // Если есть в Strapi, добавьте
      isSale: false, // Если есть в Strapi, добавьте
      rating: 4.0 + Math.random(), // Случайный рейтинг или из Strapi
    }));
    
    return Response.json({
      products: transformedProducts,
      total: products.length,
      page: 1,
      limit,
    });
    
  } catch (error) {
    console.error('Products API Error:', error);
    return Response.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
