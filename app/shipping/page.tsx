import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배송/교환/반품 안내 | PosSelect",
};

const ARTICLES = [
  {
    title: "1. 배송 안내",
    body: "• 배송 방법: 지정 택배사 (CJ대한통운)\n• 배송 지역: 전국 지역\n• 배송 비용: 3,000원 (50,000원 이상 구매 시 무료배송, 제주/도서산간 지역 추가 운임 발생)\n• 배송 기간: 결제 완료 후 영업일 기준 2~3일 소요 (주말/공휴일 제외)\n  - 상품 종류에 따라 상품의 배송이 다소 지연될 수 있습니다.\n  - 예약 배송 상품은 상세 페이지에 고지된 배송 일정에 따릅니다.",
  },
  {
    title: "2. 교환 및 반품 안내",
    body: "• 교환/반품 기간: 상품 수령 후 7일 이내 신청 가능\n• 단순 변심에 의한 교환/반품 시 왕복 배송비(6,000원)는 고객님 부담입니다. (제주/도서산간 지역 추가 운임 발생)\n• 상품 불량 및 오배송 등의 사유로 교환/반품 시 배송비는 당사가 부담합니다.",
  },
  {
    title: "3. 교환/반품 불가 사유",
    body: "다음의 경우에는 교환 및 반품이 불가능합니다.\n• 고객님의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우\n• 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우\n• 시간의 경과에 의하여 재판매가 곤란할 정도로 상품의 가치가 감소한 경우\n• 복제가 가능한 상품의 포장을 훼손한 경우\n• 상품의 택(Tag)을 제거하거나 라벨을 훼손한 경우",
  },
  {
    title: "4. 환불 안내",
    body: "• 반품 상품 입고 및 검수 완료 후 영업일 기준 3~5일 이내에 결제 금액이 환불됩니다.\n• 신용카드 결제 시 카드사의 사정에 따라 환불 반영까지 추가로 시일이 소요될 수 있습니다.\n• 쿠폰 및 적립금을 사용한 주문의 경우, 실제 결제하신 금액만 환불되며 사용된 적립금 및 쿠폰은 반환됩니다.",
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
