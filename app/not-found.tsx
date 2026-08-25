import Link from "next/link";

/**
 * 없는 경로 접근 시 표시되는 화면 (app/not-found.tsx).
 *
 * 이 파일이 없으면 Next.js 기본 404 화면(브랜딩 없음)이 그대로 노출된다.
 * app/error.tsx와 달리 Server Component로 만들 수 있다(예외를 잡는 게 아니라 not-found를 처리).
 */
export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "var(--space-8)",
        textAlign: "center",
        color: "var(--color-text)",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          fontWeight: 800,
          color: "var(--color-accent)",
          fontFamily: "var(--font-heading)",
          lineHeight: 1,
          marginBottom: "var(--space-2)",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "var(--space-2)",
          fontFamily: "var(--font-heading)",
        }}
      >
        페이지를 찾을 수 없습니다
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-muted)",
          marginBottom: "var(--space-6)",
          maxWidth: "400px",
        }}
      >
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        id="not-found-home-link"
        href="/"
        style={{
          padding: "var(--space-2) var(--space-6)",
          background: "var(--color-accent)",
          color: "#fff",
          borderRadius: "var(--radius-sm)",
          fontSize: "14px",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
