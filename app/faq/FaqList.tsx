"use client";

import { useState } from "react";
import { SegmentedControl } from "@posselect/ui";
import { categories, faqData } from "./data";

/**
 * 카테고리 필터만 client 상태다. 답변은 `<details>` 안에 항상 렌더해서(접혀 있어도) 서버 HTML 에 그대로 실린다
 * — 예전엔 펼친 항목만 렌더해서 스크립트를 실행하지 않는 크롤러에는 답변이 한 글자도 없었다(store.front#104).
 * 첫 렌더의 필터는 "전체"라 서버 HTML 에는 항상 모든 질문·답변이 들어간다.
 */
export default function FaqList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredFaqs = faqData.filter(
    (faq) => selectedCategory === "전체" || faq.category === selectedCategory
  );

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <SegmentedControl
          name="faq-category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
      </div>

      {filteredFaqs.length === 0 ? (
        <p className="text-muted" style={{ fontSize: 14 }}>
          해당 카테고리에 등록된 질문이 없습니다.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
          {filteredFaqs.map((faq) => (
            <li key={faq.id} style={{ borderBottom: "1px solid var(--color-divider)" }}>
              <details className="faq-item">
                <summary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "20px 4px",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  <span className="tag" style={{ flexShrink: 0, fontSize: 11 }}>
                    {faq.category}
                  </span>
                  <span style={{ flex: 1 }}>{faq.question}</span>
                  <span
                    className="faq-toggle"
                    aria-hidden="true"
                    style={{ fontSize: 20, fontWeight: 300, color: "var(--color-muted)" }}
                  />
                </summary>
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
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
