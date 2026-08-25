"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 세그먼트 에러 바운더리 (app/error.tsx).
 *
 * 이 파일이 없으면 page.tsx 렌더 중 예외가 루트 레이아웃을 죽이고 Next.js 기본
 * 500 화면(브랜딩 없음)이 노출된다. layout.tsx의 header/footer shell은 살아있고
 * 이 컴포넌트만 해당 세그먼트를 대체한다.
 *
 * 주의: 게이트웨이가 이 호스트의 POST/PUT 등을 403으로 막으므로 Server Action 금지.
 * reset()은 클라이언트 렌더 + RSC GET이라 영향 없음.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러가 error boundary로 잡혔다는 사실을 콘솔에 남긴다.
    // 운영에서 Loki/Promtail이 stderr를 수집하므로 별도 외부 전송 없이도 관측 가능.
    console.error("[store.front/error]", error.digest, error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "var(--space-8)",
        textAlign: "center",
        color: "var(--color-text)",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          marginBottom: "var(--space-4)",
          lineHeight: 1,
        }}
      >
        😕
      </div>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "var(--space-2)",
          fontFamily: "var(--font-heading)",
        }}
      >
        일시적인 오류가 발생했습니다
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-muted)",
          marginBottom: "var(--space-6)",
          maxWidth: "400px",
        }}
      >
        페이지를 불러오는 중 문제가 생겼습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <button
        id="error-retry-btn"
        onClick={reset}
        style={{
          padding: "var(--space-2) var(--space-6)",
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
