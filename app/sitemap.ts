import type { MetadataRoute } from "next";
import { getNotices } from "@/app/notices/data";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml - 이 호스트(www.posselect.com)의 공개 페이지(gateway#332).
 *
 * 상품 상세는 product.posselect.com 에 있으므로 그 호스트의 /sitemap.xml 에 들어 있다. 검색엔진은
 * 사이트맵 안의 주소가 사이트맵과 같은 호스트여야 받아들이므로 여기 섞지 않고, public/robots.txt 에
 * 두 사이트맵을 모두 적어 알린다.
 * 비공개 화면(/profile)과 내부 경로(/api, /health)는 넣지 않는다. lastModified 는 공지 날짜처럼
 * 실제 데이터가 있을 때만 넣는다.
 */
const STATIC_PATHS = [
  "/",
  "/notices",
  "/faq",
  "/shipping",
  "/youth-policy",
  "/safe-trade",
  "/about",
  "/careers",
  "/partners",
  "/ads",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: (path === "/" ? "daily" : "monthly") as "daily" | "monthly",
      priority: path === "/" ? 1 : 0.5,
    })),
    ...getNotices().map((notice) => ({
      url: `${SITE_URL}/notices/${notice.id}`,
      lastModified: notice.date,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
