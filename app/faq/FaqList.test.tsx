import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildFaqJsonLd, faqData } from "./data";
import FaqList from "./FaqList";

describe("FAQ 서버 렌더(store.front#104)", () => {
  it("스크립트 없이 받은 HTML 에 모든 답변 문구가 들어 있다", () => {
    // 크롤러가 받는 HTML 은 > ' 등을 엔티티로 바꿔 싣는다 — 원문과 비교하려고 되돌린다.
    const html = renderToString(<FaqList />)
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
    for (const faq of faqData) {
      expect(html).toContain(faq.answer);
      expect(html).toContain(faq.question);
    }
  });

  it("답변은 접힌 <details> 안에 렌더된다", () => {
    const { container } = render(<FaqList />);
    const items = container.querySelectorAll("details.faq-item");
    expect(items).toHaveLength(faqData.length);
    items.forEach((d) => expect(d.hasAttribute("open")).toBe(false));
    expect(screen.getByText(faqData[0].question)).toBeTruthy();
  });
});

describe("buildFaqJsonLd", () => {
  it("화면과 같은 질문·답변을 그대로 싣는다", () => {
    const ld = buildFaqJsonLd(faqData);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(faqData.length);
    ld.mainEntity.forEach((q, i) => {
      expect(q.name).toBe(faqData[i].question);
      expect(q.acceptedAnswer.text).toBe(faqData[i].answer);
    });
  });
});
