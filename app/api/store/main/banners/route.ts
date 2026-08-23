import { NextResponse } from 'next/server';
import { fetchProductApi } from '@/lib/product-api';

export async function GET() {
  try {
    const data = await fetchProductApi('/api/products/main/banners', {
      next: { revalidate: 300 }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return NextResponse.json([]);
  }
}
