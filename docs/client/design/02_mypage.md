# マイページ画面 設計

## 概要

ログイン中ユーザー（role = `general` / `admin`）が利用するマイページ。
レギュレーションごとに自分の **ゆとシート URL・備考** を登録でき、
**最新レギュレーション** のレベルキャップスケジュールとゆとシート JSON をもとに **成長指示** を表示する。

---

## 画面構成

| 画面       | パス      | 説明                          |
| ---------- | --------- | ----------------------------- |
| マイページ | `/mypage` | ゆとシート設定 + 成長指示表示 |

### ページ・コンポーネント構成

```
app/mypage/
└── page.tsx                              # マイページ（"use client"）

component/
├── templates/
│   └── MyPageTemplate.tsx                # マイページ全体レイアウト
└── organisms/
    └── mypage/
        ├── RegulationSheetForm.tsx       # レギュレーションごとのゆとシートURL・備考編集
        └── GrowthGuide.tsx               # 最新レギュレーションの成長指示表示
```

### 画面レイアウト（概念図）

```
┌──────────────────────────────────────────────┐
│ ヘッダー（表示名 / ログアウト）              │
├──────────────────────────────────────────────┤
│ ■ ゆとシート設定                             │
│   レギュレーション一覧（日程登録ありが対象）  │
│   ┌──────────────────────────────────────┐  │
│   │ 第N期  ゆとシートURL [____] 備考[__]  │  │
│   │                              [保存]   │  │
│   └──────────────────────────────────────┘  │
│                                              │
│ ■ 成長指示（最新レギュレーション）          │
│   キャラクター名: XXXX                        │
│   ゆとシートURL: [リンク（別タブ）]          │
│   - 経験点 +1200 点                           │
│   - 成長 3 回                                 │
│   - 報酬金額 5000 G                           │
│   - 名誉点 40 点                              │
└──────────────────────────────────────────────┘
```

---

## ゆとシート設定（URL・備考の登録）

`RegulationSheetForm` で、各レギュレーションに対し本人の **ゆとシート URL** と **備考** を保存する。

- 対象レギュレーション一覧 = 「`level_cap_schedule` が空配列でない（日程登録あり）」レギュレーション（後述「最新レギュレーション判定」と同じ条件で絞り込み、最新のものまで）。
- 保存先 = `user_regulation_sheets`（[03_migration.md](./03_migration.md)）。`UNIQUE(user_id, regulation_id)` で upsert。
- 保存は `/api/mypage`（PUT）経由（Service Role Key・本人スコープ）。フロントは秘密鍵を持たない。

### 画面文言（MYPAGE）

```typescript
// const/pages/MYPAGE.tsx
export const MYPAGE: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "マイページ",
    SHEET_SECTION: "ゆとシート設定",
    URL_LABEL: "ゆとシートURL",
    CHARACTOR_ROLE_LABEL: "備考",
    SAVE: "保存",
    SAVED: "保存しました",
    GUIDE_SECTION: "成長指示",
    CHARACTER_NAME: "キャラクター名",
    SHEET_LINK: "ゆとシートを開く",
    GUIDE_EXP: "経験点",
    GUIDE_GROWTH: "成長",
    GUIDE_REWARD: "報酬金額",
    GUIDE_HONOR: "名誉点",
    GUIDE_NONE: "現在、成長指示はありません",
    NO_LATEST: "対象のレギュレーションがありません",
  },
  VALUE: {
    UNIT_EXP: "点",
    UNIT_GROWTH: "回",
    UNIT_REWARD: "G",
    UNIT_HONOR: "点",
    // JSONP 取得用のコールバッククエリ。コールバック名はサーバー固定の安全な定数（英数字のみ）。
    // ユーザー入力は一切使わない（コールバック名インジェクション防止）。サーバー側で付与する。
    YUTOSHEET_JSONP_QUERY: "&callback=ytsheetJsonp",
  },
} as const;
```

---

## データ取得フロー（成長指示）

成長指示は以下の順序で算出・表示する。

```
1. 最新レギュレーション判定
   - regulation_items のうち level_cap_schedule が空配列でない（日程登録あり）もので最新（id 最大）を取得
2. ゆとシートURL取得
   - user_regulation_sheets から (本人 user_id, 最新 regulation_id) のレコードを取得
   - URL 未登録なら成長指示は表示せず「ゆとシート設定」へ誘導
3. ゆとシートJSON fetch
   - URL に "&callback=ytsheetJsonp"（サーバー固定のコールバック名）を付与し、API Route /api/yutosheet 経由でサーバーサイド取得（CORS 回避・JSONP 形式）
   - サーバーは取得した JSONP レスポンス本文からコールバックラッパーを文字列処理で除去し JSON.parse する（eval/Function/動的script は使わない）
4. 現在のレベルキャップ解決
   - 今日の日付が level_cap_schedule のどの level 区間に属するかを判定
   - その belt_type + level の level_cap 行（min_exp / min_growth / min_reward / min_honor / exp_diff）を取得
5. 成長指示計算
   - ゆとシート JSON の expTotal / historyGrowTotal / historyMoneyTotal / historyHonorTotal と
     level_cap のしきい値を比較して 4 条件を算出
6. 表示
   - キャラクター名 / ゆとシートURL（別タブ）/ 成長指示
```

### CORS・サーバーサイド取得方針（重要）

ゆとシート JSON はブラウザから外部サイト（`https://yutorize.2-d.jp/...`）への直接 fetch になり、
**CORS で失敗する可能性が高い**。したがって **API Route 経由のプロキシ取得を推奨・採用** する。

```
ブラウザ → /api/yutosheet?url=<ゆとシートURL> （同一オリジン）
         → サーバーがゆとシートURL + "&callback=ytsheetJsonp" を fetch（JSONP 形式）
         → サーバーが JSONP ラッパーを文字列処理で除去し JSON.parse（eval/Function/script 不使用）
         → 必要フィールドだけを抽出して返却
```

- `/api/yutosheet` は GET。クエリ `url` を受け取り、許可ドメイン（`yutorize.2-d.jp`）のみ通す（SSRF 対策）。**URL 検証アルゴリズムは後述「## セキュリティ要件」を必ず参照**（保存時 `/api/mypage` PUT・表示時 href 設定・03_migration.md からも本ロジックを共有する）。
- `&callback=ytsheetJsonp` はサーバー側で付与する（クエリの重複付与を避けるため URL を正規化）。コールバック名は**サーバー固定の安全な定数（英数字のみ）**であり、**ユーザー入力を一切使わない**（コールバック名インジェクション防止）。S-1 検証を通したあとにサーバー側でクエリを付与する。
- サーバーは取得した JSONP レスポンス本文（`ytsheetJsonp({...JSON...})` または `ytsheetJsonp({...});` 形式）から、**`eval` / `Function` / `<script>` 実行を一切使わず**、コールバックラッパー（先頭の `ytsheetJsonp(` と末尾の `)` / `);`）を文字列処理で除去し、内側を `JSON.parse` する。
- 取得失敗・パース失敗（想定したラッパー形式でない・`JSON.parse` 失敗）はいずれも 502 `{ error, code: "UPSTREAM_ERROR" }`。
- レスポンスは外部 JSON 全体・生テキスト（生の JSONP 文字列を含む）を転送せず、後述「## セキュリティ要件」のホワイトリストフィールドのみ返却する。

---

## 最新レギュレーション判定ロジック

「マイページ上での最新レギュレーション」は **`level_cap_schedule` の登録があるもの** を最新とする。
ゆとシートの紐づけ対象も同条件で最新のものまでとする。

```
// 擬似コード（実装ではない）
latest = regulation_items
  .filter(r => Array.isArray(r.level_cap_schedule) && r.level_cap_schedule.length > 0)
  .sort((a, b) => b.id - a.id)[0]   // id 最大を最新とする
```

> 既存 `getRegulationItems("latest")`（`const/function/getRegulationItems.ts`）は「id 最大」を最新としていたが、
> 本機能ではこれを流用せず、**`level_cap_schedule` 非空** で絞り込んだ上で id 最大を採る
> 専用関数 `getLatestScheduledRegulation` を新設する（既存関数の挙動を壊さないため）。

---

## 現在のレベルキャップ解決（区間判定）

`level_cap_schedule` は `[{ "levelCapId": number, "level": string, "date": "YYYY-MM-DD" }]`。
今日の日付がどの level の区間に属するかで対象 level を決定する。

> 例: レベル5が 5/1、現在 5/10、レベル6が 6/1 の場合 → 「レベル5」の値を取得（= 現在日付が属する行の値）。

```
// 擬似コード（実装ではない）
// 1. schedule を date 昇順にソート
sorted = schedule.sort((a, b) => a.date <= b.date ? -1 : 1)
today  = 現在日付（YYYY-MM-DD）

// 2. 「date <= today」を満たす最後の要素が現在区間
current = null
for entry of sorted:
  if entry.date <= today:
    current = entry        // より新しい開始日で上書き
  else:
    break                  // ソート済みなので以降は未来

// 3. current が null（最初の日程より前）の場合の扱い
//    → 「まだレベルキャップ未開始」とみなし成長指示は表示しない（GUIDE_NONE）
if current == null: 成長指示なし

// 4. current.level と レギュレーションの belt_type（regulation_items.level_cap_belt）で
//    level_cap 行を一意に特定（UNIQUE(belt_type, level)）
levelCapRow = level_cap.find(belt_type == regulation.levelCapBelt && level == current.level)
```

> **belt_type の取得元**: レギュレーションの `level_cap_belt`（`'B'` / `'C'`）を使う。
> `level_cap` は `UNIQUE(belt_type, level)` のため `belt_type` + `level` で一意。

---

## 成長指示の計算ロジック（Issue の 4 条件）

最新レギュレーションのゆとシート JSON から取得した値と、現在のレベルキャップ行のしきい値を比較する。

| 条件                             | 表示                                          |
| -------------------------------- | --------------------------------------------- |
| `expTotal < min_exp`             | 経験点「+（`exp_diff` の値）」点              |
| `historyGrowTotal < min_growth`  | 成長「`min_growth - historyGrowTotal`」回     |
| `historyMoneyTotal < min_reward` | 報酬金額「`min_reward - historyMoneyTotal`」G |
| `historyHonorTotal < min_honor`  | 名誉点「`min_honor - historyHonorTotal`」点   |

> **経験点だけ差が `exp_diff`（差分カラム）固定** な点に注意。他 3 つは「しきい値 − 現在値」の不足分。
> ただし `exp_diff` は nullable（先頭レベルは「直前レベルとの差分」が定義できず null）。
> **先頭レベルでは `exp_diff` が null のため経験点指示は出ない**（null は評価しない）。
> `min_growth` / `min_honor` も nullable で、`null` の場合はその条件を **評価しない**（指示を出さない）。
> `exp_diff` も `min_growth`/`min_honor` と同様に null 非評価とする。

```typescript
// 計算ロジック（型サンプル・擬似コード。実装コードではない）
// 配置: const/function/calcGrowthGuide.ts

type GrowthGuideInput = {
  expTotal: number;
  historyGrowTotal: number;
  historyMoneyTotal: number;
  historyHonorTotal: number;
  minExp: number;
  minGrowth: number | null;
  minReward: number;
  minHonor: number | null;
  expDiff: number | null;
};

// 戻り値の型は GrowthGuideType（下記）
// 各条件を満たすときのみ要素を push する想定:
//   exp:    expDiff != null && expTotal < minExp    → { kind: "exp",    value: expDiff }
//   growth: minGrowth != null && grow < minGrowth   → { kind: "growth", value: minGrowth - historyGrowTotal }
//   reward: historyMoneyTotal < minReward           → { kind: "reward", value: minReward - historyMoneyTotal }
//   honor:  minHonor != null && honor < minHonor    → { kind: "honor",  value: minHonor - historyHonorTotal }
```

---

## ゆとシート JSON の取得方法・フィールド注記（重要・要確認）

### 取得方法

キャラクターシート URL に `&callback=<コールバック名>` を付与すると JSONP 形式（`<コールバック名>({...JSON...})`）で取得できる。
本機能ではコールバック名を**サーバー固定の安全な定数 `ytsheetJsonp`（英数字のみ）**とし、**ユーザー入力を一切使わない**（コールバック名インジェクション防止）。

```
例: https://yutorize.2-d.jp/ytsheet/sw2.5/?id=XXX&callback=ytsheetJsonp
レスポンス例: ytsheetJsonp({"characterName":"...", ...});
```

> サーバーは取得した JSONP レスポンスを **スクリプトとして実行せず**（`eval` / `Function` / 動的 `<script>` 禁止）、
> コールバックラッパー（先頭の `ytsheetJsonp(` と末尾の `)` / `);`）を文字列処理で除去し、内側を `JSON.parse` する。
> ラッパー形式でない・`JSON.parse` 失敗時は 502 `UPSTREAM_ERROR` 扱い（詳細は「## セキュリティ要件」S-2 / S-3）。

### フィールドの確度

| フィールド          | 用途           | 確度                             |
| ------------------- | -------------- | -------------------------------- |
| `characterName`     | キャラクター名 | **公式ドキュメントで確認済み**   |
| `expTotal`          | 総経験点       | **未確認**（公式一覧に記載なし） |
| `historyGrowTotal`  | 総成長回数     | **未確認**（公式一覧に記載なし） |
| `historyMoneyTotal` | 総報酬額       | **未確認**（公式一覧に記載なし） |
| `historyHonorTotal` | 総名誉点       | **未確認**（公式一覧に記載なし） |

> **注記（必読）**: `expTotal` / `historyGrowTotal` / `historyMoneyTotal` / `historyHonorTotal` の 4 フィールドは
> **公式ドキュメントの一覧に記載がなく、フィールド名・型・正確な意味が未確認**。
> 本設計では **Issue 記載のフィールド名をそのまま使用** するが、**実 JSON レスポンスでフィールドの存在・型を要確認** とする。
> これらは数値として扱う想定だが、**文字列（カンマ区切り等）の可能性** もあるため、
> 取得時に必ず数値変換する設計とする（後述のパース方針）。

### 型・パース方針（`any`/`unknown` 禁止に準拠）

ゆとシート JSON は外部由来でスキーマが保証されないため、`any`/`unknown` を使わず
`Record<string, string | number | boolean | null>` として受け、ランタイムチェック + 数値変換で取り込む。

```typescript
// const/type/mypage/YutosheetJsonType.ts
// マイページで使用する確定後の型（数値化済み）
export type YutosheetJsonType = {
  characterName: string;
  expTotal: number;
  historyGrowTotal: number;
  historyMoneyTotal: number;
  historyHonorTotal: number;
};
```

```typescript
// 取り込み方針（擬似・/api/yutosheet 内で実施）
// raw: Record<string, string | number | boolean | null>
// 数値フィールドはカンマ・空白を除去してから Number() 変換。NaN は 0 とみなす（または成長指示対象外）。
//
// toNumber(v):
//   if typeof v === "number" → v
//   if typeof v === "string" → Number(v.replace(/[,\s]/g, "")) || 0
//   else → 0
//
// characterName は文字列としてそのまま（存在しなければ空文字）。
```

> 数値が `0` 扱いになった場合、しきい値との比較で誤った指示を出す恐れがあるため、
> **実 JSON 確認後にフィールド名・型を確定** し、必要なら「フィールド欠落時は成長指示を非表示」にフォールバックする方針へ調整する。

---

## ゆとシート URL の別タブ表示

成長指示セクションのゆとシート URL は **別タブ遷移**（`target="_blank"` 相当 / `rel="noopener noreferrer"`）。
表示は人間向けの元 URL（クエリ無しの元 URL のまま。`&callback=` 等の JSONP 用クエリは付けない）を用いる。

> **XSS 注意**: href にユーザー入力 URL を設定するため、表示時にも後述「## セキュリティ要件」の URL 検証を通す。検証を通らない URL は **リンク化しない**（プレーンテキスト表示またはエラー）。`javascript:` / `data:` スキーム等の混入を防ぐ。

---

## 型定義サンプル（規約準拠の配置）

```typescript
// const/type/mypage/UserRegulationSheetType.ts
export type UserRegulationSheetType = {
  id: number;
  userId: string;
  regulationId: number;
  yutosheetUrl: string;
  note: string;
  updatedAt: string | null;
};
```

```typescript
// const/type/mypage/GrowthGuideType.ts
export type GrowthGuideKind = "exp" | "growth" | "reward" | "honor";

export type GrowthGuideItemType = {
  kind: GrowthGuideKind;
  value: number;
};

export type GrowthGuideType = {
  characterName: string;
  sheetUrl: string;
  items: GrowthGuideItemType[]; // 条件を満たした指示のみ
};
```

```typescript
// const/type/levelCap/LevelCapType.ts（既存に expDiff を追加）
export type LevelCapItemType = {
  // ...既存フィールド...
  minExp: number;
  minGrowth: number | null;
  minReward: number;
  minHonor: number | null;
  expDiff: number | null; // 追加: 直前行の min_exp との差分。先頭行は差分が定義できないため null（[03_migration.md] 参照）
  // ...
};
```

---

## DB 操作 / データ取得関数の責務一覧

| 関数 / 配置                                      | 責務                                                                                                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `const/function/getLatestScheduledRegulation.ts` | `level_cap_schedule` 非空のレギュレーションの最新（id 最大）を取得                                                                                       |
| `const/function/getUserRegulationSheet.ts`       | `/api/mypage`(GET) 経由で本人のゆとシート設定を取得（snake→camel 変換）                                                                                  |
| `const/function/resolveCurrentLevelCap.ts`       | 今日の日付が属する level 区間を判定し、`belt_type`+`level` から `level_cap` 行を取得（`Number()` で数値化）                                              |
| `const/function/calcGrowthGuide.ts`              | ゆとシート値 + level_cap しきい値から成長指示を算出                                                                                                      |
| `/api/mypage`(GET/PUT) route                     | 本人の `user_regulation_sheets` 取得・upsert（Service Role Key・本人スコープ）                                                                           |
| `/api/yutosheet`(GET) route                      | ゆとシート JSONP のプロキシ取得（`&callback=ytsheetJsonp` 付与）・ラッパー除去 → `JSON.parse`（eval/Function/script 不使用）・数値化・必要フィールド抽出 |

> 既存関数のパターンに準拠: snake_case → camelCase マッピング、数値は `Number()` 変換、エラーは `throw` し画面側は `useErrorHandler` で処理（`let ignore` 禁止）。

---

## セキュリティ要件

> 本セクションは client マイページ機能のセキュリティ設計の **正本**。
> 01_auth.md / 03_migration.md / 00_overview.md からは本セクションを参照する（詳細の重複記載を避ける）。
> 以下の擬似コードはすべて **設計上のイメージであり実装コードではない**。実装時は規約（`any`/`unknown` 禁止・絶対パス `@/`・型は `number | null` 等で正確に）に準拠すること。

### S-1. ゆとシート URL 検証（SSRF / XSS 共通ロジック）【最優先】

`/api/yutosheet`（取得時）・`/api/mypage` PUT（保存時）・表示時（href 設定時）の **3 経路すべて** で同一の URL 検証関数を共有する（配置例: `const/function/validateYutosheetUrl.ts`）。検証を通らない URL は、保存時 400 / 表示時はリンク化しない / 取得時 400 とする。

> **コールバッククエリ付与の順序**: `/api/yutosheet` では、まずユーザー入力 URL に対し本 S-1 検証を通し（不正なら 400）、**検証を通った URL に対してのみサーバー側で `&callback=ytsheetJsonp` を付与**する。コールバック名は固定の安全な定数（英数字のみ）であり、ユーザー入力を一切使わない（コールバック名インジェクション防止）。

検証アルゴリズム（**完全一致のホスト判定が肝。`includes`/`startsWith`/`endsWith` は禁止**）:

```
// 擬似コード（実装コードではない）。戻り値の型イメージ: URL | null（不正なら null）
// 配置: const/function/validateYutosheetUrl.ts

const ALLOWED_HOST = "yutorize.2-d.jp";

// 1. パース。失敗は不正（呼び出し側で 400 / リンク化しない）
let url: URL;
try {
  url = new URL(input);
} catch {
  return null; // パース失敗 → 不正
}

// 2. スキームは https のみ許可（http も不可）
if (url.protocol !== "https:") return null;
//    → これにより javascript: / data: / file: / gopher: / ftp: 等は自動的に弾かれる

// 3. ホストは小文字化したうえで「完全一致」のみ許可
//    includes / startsWith / endsWith は使わない（部分一致のすり抜けを防ぐ）
if (url.hostname.toLowerCase() !== ALLOWED_HOST) return null;

// 4. userinfo（username / password）付き URL は拒否
if (url.username !== "" || url.password !== "") return null;

// 5. 非標準ポートは拒否（https 既定の 443 以外。url.port は既定時 "" になる）
if (url.port !== "" && url.port !== "443") return null;

return url; // 妥当
```

**完全一致が必須な理由（`includes`/`startsWith`/`endsWith` 禁止）と弾くべき危険例**:

| 危険な入力例                                 | すり抜ける条件                                | 本ロジックでの判定                     |
| -------------------------------------------- | --------------------------------------------- | -------------------------------------- |
| `https://yutorize.2-d.jp.evil.com/`          | `startsWith("yutorize.2-d.jp")` だと通過      | ホスト完全一致でないため拒否           |
| `https://evil.com/?x=yutorize.2-d.jp`        | `includes("yutorize.2-d.jp")` だと通過        | ホストは `evil.com` のため拒否         |
| `https://evilyutorize.2-d.jp/`               | `endsWith` 系の甘い判定で通過                 | ホスト完全一致でないため拒否           |
| `http://yutorize.2-d.jp@169.254.169.254/`    | userinfo 詐称（実ホストは `169.254.169.254`） | https でない＋userinfo付きで二重に拒否 |
| `https://yutorize.2-d.jp@evil.com/`          | userinfo 詐称                                 | ホスト `evil.com`＋userinfo付きで拒否  |
| `javascript:alert(1)` / `data:text/html,...` | スキーム検証なしだと XSS                      | protocol が https でないため拒否       |
| `file:///etc/passwd` / `gopher://...`        | スキーム検証なしだと内部リソース読取          | protocol が https でないため拒否       |

> `javascript:` / `data:` の排除は **保存時 XSS の温床（別タブリンクの href にユーザー入力 URL を使う）** を断つために必須。S-1 は保存時・表示時の双方で適用する。

### S-2. プロキシ fetch の安全化（リダイレクト追跡禁止・内部IP拒否・リソース制限）【最優先】

`/api/yutosheet` の外部 fetch は以下を満たす。

- **リダイレクト追跡禁止**: fetch は `redirect: "manual"`。30x レスポンスはエラー（502 `UPSTREAM_ERROR`）扱いとし、追跡しない。
  - 目的: リダイレクト経由での内部 IP 到達・DNS リバインディングを防ぐ。
- **内部IP到達拒否**: 以下の帯域への到達を拒否する方針とする。IP リテラルの直接指定（ホスト名がドメインでなく IP）も拒否。
  - IPv4: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`
  - IPv6: `::1`（ループバック）, `fc00::/7`（ユニークローカル）
  - S-1 でホストを `yutorize.2-d.jp` 完全一致に限定しているため一次的には到達しないが、DNS 解決結果が内部 IP を指す（リバインディング）ケースに備え多重防御として明記。
- **リソース制限**:
  - `AbortController` でタイムアウト（例: 5〜10 秒）。超過で中断し 502。
  - 最大レスポンスサイズ上限（例: 1〜2MB）。ストリームを読みながら累積バイト数が上限超過した時点で中断し 502。
  - メソッドは **GET 固定**。
  - レスポンスの `Content-Type` は **JavaScript/JSON 系のみ許可**（`application/javascript` / `text/javascript` / `application/json`）。JSONP は JavaScript 系で返るため許可する。それ以外は 502。
- **外部レスポンスをスクリプトとして実行しない**: JSONP 本文は `eval` / `Function` / 動的 `<script>` 注入で実行してはならない。コールバックラッパーを**文字列処理で除去**し、内側を `JSON.parse` する。これにより取得元が悪意あるコードを返しても実行されない（コールバック名はサーバー固定の英数字定数で、ユーザー入力を含めない）。

```
// 擬似コード（実装コードではない）
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000); // 例: 8 秒
const res = await fetch(normalizedUrl, {
  method: "GET",
  redirect: "manual",        // 30x は追跡しない
  signal: controller.signal,
});
// res.status が 300〜399 → 502（リダイレクト拒否）
// res.headers Content-Type が JavaScript/JSON 系でない（application/javascript・text/javascript・application/json 以外）→ 502
// 本文読み取り中に累積バイト > MAX_BYTES → 中断して 502
//
// 取得した本文（JSONP）を eval/Function/動的script を一切使わずに処理する:
//   1. コールバックラッパー除去: 先頭 "ytsheetJsonp(" と末尾 ")" / ");" を文字列処理で除去
//   2. 内側を JSON.parse（失敗・ラッパー形式不一致 → 502 UPSTREAM_ERROR）
```

### S-3. プロキシ応答の最小化・エラー秘匿【Medium】

- プロキシは JSONP ラッパー除去 → `JSON.parse` 後に、以下 **ホワイトリストフィールドのみ** を抽出して返却する（外部 JSON 全体・生テキスト・生の JSONP 文字列の転送は禁止）。
  - `characterName` / `expTotal` / `historyGrowTotal` / `historyMoneyTotal` / `historyHonorTotal`
  - 数値フィールドは前述「型・パース方針」に従い数値化する。
- エラーレスポンスは共通の `{ error, code }` 形式に固定し、**upstream のステータス本文・スタックトレース・内部詳細を含めない**（`UPSTREAM_ERROR` / `BAD_REQUEST` 等の固定 code のみ）。

### S-4. 入力検証【Medium】

| 入力            | 検証                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `regulationId`  | 整数であること。さらに **対象レギュレーション集合（`level_cap_schedule` 登録あり）に属する**ことを確認（属さなければ 400 / 404）。 |
| `yutosheet_url` | 最大長 **2048 字**（超過で 400）。加えて S-1 の URL 検証を通す。                                                                   |
| `note`          | 最大長 **1000 字**（例。超過で 400）。                                                                                             |

### S-5. 本人スコープ・認可（参照）

`/api/mypage` の GET / PUT は **入力から user_id を受け取らず、セッション user_id のみ** で `.eq("user_id", sessionUserId)` する。role 判定はフェイルクローズの allowlist で行う。詳細は [01_auth.md](./01_auth.md)「## セキュリティ要件」を参照。

---

## 未確定・要確認事項

- ゆとシート JSON の 4 数値フィールド（`expTotal` 等）の **存在・型（数値/カンマ区切り文字列）が未確認**。実レスポンス確認後に確定し、欠落時のフォールバック（成長指示非表示）を決める。
- 現在日付が最初の日程より前のとき（レベルキャップ未開始）の表示方針（本設計では「成長指示なし」）。
- ゆとシート URL 未登録レギュレーションの扱い（設定セクションへ誘導、成長指示は非表示）。
- `&callback=ytsheetJsonp`（JSONP 用コールバッククエリ）の付与をサーバー側に一元化する前提（クエリ重複防止のため URL 正規化が必要）。コールバック名はサーバー固定の安全な定数（英数字のみ）でユーザー入力を含めない。
- ゆとシート側が返す JSONP ラッパーの正確な形式（末尾が `)` か `);` か、関数名前後の空白有無など）は実レスポンスで要確認。ラッパー除去は eval/Function/script を使わず文字列処理で行い、形式不一致・`JSON.parse` 失敗は 502 `UPSTREAM_ERROR` 扱い。
