import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사 소개 | PosSelect",
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "60vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>회사 소개</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          PosSelect는 최고의 쇼핑 경험을 제공합니다.
        </p>
        <section>
          <h3 style={{ marginBottom: 16 }}>우리의 비전</h3>
          <p style={{ lineHeight: 1.6, opacity: 0.88 }}>
            PosSelect는 누구나 쉽고 빠르게 원하는 상품을 찾고 안전하게 거래할 수 있는 환경을 만듭니다.<br />
            혁신적인 기술과 고객 중심의 서비스로 더 나은 쇼핑 경험을 선사합니다.
          </p>
        </section>
      </div>
    </main>
  );
}
