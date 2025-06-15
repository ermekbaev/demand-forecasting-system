// 📁 src/app/api/products/route.ts
import { NextRequest } from 'next/server';
import { 
  fetchProducts, 
  searchProducts, 
  fetchModels, 
  getFullImageUrl, 
  type Product 
} from '../../../services/api';
import { formatApiProduct } from '../../../utils/apiHelpers';

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
    
    // console.log('🚀 Products API route - Параметры запроса:', {
    //   limit, featured, category, brand, search, minPrice, maxPrice
    // });
    
    let products: Product[] = [];
    
    // Если есть поисковые параметры, используем searchProducts
    if (search || category || brand || minPrice || maxPrice) {
      const filters = {
        categories: category ? [category] : undefined,
        brands: brand ? [brand] : undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      };
      
      // console.log('🔍 Используем поиск с фильтрами:', filters);
      products = await searchProducts(search || '', filters);
    } else {
      // Иначе получаем все продукты
      // console.log('📦 Загружаем все продукты');
      products = await fetchProducts();
    }
    
    // console.log(`📊 Получено ${products.length} продуктов из API`);
    
    // Фильтрация featured товаров
    if (featured === 'true') {
      // console.log('⭐ Фильтруем featured товары');
      products = products.filter(product => 
        product.Price > 5000 || // дорогие товары
        product.Name.toLowerCase().includes('nike') || // популярные бренды
        product.Name.toLowerCase().includes('adidas')
      );
      // console.log(`⭐ Осталось ${products.length} featured товаров`);
    }
    
    // Ограничиваем количество
    const limitedProducts = products.slice(0, limit);
    console.log(`📏 Ограничиваем до ${limit}, итого: ${limitedProducts.length}`);
    
    // ✅ ИСПОЛЬЗУЕМ formatApiProduct КАК В test-api
    // console.log('🔄 Начинаем обработку продуктов с formatApiProduct...');
    
    const transformedProducts = await Promise.all(
      limitedProducts.map(async (product, index) => {
        // console.log(`🔄 Обрабатываем продукт ${index + 1}/${limitedProducts.length}: ${product.Name}`);
        
        try {
          // ✅ Получаем модели для этого продукта (КАК В test-api)
          const models = await fetchModels(product.slug);
          // console.log(`🎨 Для продукта ${product.slug} найдено ${models.length} моделей`);
          
          // ✅ Форматируем продукт с моделями (КАК В test-api)
          const formatted = await formatApiProduct(product, models);
          // console.log(`✅ Продукт ${product.slug} отформатирован`);
          
          // ✅ Преобразуем в нужный формат для фронтенда
          const result = {
            slug: formatted.slug,
            Name: formatted.Name,
            brandName: formatted.brandName,
            Price: formatted.Price,
            imageUrl: formatted.imageUrl, // ✅ Теперь будет правильное изображение
            colors: formatted.colors, // ✅ Теперь будут правильные цвета
            sizes: formatted.sizes, // ✅ Правильные размеры
            genders: formatted.genders,
            categoryName: formatted.categoryNames[0] || product.category?.Name || null,
            description: formatted.Description,
            
            // Дополнительные поля для UI
            originalPrice: undefined,
            isNew: false,
            isSale: false,
            rating: 4.0 + Math.random(),
          };
          
          // console.log(`🎯 Результат для фронтенда:`, {
          //   slug: result.slug,
          //   imageUrl: result.imageUrl,
          //   colorsCount: result.colors.length,
          //   sizesCount: result.sizes.length,
          //   hasRealImage: !result.imageUrl.includes('placehold')
          // });
          
          return result;
          
        } catch (error) {
          console.error(`❌ Ошибка обработки продукта ${product.slug}:`, error);
          
          // ✅ Fallback версия (старая логика) если formatApiProduct не сработал
          const fallback = {
            slug: product.slug,
            Name: product.Name,
            brandName: product.brand?.Brand_Name || 'Unknown',
            Price: product.Price,
            imageUrl: getFullImageUrl(product.Image?.url),
            colors: product.colors?.map(color => color.Name).filter(Boolean) || ['Черный'], // Дефолтный цвет
            sizes: product.sizes?.map(size => size.Size) || [42], // Дефолтный размер
            genders: product.genders?.map(gender => gender.Geander_Name).filter(Boolean) || [],
            categoryName: product.category?.Name || null,
            description: product.Description || '',
            originalPrice: undefined,
            isNew: false,
            isSale: false,
            rating: 4.0 + Math.random(),
          };
          
          // console.log(`⚠️ Используем fallback для продукта ${product.slug}`);
          return fallback;
        }
      })
    );
    
    // console.log('✅ Все продукты обработаны в API route');
    // console.log('🔍 Первый продукт для проверки:', {
    //   slug: transformedProducts[0]?.slug,
    //   imageUrl: transformedProducts[0]?.imageUrl,
    //   colorsCount: transformedProducts[0]?.colors?.length,
    //   sizesCount: transformedProducts[0]?.sizes?.length,
    //   hasRealImage: transformedProducts[0]?.imageUrl && !transformedProducts[0].imageUrl.includes('placehold')
    // });
    
    return Response.json({
      products: transformedProducts,
      total: products.length,
      page: 1,
      limit,
    });
    
  } catch (error) {
    console.error('❌ Products API Error:', error);
    return Response.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}