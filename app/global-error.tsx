"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 루트 레이아웃까지 죽은 경우의 최후 방어선 (app/global-error.tsx).
 *
 * layout.tsx 자체가 죽으면 app/error.tsx는 작동하지 않는다. 이 컴포넌트가 루트 레이아웃을
 * 완전히 대체하므로:
 * - shell(header/footer)이 로드되지 않는다.
 * - globals.css(@posselect/ui/tokens.css, @import tailwindcss)도 신뢰할 수 없다.
 *
 * 그래서 CSS 변수를 쓰지 않고 하드코딩된 인라인 스타일만 사용한다.
 * (이슈 #57 "함정 5" 참고)
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[store.front/global-error]", error.digest, error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: "#f8f8f8",
          color: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            maxWidth: "440px",
          }}
        >
          {/* 로고 — CDN 이미지가 아닌 텍스트로: 레이아웃이 죽은 상황에서 CDN도 신뢰 불가 */}
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#c0392b",
              marginBottom: "32px",
              letterSpacing: "-0.5px",
            }}
          >
            PosSelect
          </div>

          <div style={{ fontSize: "40px", marginBottom: "16px" }}>😕</div>

          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            서비스를 불러올 수 없습니다
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            일시적인 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>

          <button
            id="global-error-retry-btn"
            onClick={reset}
            style={{
              padding: "10px 28px",
              background: "#c0392b",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
