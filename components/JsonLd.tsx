/**
 * 구조화 데이터(JSON-LD)를 서버 HTML 에 그대로 싣는다. 스크립트를 실행하지 않는 크롤러도 읽을 수 있다.
 *
 * `<` 를 < 로 바꾸는 이유: 값에 "</script>" 가 들어가면 태그가 거기서 끝나 HTML 이 깨진다(주입 경로).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
