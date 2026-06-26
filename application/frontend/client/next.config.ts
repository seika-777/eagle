import path from "path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// admin / client / room-tool で共通の env を frontend 直下（親ディレクトリ）から読み込む。
// 各アプリ個別の .env.local は置かず、application/frontend/.env.local に集約する。
// forceReload=true（第4引数）: Next が起動時に個別ディレクトリで loadEnvConfig を
// 先に呼びキャッシュするため、forceReload しないと親ディレクトリ指定が無視される。
const sharedEnvDir = path.resolve(process.cwd(), "..");
const { combinedEnv } = loadEnvConfig(sharedEnvDir, process.env.NODE_ENV !== "production", undefined, true);

// loadEnvConfig は Node サーバの process.env を埋めるが、NEXT_PUBLIC_* はコンパイル時
// インラインで「プロジェクト直下」の env しか参照しないため、env キーで明示的にインラインする。
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: combinedEnv?.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: combinedEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
