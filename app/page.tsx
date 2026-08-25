import { BlueprintCorners } from "@posselect/ui";
import Image from "next/image";
import Link from "next/link";
import { fetchProductApi } from "@/lib/product-api";

// #55: 프리렌더 없음 — product.api 장애가 런타임 예외로 전파되어 error.tsx가 잡는다.
// #41: catch → [] 조용한 실패는 의도적으로 제거됨. 에러가 나야 error boundary가 발동한다.
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
  return fetchProductApi('/api/products/main/best?limit=10', { next: { revalidate: 300 } });
}

async function getNewProducts(): Promise<ProductSummary[]> {
  return fetchProductApi('/api/products/main/new?limit=10', { next: { revalidate: 300 } });
}

async function getProductsByCategory(): Promise<Record<string, ProductSummary[]>> {
  return fetchProductApi('/api/products/main/by-category', { next: { revalidate: 600 } });
}

async function getCategories(): Promise<Category[]> {
  return fetchProductApi('/api/categories', { next: { revalidate: 300 } });
}

/**
 * product.api에서 메인 페이지 상단 프로모션 배너 목록을 조회합니다.
 */
async function getBanners(): Promise<Banner[]> {
  return fetchProductApi('/api/products/main/banners', { next: { revalidate: 300 } });
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
            <div className="card blueprint elev-sm" style={{ cursor: "pointer", height: "100%" }}>
              <BlueprintCorners />
              <div className="product-card-media" style={{ position: "relative", backgroundColor: "#f5f5f5" }}>
                {p.thumbnailUrl ? (
                  <Image src={p.thumbnailUrl} alt={p.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>이미지 없음</div>
                )}
              </div>
              <div className="product-card-body">
                {p.stockQuantity <= 0 && <div className="card-kicker" style={{ color: "var(--color-danger)" }}>품절</div>}
                <div className="card-title" style={{ fontSize: 14, marginTop: p.stockQuantity <= 0 ? "0.2rem" : "1.2rem" }}>
                  {p.name}
                </div>
                <div className="card-meta product-card-price">{p.price.toLocaleString()}원</div>
              </div>
            </div>
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
          <Link href={banners[0].link} style={{ textDecoration: "none" }}>
            <div className="card blueprint elev-md hero" style={{ background: banners[0].bgColor, cursor: "pointer" }}>
              <BlueprintCorners />
              <div className="hero-title" style={{ color: "#fff" }}>{banners[0].title}</div>
              <div className="hero-sub" style={{ color: "rgba(255,255,255,0.8)" }}>{banners[0].subtitle}</div>
              {banners[0].imageUrl && (
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", opacity: 0.2 }}>
                  <Image src={banners[0].imageUrl} alt="banner" fill style={{ objectFit: "cover" }} />
                </div>
              )}
            </div>
          </Link>
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
