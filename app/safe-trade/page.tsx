import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "안전거래센터 | PosSelect",
};

const ARTICLES = [
  {
    title: "1. 안전거래 가이드",
    body: "PosSelect(이하 '회사')는 이용자의 안전한 거래 환경을 보장하기 위해 에스크로(구매자안전) 서비스를 제공하고 있습니다. 결제 시 결제대금예치 서비스를 통해 상품 수령을 확인한 후 판매자에게 대금이 정산됩니다.",
  },
  {
    title: "2. 사기 피해 예방",
    body: "안전한 거래를 위해 다음 사항에 유의해주시기 바랍니다.\n• 현금 직거래 유도나 외부 메신저를 통한 직접 결제 요구는 사기의 위험이 높으므로 절대 응하지 마십시오.\n• 판매자가 공식 결제 수단이 아닌 개별 계좌로 송금을 요구하는 경우 즉시 고객센터로 신고해주시기 바랍니다.\n• 상품 가격이 시세 대비 비정상적으로 저렴한 경우 주의하시기 바랍니다.",
  },
  {
    title: "3. 구매자 보호 정책",
    body: "회사는 구매자를 보호하기 위해 다음과 같은 정책을 운영합니다.\n• 결제대금 보호: 구매 확정 전까지 결제 대금을 안전하게 보관합니다.\n• 미배송 보상: 약속된 배송 기한 내 상품이 발송되지 않거나 분실된 경우 전액 환불 조치합니다.\n• 불량/가품 보상: 수령한 상품이 가품이거나 현저한 하자가 있는 경우 교환 및 환불을 보장합니다.",
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
