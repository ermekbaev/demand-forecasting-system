// 📁 src/app/api/categories/route.ts
import { fetchCategories } from '../../../services/api';

export async function GET() {
  try {
    const categories = await fetchCategories();
    
    // Преобразуем в формат для фронтенда
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.Name,
      slug: category.slug,
      nameEngl: category.NameEngl,
      count: 0, // Можно добавить подсчет товаров через отдельный запрос
      description: '',
      image: null,
    }));
    
    return Response.json({ categories: transformedCategories });
    
  } catch (error) {
    console.error('Categories API Error:', error);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}