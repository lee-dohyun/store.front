"use client";

import { useState } from "react";
import { SegmentedControl } from "@posselect/ui";

// 답변은 지금 실제로 되는 동작만 적는다(store.front#87). 결제 수단 질문은 실결제 연동(gateway#319) 전까지 뺐고,
// 쿠폰·적립금 언급은 그 기능(gateway#334)이 생기기 전까지 쓰지 않는다. 규칙의 출처:
// 반품 기간·교환 사유 — order.api ClaimCommitter, 배송비·반품 배송비 — product.api ShippingFeeCalculator.
const faqData = [
  {
    id: 1,
    category: "배송",
    question: "배송은 보통 얼마나 걸리나요?",
    answer: "출고 일정은 상품마다 다릅니다. 상품 상세의 배송 정보에 적힌 일정을 확인해 주세요.\n출고 후에는 택배사 사정에 따라 도착이 늦어질 수 있습니다.",
  },
  {
    id: 2,
    category: "배송",
    question: "배송지를 변경할 수 있나요?",
    answer: "주문한 뒤에는 배송지를 바꿀 수 없습니다.\n상품이 출고되기 전이라면 마이페이지 > 주문 상세의 '취소·반품·교환'에서 주문을 취소한 뒤, 새 배송지로 다시 주문해 주세요.",
  },
  {
    id: 3,
    category: "교환/반품",
    question: "교환이나 반품은 어떻게 신청하나요?",
    answer: "배송 완료 후 7일 이내에 마이페이지 > 주문 상세의 '취소·반품·교환'에서 신청할 수 있습니다.\n교환은 상품 하자나 오배송일 때만 신청할 수 있습니다. 단순 변심 반품은 상품별 반품 배송비(편도)를 뺀 금액이 환불됩니다.",
  },
  {
    id: 5,
    category: "회원",
    question: "비회원도 구매가 가능한가요?",
    answer: "네, 가능합니다.\n로그인하지 않고 주문하면 비회원 주문이 됩니다. 주문 내역은 비회원 주문 조회(https://product.posselect.com/guest-order)에서 주문번호와 주문할 때 적은 연락처로 확인할 수 있고, 같은 화면에서 취소·반품·교환도 신청할 수 있습니다.",
  },
  {
    id: 6,
    category: "회원",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer: "마이페이지의 '회원 탈퇴' 버튼으로 진행하실 수 있습니다.",
  }
];

const categories = ["전체", "배송", "교환/반품", "회원"];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs = faqData.filter(
    (faq) => selectedCategory === "전체" || faq.category === selectedCategory
  );

  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 32 }}>자주 묻는 질문</h1>

        <div style={{ marginBottom: 32 }}>
          <SegmentedControl
            name="faq-category"
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setOpenId(null);
            }}
            options={categories.map((c) => ({ label: c, value: c }))}
          />
        </div>

        {filteredFaqs.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 14 }}>
            해당 카테고리에 등록된 질문이 없습니다.
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <li key={faq.id} style={{ borderBottom: "1px solid var(--color-divider)" }}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "20px 4px",
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      className="tag"
                      style={{ flexShrink: 0, fontSize: 11 }}
                    >
                      {faq.category}
                    </span>
                    <span style={{ flex: 1 }}>{faq.question}</span>
                    <span style={{ fontSize: 20, fontWeight: 300, color: "var(--color-muted)" }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 4px 20px 4px",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--color-muted)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
