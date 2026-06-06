import type { Metadata } from "next";
import "@/app/globals.scss";
import AppWrapper from "./AppWrapper";
import { zenMaruGothic } from "@/const/font/font";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { COMMON } from "@/const/common/COMMON";

export const metadata: Metadata = {
  title: COMMON.SITE_NAME,
  description: COMMON.SITE_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${zenMaruGothic.variable}`}
        style={{ backgroundColor: STYLE_COLOR.LIGHT }}
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
