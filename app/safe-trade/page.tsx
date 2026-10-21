import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안전거래센터 | PosSelect",
};

// 에스크로(결제대금예치)·구매 확정은 없다 — 결제가 아직 실결제 연동 전이다(gateway#319). 생기기 전에 약속하지 말 것(store.front#87).
const ARTICLES = [
  {
    title: "1. 안전거래 가이드",
    body: "PosSelect(이하 '회사')에서의 결제는 상품 페이지의 주문·결제 화면에서만 이루어집니다. 그 밖의 경로로 대금을 요구받으면 응하지 마시고 고객센터로 알려 주세요.",
  },
  {
    title: "2. 사기 피해 예방",
    body: "안전한 거래를 위해 다음 사항에 유의해주시기 바랍니다.\n• 현금 직거래 유도나 외부 메신저를 통한 직접 결제 요구는 사기의 위험이 높으므로 절대 응하지 마십시오.\n• 판매자가 공식 결제 수단이 아닌 개별 계좌로 송금을 요구하는 경우 즉시 고객센터로 신고해주시기 바랍니다.\n• 상품 가격이 시세 대비 비정상적으로 저렴한 경우 주의하시기 바랍니다.",
  },
  {
    title: "3. 구매자 보호 정책",
    body: "회사는 구매자를 보호하기 위해 다음과 같은 정책을 운영합니다.\n• 출고 전 취소: 상품이 출고되기 전에는 마이페이지 > 주문 상세에서 직접 취소할 수 있고, 취소 즉시 환불됩니다.\n• 하자·오배송: 배송 완료 후 7일 이내에 반품 또는 교환을 신청할 수 있으며, 이때 배송비는 고객님께 받지 않습니다.",
  },
  {
    title: "4. 신고 및 제재 안내",
    body: "사기성 거래나 불법 거래 정황이 확인될 경우, 회사는 즉시 해당 판매자의 이용을 정지하고 수사기관의 조사에 적극 협조합니다.\n불공정 거래나 사기 피해 의심 사례 발생 시 지체 없이 안전거래센터(고객센터)로 신고해주시기 바랍니다.",
  },
];

export default function SafeTradePage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>안전거래센터</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          안전하고 신뢰할 수 있는 쇼핑 환경을 위한 정책을 안내해 드립니다.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {ARTICLES.map((article) => (
            <section key={article.title}>
              <h3 style={{ marginBottom: 8 }}>{article.title}</h3>
              <p style={{ whiteSpace: "pre-line", fontSize: 14, opacity: 0.88, lineHeight: 1.6 }}>
                {article.body}
              </p>
            </section>
          ))}
        </div>

        <hr className="hr" style={{ margin: "40px 0" }} />

        <p className="text-muted" style={{ fontSize: 12 }}>
          (주)포스셀렉트 · 안전거래 신고 및 고객센터 1588-0000 (평일 09:00–18:00)
        </p>
      </div>
    </main>
  );
}
