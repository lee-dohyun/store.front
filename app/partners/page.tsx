"use client";

import { Field, Input, Textarea, Button } from "@posselect/ui";

export default function PartnersPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("입점 문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
  };

  return (
    <main style={{ minHeight: "60vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 4 }}>입점 문의</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          PosSelect와 함께 비즈니스를 키워갈 파트너를 모십니다.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="회사명">
            <Input placeholder="회사명을 입력해주세요" required />
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
          <Field label="문의 내용">
            <Textarea placeholder="취급하시는 주요 상품과 입점 관련 문의사항을 상세히 적어주세요." rows={5} required />
          </Field>
          <div style={{ marginTop: 16 }}>
            <Button type="submit" variant="primary" style={{ width: "100%" }}>문의 접수하기</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
