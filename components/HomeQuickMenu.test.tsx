import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import HomeQuickMenu from "./HomeQuickMenu";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("HomeQuickMenu", () => {
  it("offers cart and customer-centre shortcuts", () => {
    render(<HomeQuickMenu />);
    expect(screen.getByRole("button", { name: "장바구니" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "고객센터" })).toBeInTheDocument();
  });

  it("navigates to the shortcut's destination on click", () => {
    const navigate = vi.fn();
    render(<HomeQuickMenu navigate={navigate} />);
    fireEvent.click(screen.getByRole("button", { name: "장바구니" }));
    expect(navigate).toHaveBeenCalledWith("https://product.posselect.com/cart");
    fireEvent.click(screen.getByRole("button", { name: "고객센터" }));
    expect(navigate).toHaveBeenCalledWith("/faq");
  });

  it("scrolls to the top from the top button", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<HomeQuickMenu />);
    fireEvent.click(screen.getByRole("button", { name: "맨 위로" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
