import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "채용 | PosSelect",
};

export default function CareersPage() {
  return (
    <main style={{ minHeight: "60vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>채용 안내</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          PosSelect와 함께 성장할 인재를 모십니다.
        </p>
        <section>
          <h3 style={{ marginBottom: 16 }}>진행 중인 채용</h3>
          <p style={{ lineHeight: 1.6, opacity: 0.88 }}>
            현재 진행 중인 채용 공고가 없습니다.<br />
            새로운 포지션이 열리면 이 페이지를 통해 안내해 드리겠습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
