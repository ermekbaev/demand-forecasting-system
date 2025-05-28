// 📁 src/app/api/products/[slug]/route.ts
import { NextRequest } from 'next/server';
import { fetchProductById, fetchModelsByProductId, getFullImageUrl } from '../../../../services/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetchProductById(params.slug);
    
    if (!response.data || response.data.length === 0) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const productData = response.data[0];
    
    // Получаем модели для дополнительных изображений
    const models = await fetchModelsByProductId(productData.id);
    
    // Формируем галерею изображений
    const gallery = models.flatMap(model => 
      model.images?.map(img => ({
        url: getFullImageUrl(img.url),
        alt: `${productData.Name} - ${model.colors?.Name || ''}`,
        formats: {
          small: getFullImageUrl(img.formats?.small?.url),
          medium: getFullImageUrl(img.formats?.medium?.url),
          large: getFullImageUrl(img.formats?.large?.url),
        }
      })) || []
    );
    
    // Получаем уникальные цвета из моделей
    const modelColors = models.map(model => ({
      id: model.colors?.id || 0,
      name: model.colors?.Name || '',
      colorCode: model.colors?.colorCode,
    })).filter((color, index, self) => 
      index === self.findIndex(c => c.id === color.id)
    );
    
    const product = {
      slug: productData.slug,
      Name: productData.Name,
      brandName: productData.brand?.Brand_Name || 'Unknown',
      Price: productData.Price,
      imageUrl: getFullImageUrl(productData.Image?.url),
      gallery,
      colors: modelColors.length > 0 ? modelColors : productData.colors?.map(color => ({
        id: Math.random(), // Если нет ID в базовых цветах
        name: color.Name,
      })) || [],
      sizes: productData.sizes?.map(size => ({
        id: size.id,
        value: size.Size.toString(),
        available: true, // Можно добавить логику доступности
      })) || [],
      genders: productData.genders?.map(gender => gender.Geander_Name) || [],
      categoryName: productData.category?.Name,
      description: productData.Description,
      features: [], // Если есть в Strapi
      models, // Полная информация о моделях
      // Дополнительные поля
      originalPrice: undefined,
      isNew: false,
      isSale: false,
      featured: false,
      rating: 4.0 + Math.random(),
      reviewsCount: Math.floor(Math.random() * 100),
      stock: Math.floor(Math.random() * 50) + 10,
    };
    
    return Response.json({ product });
    
  } catch (error) {
    console.error('Product API Error:', error);
    return Response.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
