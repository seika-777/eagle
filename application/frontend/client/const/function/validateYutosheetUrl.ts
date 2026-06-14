// ゆとシート URL 検証（SSRF / XSS 共通ロジック）【最優先・設計 S-1 の正本実装】
//
// 用途: 次の 3 経路すべてで本関数を共有する。
//   - /api/yutosheet（GET）: ゆとシート JSONP 取得時の SSRF 対策（検証通過後にサーバーが
//     &callback=ytsheetJsonp を付与する。検証 → 付与の順序を守る）。
//   - /api/mypage（PUT）: ゆとシート URL 保存時の入力検証（不正は 400）。
//   - 表示時: 成長指示の別タブリンク href 設定時（不正はリンク化しない。javascript:/data: 混入の防止）。
//
// 戻り値: 妥当なら URL、不正なら null。any/unknown は使用しない。

const ALLOWED_HOST = "yutorize.work";

export const validateYutosheetUrl = (input: string): URL | null => {
  // 1. パース。失敗は不正。
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  // 2. スキームは https のみ許可（http も不可）。
  //    これにより javascript: / data: / file: / gopher: / ftp: 等は自動的に弾かれる。
  if (url.protocol !== "https:") return null;

  // 3. ホストは小文字化したうえで「完全一致」のみ許可。
  //    includes / startsWith / endsWith は使わない（部分一致のすり抜けを防ぐ）。
  if (url.hostname.toLowerCase() !== ALLOWED_HOST) return null;

  // 4. userinfo（username / password）付き URL は拒否。
  if (url.username !== "" || url.password !== "") return null;

  // 5. 非標準ポートは拒否（https 既定の 443 以外。url.port は既定時 "" になる）。
  if (url.port !== "" && url.port !== "443") return null;

  return url;
};
