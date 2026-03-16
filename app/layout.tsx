import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "./neo.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kyu-niverse.com"),
  title: "큐니버스 🌏",
  description: "큐시코 유니버스에는 무엇이 있을까?",
  keywords: ["개발", "운동", "책", "자기개발"],
  icons: {
    icon: "/kyucon.ico",
  },

  openGraph: {
    title: "큐니버스 🌏",
    description: "큐시코 유니버스에는 무엇이 있을까?",
    locale: "ko_KR",
    type: "website",
    images: {
      url: "/kyuniverse.jpg",
      alt: "큐니버스 og 이미지 ",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
