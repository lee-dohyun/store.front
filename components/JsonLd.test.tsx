import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JsonLd, { serializeJsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("값 안의 </script> 가 태그를 닫지 못하게 < 를 이스케이프한다", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).text).toBe("</script><script>alert(1)</script>");
  });

  it("application/ld+json 스크립트로 렌더한다", () => {
    const { container } = render(<JsonLd data={{ "@type": "Thing" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script!.innerHTML)).toEqual({ "@type": "Thing" });
  });
});
