import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ErrorBoundary from "./error";

// error.tsx는 재시도에서 `router.refresh()`를 부른다(캐시된 RSC 페이로드를 다시 받기 위해).
// jsdom에는 Next의 라우터 컨텍스트가 없으므로 훅 자체를 대체해 호출 여부만 본다.
const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

describe("app/error.tsx", () => {
  beforeEach(() => {
    refresh.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("Next 기본 에러 화면 대신 안내 문구와 재시도 버튼을 보여준다", () => {
    render(<ErrorBoundary error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.getByText("일시적인 오류가 발생했습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
  });

  it("재시도는 reset()과 router.refresh()를 함께 호출한다", () => {
    // reset()만으로는 서버 컴포넌트가 던진 예외가 되살아나지 않는다 —
    // 캐시된 RSC 페이로드를 다시 그려 같은 에러가 재현되므로 refresh()가 반드시 같이 필요하다.
    const reset = vi.fn();
    render(<ErrorBoundary error={new Error("boom")} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(reset).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("digest가 있으면 사용자가 제보할 수 있게 오류 코드로 노출한다", () => {
    const error = Object.assign(new Error("boom"), { digest: "abc123" });
    render(<ErrorBoundary error={error} reset={vi.fn()} />);

    expect(screen.getByText("오류 코드: abc123")).toBeInTheDocument();
  });

  it("digest가 없으면 오류 코드 줄을 그리지 않는다", () => {
    render(<ErrorBoundary error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.queryByText(/오류 코드/)).not.toBeInTheDocument();
  });
});
