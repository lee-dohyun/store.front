import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배송/교환/반품 안내 | PosSelect",
};

// 금액·기간은 실제 계산 규칙과 같아야 한다(store.front#87): 배송비 묶음·조건부 무료 — product.api ShippingFeeCalculator,
// 반품 기간·교환 사유·환불 안분 — order.api ClaimCommitter / ClaimRefundCalculator. 제주·도서산간 추가 운임은
// 권역 판정 데이터가 없어 청구하지 않으므로 안내하지 않는다. 고정 금액을 다시 적지 말 것.
const ARTICLES = [
  {
    title: "1. 배송 안내",
    body: "• 배송 지역: 전국\n• 배송 비용: 상품마다 다르며 상품 상세의 배송 정보에 적힌 금액을 따릅니다. 같은 판매자의 상품은 배송비를 한 번만 받고, 그중 가장 높은 금액을 적용합니다. 조건부 무료배송 상품은 그 판매자 상품의 합계가 기준액 이상이면 배송비가 없습니다.\n• 배송 기간: 상품 상세에 적힌 출고 일정을 따릅니다. 출고 후에는 택배사 사정에 따라 도착이 늦어질 수 있습니다.\n• 운송장 번호는 출고 후 마이페이지 > 주문 상세에서 확인할 수 있습니다.",
  },
  {
    title: "2. 교환 및 반품 안내",
    body: "• 신청 기간: 배송 완료 후 7일 이내, 마이페이지 > 주문 상세의 '취소·반품·교환'에서 신청합니다(비회원은 비회원 주문 조회 화면).\n• 출고 전에는 주문을 바로 취소할 수 있습니다.\n• 교환은 상품 하자나 오배송일 때만 신청할 수 있습니다.\n• 단순 변심 반품은 상품 상세에 적힌 반품 배송비(편도)를 환불 금액에서 뺍니다.\n• 상품 하자나 오배송으로 반품·교환할 때는 배송비를 고객님께 받지 않습니다.",
  },
  {
    title: "3. 교환/반품 불가 사유",
    body: "다음의 경우에는 교환 및 반품이 불가능합니다.\n• 고객님의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우\n• 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우\n• 시간의 경과에 의하여 재판매가 곤란할 정도로 상품의 가치가 감소한 경우\n• 복제가 가능한 상품의 포장을 훼손한 경우\n• 상품의 택(Tag)을 제거하거나 라벨을 훼손한 경우",
  },
  {
    title: "4. 환불 안내",
    body: "• 출고 전 취소는 취소하는 즉시 환불됩니다.\n• 반품은 신청이 승인되면 환불됩니다.\n• 회원 등급 할인을 받은 주문은 반품하는 상품 몫의 할인액을 뺀 금액이 환불됩니다.\n• 일부 상품만 취소·반품해서 남은 상품이 무료배송 기준액 아래로 내려가면, 처음에 면제됐던 배송비를 환불 금액에서 뺍니다(취소나 단순 변심 반품일 때).",
  },
];

export default function ShippingPage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>배송/교환/반품 안내</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          PosSelect의 배송, 교환 및 반품과 관련된 정책을 안내해 드립니다.
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
          (주)포스셀렉트 · 고객센터 1588-0000 (평일 09:00–18:00)
        </p>
      </div>
    </main>
  );
}
