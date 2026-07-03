import type { Metadata } from "next";
import "@/app/globals.scss";
import AppWrapper from "@/app/AppWrapper";
import { eduNswActCursive, zenMaruGothic } from "@/const/font/font";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { getOptions } from "@/const/function/getOptions";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const options = await getOptions();
  return {
    title: options.siteName,
    description: options.siteName,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const options = await getOptions();
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${eduNswActCursive.variable} ${zenMaruGothic.variable}`}
        style={{ backgroundColor: STYLE_COLOR.LIGHT, overflowX: "hidden" }}
      >
        <AppWrapper siteName={options.siteName}>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
