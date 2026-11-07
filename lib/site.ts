import type { Metadata } from "next";

/**
 * 이 사이트의 대표 주소(canonical·og:url·JSON-LD 의 기준).
 *
 * home.posselect.com 과 www.posselect.com 이 같은 화면을 내는데, 대표는 www 로 정했다(lee-dohyun/gateway#369).
 * 값이 바뀌어도 코드를 고치지 않도록 환경변수로 덮을 수 있게 둔다. NEXT_PUBLIC_ 이라 빌드 시점에 굳는다.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.posselect.com";
export const SITE_URL = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;

export const SITE_NAME = "PosSelect";
export const SITE_DESCRIPTION = "검증된 상품만 엄선하는 PosSelect";

/** 공유 미리보기 이미지. layout 과 페이지가 같은 값을 써야 해서 여기에 둔다. */
const OG_IMAGE = {
  url: "https://image.posselect.com/cdn/logos/posselect-og-share.png",
  width: 1200,
  height: 630,
  alt: "PosSelect 대표 이미지",
};

/** 브랜드 마크(정사각 256×256 PNG). 파비콘·Organization 로고가 같은 자산을 쓴다. */
export const LOGO_URL = "https://image.posselect.com/cdn/favicons/favicon-transparent-red-256.png";

interface PageMetaInput {
  /** 템플릿 "%s | PosSelect" 에 들어갈 페이지 이름. 생략하면 layout 의 기본 제목("PosSelect")을 쓴다. */
  title?: string;
  description?: string;
  /** 사이트 루트 기준 경로("/faq"). metadataBase 와 합쳐져 절대 주소가 된다. */
  path: string;
}

/**
 * 페이지별 title·description·canonical·og:url 을 한 번에 만든다.
 *
 * Next 의 metadata 병합은 얕다 — 페이지가 openGraph 를 내면 layout 의 openGraph(이미지·siteName·locale)가
 * 통째로 사라진다. 그래서 페이지마다 손으로 쓰지 말고 이 함수로 공통 필드까지 같이 낸다.
 * canonical 을 layout 기본값으로 두지 않은 이유: 이 함수를 안 쓴 페이지(404 등)가 전부 "/" 를
 * canonical 로 물려받아 메인의 중복 페이지로 신고되기 때문이다.
 */
export function pageMetadata({ title, description = SITE_DESCRIPTION, path }: PageMetaInput): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/** layout 이 내는 사이트 공통 기본값. 페이지가 pageMetadata 로 덮는다. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  icons: { icon: LOGO_URL },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

/**
 * 사이트 엔티티 구조화 데이터(store.front#105).
 *
 * 확정된 값(이름·주소·로고)만 넣는다. 사업자 정보·주소·전화번호·contactPoint·sameAs 는 아직 확정된 값이 없어
 * 데이터 부재로 미포함이다(lee-dohyun/gateway#324) — 예시 값을 채우지 말 것.
 * WebSite.potentialAction(SearchAction)도 이 호스트에 검색 결과 URL 이 없어서 넣지 않는다.
 */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: LOGO_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
