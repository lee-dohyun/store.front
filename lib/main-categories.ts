export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  sortOrder?: number;
}

export interface CategoryLink {
  id: number;
  label: string;
  href: string;
}

// 상품 목록은 product.front 가 서비스한다. 필터 파라미터 이름은 product.front 의
// `lib/product-list.ts`(`?category=<id>` → API 의 categoryId)와 맞춰야 한다.
const PRODUCT_LIST_URL = "https://product.posselect.com/";

/** 메인 페이지 카테고리 타일용: 대분류(부모 없음)만 노출 순서대로. */
export function topLevelCategoryLinks(categories: Category[]): CategoryLink[] {
  return categories
    .filter((c) => c.parentId === null)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id)
    .map((c) => ({ id: c.id, label: c.name, href: `${PRODUCT_LIST_URL}?category=${c.id}` }));
}
