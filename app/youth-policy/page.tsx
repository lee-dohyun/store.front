import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "청소년보호정책 | PosSelect",
};

const ARTICLES = [
  {
    title: "1. 청소년 보호를 위한 기본 원칙",
    body: "PosSelect(이하 '회사')는 청소년이 유해한 환경으로부터 보호받고 건강하게 성장할 수 있도록 돕기 위해 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「청소년보호법」에 근거하여 청소년보호정책을 수립·시행하고 있습니다.",
  },
  {
    title: "2. 유해정보에 대한 청소년 접근 제한 및 관리 조치",
    body: "회사는 청소년이 아무런 제한 장치 없이 청소년 유해정보에 노출되지 않도록 청소년 유해매체물에 대해서는 별도의 인증 장치를 마련·적용하며, 청소년 유해정보가 노출되지 않도록 예방 차원의 조치를 강구하고 있습니다.",
  },
  {
    title: "3. 유해정보로부터의 청소년 보호를 위한 교육",
    body: "회사는 정보통신업무 종사자를 대상으로 청소년 보호 관련 법령 및 제재 기준, 유해정보 발견 시 대처 방법, 위반사항 처리에 대한 보고 절차 등을 교육하고 있습니다.",
  },
  {
    title: "4. 유해정보로 인한 피해 상담 및 고충 처리",
    body: "회사는 청소년 유해정보로 인한 피해 상담 및 고충 처리를 위한 전문 인력을 배치하여 그 피해가 확산되지 않도록 노력하고 있습니다. 하단에 명시된 청소년보호 책임자 및 담당자에게 연락하여 상담 및 고충 처리를 요청할 수 있습니다.",
  },
  {
    title: "5. 청소년보호 책임자 및 담당자",
    body: "[청소년보호 책임자]\n- 성명: 이도현\n- 직위: 개인정보/청소년보호 책임자\n- 전화번호: 1588-0000\n- 이메일: privacy@posselect.com",
  },
];

export default function YouthPolicyPage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>청소년보호정책</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          시행일자 2026. 8. 13.
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
