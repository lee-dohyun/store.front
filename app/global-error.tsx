"use client";

import { useEffect } from "react";

/**
 * 루트 레이아웃 자체가 죽었을 때의 최후 방어선.
 *
 * `app/error.tsx`는 루트 레이아웃 **안쪽**에서만 동작한다. `app/layout.tsx`나 거기서 불러오는
 * posselect-shell 스크립트가 렌더 중 터지면 그 바운더리는 잡지 못하고 다시 Next 기본 화면이 나간다.
 *
 * 이 파일이 토큰/컴포넌트를 하나도 쓰지 않는 이유: global-error는 루트 레이아웃을 **대체**하므로
 * `globals.css`가 실린다는 보장이 없다. 여기서 `var(--color-bg)` 같은 토큰을 쓰면 정의가 없을 때
 * 조용히 죽어(AGENTS.md 함정 5) 배경이 투명해지고 글자만 흐릿하게 남는다 — 하필 아무것도 못 믿는
 * 상황에서 화면이 한 번 더 깨지는 셈이다. 그래서 값은 tokens.css와 같은 색을 **리터럴로** 박았다.
 *
 * @author leedohyun
 * @since 2026-08-22
 * @see {@link https://github.com/lee-dohyun/store.front/issues/57}
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root/GlobalErrorBoundary] 루트 레이아웃 렌더 실패 - 속성: { digest: ", error.digest, ", message: ", error.message, " }");
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f2f2f3",
          color: "#1d1f20",
          fontFamily:
            '"Barlow", "Pretendard", -apple-system, "Malgun Gothic", system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            일시적인 오류가 발생했습니다
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: "12px 0 24px", opacity: 0.7 }}>
            페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "1px solid #234e95",
              background: "#234e95",
              color: "#f2f2f3",
              font: "inherit",
              fontSize: 14,
              padding: "9px 18px",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>

          <p style={{ fontSize: 13, marginTop: 20 }}>
            {/* next/link가 아니라 생짜 <a>인 것은 의도다. 루트 레이아웃이 깨진 상태에서는
                클라이언트 라우터 자체가 고장의 일부일 수 있으므로, 전체 새로고침으로
                앱을 처음부터 다시 세우는 편이 확실하다. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ color: "#234e95" }}>
              홈으로 돌아가기
            </a>
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, marginTop: 8, opacity: 0.55 }}>오류 코드: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
