import { describe, expect, it } from "vitest";
import { getNotices } from "@/app/notices/data";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("대표 호스트(www) 주소만 담는다", () => {
    expect(urls.every((u) => u.startsWith("https://www.posselect.com/"))).toBe(true);
  });

  it("공개 페이지와 공지 상세를 담고 비공개 화면은 뺀다", () => {
    expect(urls).toContain("https://www.posselect.com/");
    expect(urls).toContain("https://www.posselect.com/faq");
    expect(urls).toHaveLength(new Set(urls).size);
    for (const n of getNotices()) expect(urls).toContain(`https://www.posselect.com/notices/${n.id}`);
    expect(urls.some((u) => u.includes("/profile") || u.includes("/api") || u.includes("/health"))).toBe(false);
  });
});
