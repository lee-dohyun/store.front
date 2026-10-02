import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { WishlistProvider, WishlistButton } from "./Wishlist";

type Call = { url: string; method: string };

/** `/api/wishlists/**` 만 흉내 내는 fetch. `idsStatus` 가 200 이 아니면 비로그인으로 본다. */
function mockFetch({ idsStatus = 200, ids = [] as number[], writeStatus = 200 } = {}) {
  const calls: Call[] = [];
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    calls.push({ url, method });
    if (method === "GET") {
      return { ok: idsStatus === 200, status: idsStatus, json: async () => ids } as Response;
    }
    return { ok: writeStatus === 200, status: writeStatus, json: async () => 1 } as Response;
  });
  vi.stubGlobal("fetch", fn);
  return calls;
}

function renderCards(navigate = vi.fn()) {
  render(
    <WishlistProvider navigate={navigate}>
      <WishlistButton productId={1} productName="사과" />
      <WishlistButton productId={2} productName="배" />
    </WishlistProvider>,
  );
  return navigate;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Wishlist", () => {
  it("marks the products the user already wishlisted", async () => {
    const calls = mockFetch({ ids: [2] });
    renderCards();

    await waitFor(() => expect(screen.getByRole("button", { name: "배 찜 해제" })).toHaveAttribute("aria-pressed", "true"));
    expect(screen.getByRole("button", { name: "사과 찜하기" })).toHaveAttribute("aria-pressed", "false");
    // 카드가 몇 장이든 조회는 한 번이다.
    expect(calls).toEqual([{ url: "/api/wishlists/product-ids", method: "GET" }]);
  });

  it("adds a product to the wishlist on click", async () => {
    const calls = mockFetch({ ids: [] });
    renderCards();
    await waitFor(() => expect(calls).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: "사과 찜하기" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "사과 찜 해제" })).toBeInTheDocument());
    expect(calls[1]).toEqual({ url: "/api/wishlists?productId=1", method: "POST" });
  });

  it("removes a wishlisted product on click", async () => {
    const calls = mockFetch({ ids: [2] });
    renderCards();
    const pressed = await screen.findByRole("button", { name: "배 찜 해제" });

    fireEvent.click(pressed);

    await waitFor(() => expect(screen.getByRole("button", { name: "배 찜하기" })).toBeInTheDocument());
    expect(calls[1]).toEqual({ url: "/api/wishlists/2", method: "DELETE" });
  });

  it("sends a logged-out user to login, coming back to the current page", async () => {
    const calls = mockFetch({ idsStatus: 400 });
    const navigate = renderCards();
    await waitFor(() => expect(calls).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: "사과 찜하기" }));

    expect(navigate).toHaveBeenCalledWith(
      `https://customer.posselect.com/login?redirect_uri=${encodeURIComponent(window.location.href)}`,
    );
    expect(calls).toHaveLength(1); // 쓰기 요청은 보내지 않는다
  });

  it("puts the heart back when the server rejects the change", async () => {
    const calls = mockFetch({ ids: [], writeStatus: 500 });
    renderCards();
    await waitFor(() => expect(calls).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: "사과 찜하기" }));

    await waitFor(() => expect(calls).toHaveLength(2));
    await waitFor(() => expect(screen.getByRole("button", { name: "사과 찜하기" })).toHaveAttribute("aria-pressed", "false"));
  });
});
