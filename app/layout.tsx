import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PosSelect",
  description: "검증된 상품만 엄선하는 PosSelect",
  icons: {
    icon: "https://image.posselect.com/cdn/favicons/favicon-transparent-red-256.png",
  },
  openGraph: {
    title: "PosSelect",
    description: "검증된 상품만 엄선하는 PosSelect",
    url: "https://home.posselect.com",
    siteName: "PosSelect",
    images: [
      {
        url: "https://image.posselect.com/cdn/logos/posselect-og-share.png",
        width: 1200,
        height: 630,
        alt: "PosSelect 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PosSelect",
    description: "검증된 상품만 엄선하는 PosSelect",
    images: ["https://image.posselect.com/cdn/logos/posselect-og-share.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Script src="https://shell.posselect.com/v1/header.js" strategy="beforeInteractive" />
        <posselect-header />
        {children}
        <Script src="https://shell.posselect.com/v1/footer.js" strategy="beforeInteractive" />
        <posselect-footer />
      </body>
    </html>
  );
}
