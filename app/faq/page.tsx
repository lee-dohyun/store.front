"use client";

import { useState } from "react";
import { SegmentedControl } from "@posselect/ui";

const faqData = [
  {
    id: 1,
    category: "배송",
    question: "배송은 보통 얼마나 걸리나요?",
    answer: "결제 완료 후 영업일 기준 평균 2~3일 내에 배송됩니다.\n도서산간 지역의 경우 1~2일 추가 소요될 수 있습니다.",
  },
  {
    id: 2,
    category: "배송",
    question: "배송지를 변경할 수 있나요?",
    answer: "상품이 '결제완료' 또는 '상품준비중' 상태일 때만 마이페이지에서 배송지 변경이 가능합니다.\n'배송준비중' 이후 단계에서는 변경이 불가능합니다.",
  },
  {
    id: 3,
    category: "교환/반품",
    question: "교환이나 반품은 어떻게 신청하나요?",
    answer: "상품 수령 후 7일 이내에 마이페이지 > 주문내역에서 교환/반품 신청을 하실 수 있습니다.\n단순 변심의 경우 왕복 배송비가 부과될 수 있습니다.",
  },
  {
    id: 4,
    category: "결제",
    question: "어떤 결제 수단을 지원하나요?",
    answer: "신용카드, 체크카드, 실시간 계좌이체, 무통장입금 및 각종 간편결제(네이버페이, 카카오페이, 토스페이 등)를 지원합니다.",
  },
  {
    id: 5,
    category: "회원",
    question: "비회원도 구매가 가능한가요?",
    answer: "네, 가능합니다.\n장바구니에서 결제 시 '비회원 구매'를 선택하시면 됩니다. 다만 비회원 구매 시 쿠폰 및 적립금 혜택은 받으실 수 없습니다.",
  },
  {
    id: 6,
    category: "회원",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer: "마이페이지 > 회원정보수정 하단의 '회원 탈퇴' 버튼을 통해 진행하실 수 있습니다.\n탈퇴 시 보유하신 적립금과 쿠폰은 모두 소멸됩니다.",
  }
];

const categories = ["전체", "배송", "교환/반품", "결제", "회원"];

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
