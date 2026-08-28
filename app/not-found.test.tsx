import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("app/not-found.tsx", () => {
  it("404 안내와 홈으로 가는 링크를 보여준다", () => {
    render(<NotFound />);

    expect(screen.getByText("페이지를 찾을 수 없습니다")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "홈으로 가기" })).toHaveAttribute("href", "/");
  });
});
