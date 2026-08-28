import type { Metadata } from "next";
import Link from "next/link";
import { BlueprintCorners, EmptyState } from "@posselect/ui";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | PosSelect",
};

/**
 * 404 화면.
 *
 * 에러 바운더리와 같은 이유로 넣는다 — 이 저장소엔 `not-found.tsx`도 없어서 없는 경로는 Next
 * 기본 화면이 나갔다. 이쪽은 장애가 아니라 오타·죽은 링크라 500과 문구/톤을 분명히 구분한다.
 * 서버 컴포넌트라 `"use client"`가 없다(재시도할 것이 없으므로 상호작용도 없다).
 *
 * @author leedohyun
 * @since 2026-08-22
 * @see {@link https://github.com/lee-dohyun/store.front/issues/57}
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px 96px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <EmptyState
          icon={<CompassIcon />}
          title="페이지를 찾을 수 없습니다"
          description="주소가 바뀌었거나 삭제된 페이지입니다."
          action={
            // Button은 <button>이라 <a> 안에 넣을 수 없다. 링크에 같은 .btn 클래스를 직접 입혀
            // 마크업은 앵커로 두면서 생김새만 primary 버튼과 맞춘다.
            <Link href="/" className="btn btn-primary blueprint">
              <BlueprintCorners />
              홈으로 가기
            </Link>
          }
        />
      </div>
    </main>
  );
}

/** 길을 잃었다는 은유. EmptyState 스토리들과 같은 40px 라인 아이콘 규격. */
function CompassIcon() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}
