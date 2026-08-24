import { BlueprintCorners } from "@posselect/ui";
import Image from "next/image";
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

interface AdCampaign {
  id: number;
  title: string;
  subtitle: string;
  link: string;
  bgColor: string;
  sponsorName: string;
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
  try {
    return await fetchProductApi('/api/products/main/banners', { next: { revalidate: 300 } });
  } catch (e) {
    console.error("[Home/getBanners] 배너 조회 실패 - 속성: { error: ", e, " }");
    return [];
  }
}

/**
 * 임시 광고 목업 함수 (백엔드 연동 전까지)
 */
async function getAdCampaign(): Promise<AdCampaign | null> {
  // 실제 API 연동 시 fetchAdApi('/api/ads/main') 형태로 교체 예정
  return {
    id: 999,
    title: "PosSelect 파트너사 모집",
    subtitle: "지금 바로 입점하고 수수료 0% 혜택을 누리세요!",
    link: "/partners",
    bgColor: "#2a2a2a",
    sponsorName: "PosSelect Partners"
  };
}

export default async function Home() {
  const [bestProducts, newProducts, productsByCategory, categories, banners, adCampaign] = await Promise.all([
    getBestProducts(),
    getNewProducts(),
    getProductsByCategory(),
    getCategories(),
    getBanners(),
    getAdCampaign()
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
          <BannerCarousel initialBanners={banners} />
        </div>
      )}

      {/* 상품 그리드 */}
      <main className="container" style={{ paddingBottom: 60 }}>
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: "var(--space-4)" }}>베스트 상품</h2>
          {renderProductList(bestProducts)}
        </section>

        {/* 제휴/스폰서 광고 영역 */}
        {adCampaign && (
          <section style={{ marginBottom: "var(--space-8)" }}>
            <Link href={adCampaign.link} style={{ textDecoration: "none" }}>
              <div 
                className="card blueprint elev-md" 
                style={{ 
                  background: adCampaign.bgColor, 
                  cursor: "pointer", 
                  padding: "var(--space-6)", 
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <BlueprintCorners />
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "4px 8px",
                  fontSize: 12,
                  fontWeight: "bold",
                  borderBottomLeftRadius: 4
                }}>
                  AD
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: "var(--space-2)" }}>
                    {adCampaign.title}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, marginBottom: "var(--space-4)" }}>
                    {adCampaign.subtitle}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                    Sponsored by {adCampaign.sponsorName}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

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
