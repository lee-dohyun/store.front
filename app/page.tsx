import { ProductCard } from "@posselect/ui";
import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";
import { fetchProductApi } from "@/lib/product-api";

/**
 * 이 페이지는 빌드 타임에 프리렌더하지 않는다(#53).
 *
 * `fetchProductApi()`의 기본 베이스 URL은 클러스터 내부 주소
 * (`product-api.customer.svc.cluster.local`)인데, Docker 빌드는 GitHub 호스티드 러너에서
 * 돌기 때문에 거기서는 이 주소가 해석되지 않는다. 그래서 프리렌더를 허용하면 둘 중 하나가 된다.
 *   - 조회 실패를 삼키면: "상품 0개"인 빈 HTML이 이미지에 구워져 배포 직후 빈 쇼핑몰이 뜬다(#41).
 *   - 조회 실패에 예외를 던지면: 빌드 자체가 죽는다(#53, 커밋 23e61a4).
 * 빌드 타임에 API를 아예 부르지 않는 것이 두 증상의 공통 뿌리를 없애는 방법이다.
 *
 * 아래 조회 함수들의 `next: { revalidate }`는 `force-dynamic` 아래에서도 그대로 유효하다.
 * (Next 15는 **캐시 설정이 없는** fetch만 `force-dynamic`에서 no-store로 덮는다.)
 * 즉 HTML 렌더는 매 요청이지만 product.api 호출은 revalidate 주기당 1회다.
 */
export const dynamic = "force-dynamic";

interface ProductSummary {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stockQuantity: number;
  thumbnailUrl: string | null;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  link: string;
  bgColor: string;
}

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

const TRUST_POINTS = [
  "안전결제 인증 완료",
  "품질 검수를 통과한 상품만 판매",
  "고객센터 평일 09:00~18:00 운영",
];

async function getBestProducts(): Promise<ProductSummary[]> {
  return await fetchProductApi('/api/products/main/best?limit=10', { next: { revalidate: 300 } });
}

async function getNewProducts(): Promise<ProductSummary[]> {
  return await fetchProductApi('/api/products/main/new?limit=10', { next: { revalidate: 300 } });
}

async function getProductsByCategory(): Promise<Record<string, ProductSummary[]>> {
  return await fetchProductApi('/api/products/main/by-category', { next: { revalidate: 600 } });
}

async function getCategories(): Promise<Category[]> {
  return await fetchProductApi('/api/categories', { next: { revalidate: 300 } });
}

/**
 * product.api에서 메인 페이지 상단 프로모션 배너 목록을 조회합니다.
 */
async function getBanners(): Promise<Banner[]> {
  return await fetchProductApi('/api/products/main/banners', { next: { revalidate: 300 } });
}

export default async function Home() {
  const [bestProducts, newProducts, productsByCategory, categories, banners] = await Promise.all([
    getBestProducts(),
    getNewProducts(),
    getProductsByCategory(),
    getCategories(),
    getBanners()
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const renderProductList = (products: ProductSummary[]) => {
    if (products.length === 0) {
      return <div style={{ padding: "var(--space-4)", color: "var(--color-text-muted)" }}>상품이 없습니다.</div>;
    }
    
    return (
      <div className="product-grid">
        {products.map((p) => (
          <Link href={`https://product.posselect.com/products/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <ProductCard
              name={p.name}
              price={p.price}
              thumbnailUrl={p.thumbnailUrl}
              isSoldOut={p.stockQuantity <= 0}
            />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* 신뢰 안내 바 */}
      <div className="trust-bar">
        <div className="container trust-bar-items">
          {TRUST_POINTS.map((t) => (
            <span key={t} className="trust-bar-item">
              ✓ {t}
            </span>
          ))}
        </div>
      </div>

      {/* 배너 영역 */}
      {banners.length > 0 && (
        <div className="container" style={{ marginBlock: "var(--space-6)" }}>
          <BannerCarousel initialBanners={banners} />
        </div>
      )}

      {/* 상품 그리드 */}
      <main className="container" style={{ paddingBottom: 60 }}>
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>베스트 상품</h2>
          {renderProductList(bestProducts)}
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>신상품</h2>
          {renderProductList(newProducts)}
        </section>

        {/* 카테고리별 상품 */}
        {Object.entries(productsByCategory).map(([categoryIdStr, products]) => {
          const categoryId = parseInt(categoryIdStr, 10);
          const categoryName = categoryMap.get(categoryId) || `카테고리 ${categoryId}`;
          if (products.length === 0) return null;

          return (
            <section key={categoryId} style={{ marginTop: "var(--space-8)" }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>
                {categoryName}
              </h2>
              {renderProductList(products)}
            </section>
          );
        })}
      </main>
    </div>
  );
}
