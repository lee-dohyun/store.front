"use client";

import { Field, Input, Textarea, Button } from "@posselect/ui";

export default function AdsPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("광고 문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
  };

  return (
    <main style={{ minHeight: "60vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>광고 문의</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          다양한 고객층을 타겟으로 효과적인 광고 캠페인을 진행해보세요.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="회사명/브랜드명">
            <Input placeholder="회사명 또는 브랜드명을 입력해주세요" required />
          </Field>
          <Field label="담당자 이름">
            <Input placeholder="담당자 이름을 입력해주세요" required />
          </Field>
          <Field label="연락처">
            <Input type="tel" placeholder="연락처를 입력해주세요" required />
          </Field>
          <Field label="이메일">
            <Input type="email" placeholder="이메일을 입력해주세요" required />
          </Field>
          <Field label="광고 목적 및 내용">
            <Textarea placeholder="진행하고자 하는 광고의 목적, 예산 규모, 기간 등을 적어주세요." rows={5} required />
          </Field>
          <div style={{ marginTop: 16 }}>
            <Button type="submit" variant="primary" style={{ width: "100%" }}>광고 문의하기</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
