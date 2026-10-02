"use client";

import { QuickMenu } from "@posselect/ui";

const iconProps = {
  width: 21,
  height: 21,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const CartIcon = () => (
  <svg {...iconProps}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

const HeadsetIcon = () => (
  <svg {...iconProps}>
    <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
    <path d="M21 16a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z" />
    <path d="M3 16a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" />
  </svg>
);

/**
 * 메인 페이지 플로팅 퀵메뉴(768px 이하에서는 하단 탭바).
 *
 * "최근 본 상품"은 넣지 않았다 — 데이터 부재로 미구현(store.front#37). 최근 본 상품은
 * posselect-shell 이 localStorage 에 기록하는데 localStorage 는 origin 단위라, 상품 상세가 있는
 * product.posselect.com 에서 쌓인 기록이 이 호스트(home.posselect.com)에서는 보이지 않는다.
 */
export default function HomeQuickMenu({
  navigate = (href: string) => window.location.assign(href),
}: {
  navigate?: (href: string) => void;
}) {
  return (
    <QuickMenu
      items={[
        { icon: <CartIcon />, label: "장바구니", onClick: () => navigate("https://product.posselect.com/cart") },
        { icon: <HeadsetIcon />, label: "고객센터", onClick: () => navigate("/faq") },
      ]}
      onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    />
  );
}
