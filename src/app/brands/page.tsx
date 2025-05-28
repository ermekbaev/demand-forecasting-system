// 📁 src/app/api/brands/route.ts

import { fetchBrands } from "@/services/api";


export async function GET() {
  try {
    const brands = await fetchBrands();
    
    return Response.json({ brands });
    
  } catch (error) {
    console.error('Brands API Error:', error);
    return Response.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
