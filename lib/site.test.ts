import { describe, expect, it } from "vitest";
import { pageMetadata, rootMetadata, SITE_URL, siteJsonLd } from "./site";

describe("pageMetadata", () => {
  it("페이지마다 자기 경로를 canonical·og:url 로 낸다", () => {
    const meta = pageMetadata({ title: "자주 묻는 질문", path: "/faq" });
    expect(meta.title).toBe("자주 묻는 질문");
    expect(meta.alternates?.canonical).toBe("/faq");
    expect(meta.openGraph?.url).toBe("/faq");
    expect(meta.openGraph?.title).toBe("자주 묻는 질문 | PosSelect");
  });

  it("openGraph 를 덮어도 공유 이미지·siteName 이 사라지지 않는다(얕은 병합 대비)", () => {
    const og = pageMetadata({ title: "x", path: "/x" }).openGraph as Record<string, unknown>;
    expect(og.siteName).toBe("PosSelect");
    expect(og.images).toHaveLength(1);
  });

  it("title 을 생략하면 layout 기본 제목을 덮지 않는다", () => {
    const meta = pageMetadata({ path: "/" });
    expect(meta).not.toHaveProperty("title");
    expect(meta.alternates?.canonical).toBe("/");
  });
});

describe("rootMetadata", () => {
  it("대표 호스트는 www.posselect.com 이고 layout 은 canonical 기본값을 내지 않는다", () => {
    expect(SITE_URL).toBe("https://www.posselect.com");
    expect(String(rootMetadata.metadataBase)).toBe("https://www.posselect.com/");
    expect(rootMetadata.alternates).toBeUndefined();
  });
});

describe("siteJsonLd", () => {
  it("Organization 은 확정된 필드(이름·주소·로고)만 갖는다", () => {
    const org = siteJsonLd["@graph"].find((n) => n["@type"] === "Organization")!;
    expect(Object.keys(org).sort()).toEqual(["@id", "@type", "logo", "name", "url"]);
    expect(org.url).toBe("https://www.posselect.com/");
  });

  it("WebSite 에는 검색 결과 URL 이 없으므로 SearchAction 을 넣지 않는다", () => {
    const site = siteJsonLd["@graph"].find((n) => n["@type"] === "WebSite")!;
    expect(site).not.toHaveProperty("potentialAction");
  });
});
