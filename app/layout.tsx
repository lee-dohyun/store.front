import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { rootMetadata, siteJsonLd } from "@/lib/site";

// title 템플릿·metadataBase·공유 미리보기 기본값은 lib/site.ts 한 곳에서 관리한다(store.front#103).
export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <JsonLd data={siteJsonLd} />
        <Script src="https://shell.posselect.com/v1/header.js" strategy="beforeInteractive" />
        <posselect-header />
        {children}
        <Script src="https://shell.posselect.com/v1/footer.js" strategy="beforeInteractive" />
        <posselect-footer />
      </body>
    </html>
  );
}
