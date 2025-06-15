// 📁 src/app/api/search/route.ts
import { NextRequest } from 'next/server';
import { 
  searchProducts, 
  fetchModels, 
  getFullImageUrl, 
  type Product 
} from '../../../services/api';
import { formatApiProduct } from '../../../utils/apiHelpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'relevance';
    const limit = parseInt(searchParams.get('limit') || '25');
    
    // console.log('🔍 Search API - Параметры запроса:', {
    //   query, category, brand, minPrice, maxPrice, sort, limit
    // });
    
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
    
    // console.log('🔍 Фильтры для поиска:', filters);
    
    // Выполняем поиск
    const products = await searchProducts(query, filters);
    // console.log(`📊 Найдено ${products.length} продуктов из API`);
    
    // Ограичиваем результаты
    const limitedProducts = products.slice(0, limit);
    // console.log(`📏 Ограничиваем до ${limit}, итого: ${limitedProducts.length}`);
    
    // ✅ ИСПОЛЬЗУЕМ formatApiProduct для правильной обработки изображений
    // console.log('🔄 Начинаем обработку продуктов с formatApiProduct...');
    
    const processedResults = await Promise.all(
      limitedProducts.map(async (product, index) => {
        // console.log(`🔄 Обрабатываем продукт ${index + 1}/${limitedProducts.length}: ${product.Name}`);
        
        try {
          // ✅ Получаем модели для правильных изображений (КАК В /api/products)
          const models = await fetchModels(product.slug);
          // console.log(`🎨 Для продукта ${product.slug} найдено ${models.length} моделей`);
          
          // ✅ Форматируем продукт с моделями
          const formatted = await formatApiProduct(product, models);
          // console.log(`✅ Продукт ${product.slug} отформатирован с изображением: ${formatted.imageUrl}`);
          
          // ✅ Возвращаем в формате для поиска
          return {
            slug: formatted.slug,
            Name: formatted.Name,
            brandName: formatted.brandName,
            Price: formatted.Price,
            imageUrl: formatted.imageUrl, // ✅ Правильное изображение
            categoryName: formatted.categoryNames[0] || product.category?.Name || null,
            
            // Дополнительные поля для красивого отображения
            colors: formatted.colors, // ✅ Правильные цвета
            sizes: formatted.sizes, // ✅ Правильные размеры
            genders: formatted.genders,
            description: formatted.Description,
            
            // UI поля
            originalPrice: undefined,
            isNew: false,
            isSale: false,
            rating: 4.0 + Math.random(),
          };
          
        } catch (error) {
          console.error(`❌ Ошибка обработки продукта ${product.slug}:`, error);
          
          // ✅ Fallback с базовой обработкой изображения
          return {
            slug: product.slug,
            Name: product.Name,
            brandName: product.brand?.Brand_Name || 'Unknown',
            Price: product.Price,
            imageUrl: getFullImageUrl(product.Image?.url), // ✅ Хотя бы базовое изображение
            categoryName: product.category?.Name || null,
            colors: product.colors?.map(c => c.Name).filter(Boolean) || [],
            sizes: product.sizes?.map(s => s.Size) || [],
            genders: product.genders?.map(g => g.Geander_Name).filter(Boolean) || [],
            description: product.Description || '',
            originalPrice: undefined,
            isNew: false,
            isSale: false,
            rating: 4.0 + Math.random(),
          };
        }
      })
    );
    
    // Сортировка результатов
    let sortedResults = [...processedResults];
    
    switch (sort) {
      case 'price-asc':
        sortedResults.sort((a, b) => a.Price - b.Price);
        break;
      case 'price-desc':
        sortedResults.sort((a, b) => b.Price - a.Price);
        break;
      case 'name':
        sortedResults.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'rating':
        sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'new':
        sortedResults.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      // 'relevance' - оставляем как есть
    }
    
    // console.log('✅ Поиск завершен успешно');
    // console.log('🔍 Первый результат для проверки:', {
    //   slug: sortedResults[0]?.slug,
    //   imageUrl: sortedResults[0]?.imageUrl,
    //   hasRealImage: sortedResults[0]?.imageUrl && !sortedResults[0].imageUrl.includes('placehold')
    // });
    
    return Response.json({
      results: sortedResults,
      query,
      total: products.length,
      filters: { category, brand, minPrice, maxPrice },
      sort,
    });
    
  } catch (error) {
    console.error('❌ Search API Error:', error);
    return Response.json(
      { 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}