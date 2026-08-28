"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, EmptyState } from "@posselect/ui";

/**
 * 메인/하위 세그먼트 공용 에러 바운더리.
 *
 * 왜 필요한가: `app/page.tsx`의 조회 함수들은 실패를 삼키지 않고 **예외를 그대로 던진다**(#41,
 * 23e61a4). 예전처럼 `catch` 후 `[]`를 반환하면 netpol 차단·product.api 다운 같은 인프라 장애가
 * "상품 없음"으로 조용히 보여서 2026-08-20 장애를 며칠 못 알아챘다. 그래서 지금 동작이 맞다.
 * 다만 #55로 프리렌더가 사라진 뒤 그 예외는 **런타임에** 터지고, 이 저장소엔 에러 바운더리가
 * 하나도 없어서 방문자에게 Next 기본 500 화면이 그대로 나갔다. 이 파일은 그 화면만 갈아끼운다 —
 * **예외를 다시 삼키는 방향으로 되돌리지 말 것**(#41이 의도적으로 없앤 동작이다).
 *
 * @author leedohyun
 * @since 2026-08-22
 * @see {@link https://github.com/lee-dohyun/store.front/issues/57}
 */
// 이름을 `Error`로 두면 이 파일을 import 하는 쪽에서 전역 `Error` 생성자를 가려 버린다
// (실제로 테스트에서 `new Error(...)`가 이 컴포넌트를 부르는 사고가 났다). Next는 default export만
// 보므로 이름은 자유롭다.
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isRetrying, startRetry] = useTransition();

  // 서버 컴포넌트에서 던진 예외는 클라이언트로 메시지가 넘어오지 않고 digest만 남는다(프로덕션).
  // 브라우저 콘솔에 digest를 남겨 두면 사용자 제보와 서버 로그(Loki)를 이어 붙일 수 있다.
  useEffect(() => {
    console.error("[Home/ErrorBoundary] 페이지 렌더 실패 - 속성: { digest: ", error.digest, ", message: ", error.message, " }");
  }, [error]);

  /**
   * 서버 컴포넌트가 던진 예외는 `reset()`만으로는 되살아나지 않는다 — 캐시된 RSC 페이로드를
   * 다시 그리기 때문에 같은 에러가 그대로 재현된다. `router.refresh()`로 서버에서 다시 받아야 한다.
   * 둘 다 RSC **GET** 요청이라 게이트웨이의 쓰기 차단(POST/PUT/PATCH/DELETE → 403, AGENTS.md 함정 2)에
   * 걸리지 않는다. Server Action을 쓰면 여기서 프로덕션 403이 난다.
   */
  const retry = () => {
    startRetry(() => {
      router.refresh();
      reset();
    });
  };

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
          icon={<WarningIcon />}
          title="일시적인 오류가 발생했습니다"
          description="상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          action={
            <Button variant="primary" onClick={retry} disabled={isRetrying}>
              {isRetrying ? "다시 불러오는 중…" : "다시 시도"}
            </Button>
          }
        />

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/" className="text-muted" style={{ fontSize: 13 }}>
            홈으로 돌아가기
          </Link>
          {/* 반복 실패 시 사용자가 고객센터에 그대로 불러 줄 수 있는 값. 서버 로그와 맞춰 볼 때 쓴다. */}
          {error.digest && (
            <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>
              오류 코드: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

/** EmptyState 아이콘 자리에 들어가는 경고 표식. posselect-ui 스토리들과 같은 40px 라인 아이콘. */
function WarningIcon() {
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
      <path d="M12 3 1.5 21h21L12 3Z" />
      <path d="M12 9.5v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}
