import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { buildFaqJsonLd, faqData } from "./data";
import FaqList from "./FaqList";

export const metadata = pageMetadata({
  title: "자주 묻는 질문",
  description: "배송·교환/반품·회원 관련 자주 묻는 질문과 답변",
  path: "/faq",
});

// 구조화 데이터는 화면과 같은 faqData 에서 만든다(store.front#104). 필터와 무관하게 전체 질문을 싣는다 —
// 서버 HTML 의 첫 화면도 "전체"라 화면에 보이는 내용과 일치한다.
export default function FAQPage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <JsonLd data={buildFaqJsonLd(faqData)} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 32 }}>자주 묻는 질문</h1>
        <FaqList />
      </div>
    </main>
  );
}
