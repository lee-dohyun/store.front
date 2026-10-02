"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const CUSTOMER_BASE_URL = process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL ?? "https://customer.posselect.com";

interface WishlistState {
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => void;
}

const WishlistContext = createContext<WishlistState | null>(null);

/**
 * 메인 페이지 상품 카드의 찜 상태(gateway#304).
 *
 * 쓰기는 브라우저에서 같은 출처의 `/api/wishlists/**` 로 직접 보낸다. 게이트웨이가 이 경로만
 * product-api 로 넘기고(`product-api-wishlist-home`) 쿠키를 검증해 사용자를 식별한다.
 * **Server Action / route handler 로 바꾸지 말 것** — 이 호스트의 다른 쓰기 요청은 게이트웨이가
 * 전부 403 으로 끊는다(AGENTS.md 함정 2).
 *
 * 로그인 여부는 따로 묻지 않는다: 찜 ID 조회가 실패하면(비로그인이면 400) 비로그인으로 보고,
 * 하트를 누르면 로그인 화면으로 보낸다.
 */
export function WishlistProvider({
  children,
  navigate = (href: string) => window.location.assign(href),
}: {
  children: ReactNode;
  navigate?: (href: string) => void;
}) {
  const [ids, setIds] = useState<ReadonlySet<number>>(new Set());
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/wishlists/product-ids", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: number[] | null) => {
        if (cancelled || !Array.isArray(data)) return;
        setLoggedIn(true);
        setIds(new Set(data));
      })
      .catch(() => {
        // 찜은 부가 기능이다 — 조회가 안 되면 빈 하트로 두고 페이지는 그대로 쓴다.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    (productId: number) => {
      if (!loggedIn) {
        navigate(`${CUSTOMER_BASE_URL}/login?redirect_uri=${encodeURIComponent(window.location.href)}`);
        return;
      }
      const wasWishlisted = ids.has(productId);
      const apply = (wishlisted: boolean) =>
        setIds((prev) => {
          const next = new Set(prev);
          if (wishlisted) next.add(productId);
          else next.delete(productId);
          return next;
        });

      // 먼저 화면을 바꾸고, 서버가 거절하면 되돌린다.
      apply(!wasWishlisted);
      const request = wasWishlisted
        ? fetch(`/api/wishlists/${productId}`, { method: "DELETE", credentials: "include" })
        : fetch(`/api/wishlists?productId=${productId}`, { method: "POST", credentials: "include" });
      request
        .then((res) => {
          if (!res.ok) apply(wasWishlisted);
        })
        .catch(() => apply(wasWishlisted));
    },
    [ids, loggedIn, navigate],
  );

  const value = useMemo<WishlistState>(() => ({ isWishlisted: (id) => ids.has(id), toggle }), [ids, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function WishlistButton({ productId, productName }: { productId: number; productName: string }) {
  const wishlist = useContext(WishlistContext);
  if (!wishlist) return null;
  const pressed = wishlist.isWishlisted(productId);

  return (
    <button
      type="button"
      className="wish-button"
      aria-pressed={pressed}
      aria-label={`${productName} ${pressed ? "찜 해제" : "찜하기"}`}
      onClick={() => wishlist.toggle(productId)}
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill={pressed ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
