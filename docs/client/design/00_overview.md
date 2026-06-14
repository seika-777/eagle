# client マイページ機能 全体設計

## 概要

Issue: https://github.com/seika-777/eagle/issues/45

`application/frontend/client/` の Next.js プロジェクトに、ログイン中ユーザー向けの **マイページ機能** を追加する。
ユーザーはレギュレーションごとに自分のゆとシート（キャラクターシート）URL・備考を登録でき、
最新レギュレーションのレベルキャップスケジュールとゆとシート JSON をもとに「成長指示」を確認できる。

admin 側（`docs/admin/design/`）と同じ Supabase データベース・認証方式（Supabase Auth + `user_meta`）を共有する。

---

## 実装機能一覧

| # | 機能 | 設計ファイル |
|---|------|------------|
| 1 | ログイン／認証・ロール制御 | [01_auth.md](./01_auth.md) |
| 2 | マイページ画面 | [02_mypage.md](./02_mypage.md) |
| 3 | DB 変更（差分カラム追加・ユーザー別ゆとシート設定テーブル） | [03_migration.md](./03_migration.md) |

---

## ベータ版に関する方針（重要）

本機能は **ベータ版** としてリリースする。以下の制約を設ける。

- **ナビゲーション等に「ログイン画面（`/login`）への遷移ボタン」は設置しない。**
  ユーザーは `/login` を **直接 URL でアクセス** する想定。トップページ・ヘッダー・フッター等からの導線は本リリースでは追加しない。
- ただし以下は本 Issue で実装する。
  - ログイン画面（`/login`）
  - Supabase 認証（ユーザー ID + パスワード）
  - ロール（`general` / `admin`）による マイページ表示制御
  - 認証ガード（`middleware.ts`）
- マイページ（`/mypage`）も直接 URL アクセスを想定する。未認証・権限外のアクセスは `middleware.ts` で `/login` へリダイレクトする（詳細は [01_auth.md](./01_auth.md)）。

> この「ログイン導線を設けない」方針は本 00_overview.md と [01_auth.md](./01_auth.md) の両方に明記する。将来の正式版でナビゲーションへのログイン導線追加を検討する。

---

## 技術スタック

`application/frontend/client/package.json`（version `"0.1.0"`）の実値に基づく。

| カテゴリ | 技術・バージョン |
|---------|------|
| フレームワーク | Next.js `^16.1.6`（App Router / `next dev --turbopack`） |
| UI ライブラリ | React `19.1.0` / react-dom `19.1.0` |
| 言語 | TypeScript `^5` |
| UI | @chakra-ui/react `^3.33.0` + @emotion/react `^11.14.0` |
| アイコン | react-icons `^5.5.0` |
| スタイル | sass `^1.90.0` |
| DB クライアント | @supabase/supabase-js `^2.106.2` |
| 認証 | Supabase Auth（ユーザー ID + パスワード）+ `user_meta` テーブル |

> **新規追加が必要な依存**: `middleware.ts` の認証ガードで `@supabase/ssr` の `createServerClient`（Edge Runtime 対応）を使用する。
> admin 側と同様、client の `package.json` に `@supabase/ssr` を追加する（現状未導入）。バージョンは実装時に admin 側のロックと揃える。

---

## 現状（追加が必要なファイル）

client には現状、以下が **存在しない**。本 Issue で追加する。

| パス | 用途 | 状態 |
|------|------|------|
| `middleware.ts` | 認証ガード（Edge Runtime） | 新規 |
| `lib/supabaseAdmin.ts` | API Route 用（Service Role Key）。**API Route からのみ import 可。`"use client"`・`middleware.ts` からは import 禁止** | 新規 |
| `app/login/page.tsx` | ログイン画面 | 新規 |
| `app/mypage/page.tsx` | マイページ画面 | 新規 |
| `app/api/auth/route.ts` | 認証 API（login） | 新規 |
| `app/api/mypage/route.ts` | ゆとシート設定の保存・取得 API | 新規 |
| `app/api/yutosheet/route.ts` | ゆとシート JSON プロキシ取得 API | 新規 |

既存の `lib/supabase.ts`（anon key クライアント。`import { supabase } from "@/lib/supabase"`）はそのまま利用する。

---

## データモデル概要

| テーブル | 役割 | 本 Issue での変更 |
|---------|------|------------------|
| `auth.users` | Supabase Auth ユーザー | 変更なし |
| `user_meta` | プロフィール（`user_id` / `display_name` / `role` / `is_editable`） | 変更なし（参照のみ）。`role` の CHECK は migration 004 で `('common','general','admin')` に拡張済み |
| `regulation_items` | レギュレーション。`level_cap_schedule`(jsonb) を含む（migration 009 追加済み） | 変更なし（参照のみ） |
| `level_cap` | レベルキャップ値（migration 008 が最新定義） | **差分カラム `exp_diff` を ALTER で追加**（[03_migration.md](./03_migration.md)） |
| `user_regulation_sheets` | **新規**: ユーザー×レギュレーションのゆとシート URL・備考 | **新規作成**（[03_migration.md](./03_migration.md)） |

### マイページ表示対象ロール

| role | マイページ（`/mypage`）アクセス |
|------|------|
| 未認証 | 不可（`/login` へリダイレクト） |
| `"common"` | 不可（`/login` へリダイレクト） |
| `"general"` | 可 |
| `"admin"` | 可 |

---

## ディレクトリ構成（実装後）

アトミックデザインを踏襲する。既存構成（`app/[period]/page.tsx` 等）はそのまま残す。

```
application/frontend/client/
├── app/
│   ├── login/
│   │   └── page.tsx                    # ログイン画面（新規）
│   ├── mypage/
│   │   └── page.tsx                    # マイページ画面（新規）
│   └── api/
│       ├── auth/
│       │   └── route.ts                # 認証（action: "login"）（新規）
│       ├── mypage/
│       │   └── route.ts                # ゆとシート設定 GET / PUT（新規）
│       └── yutosheet/
│           └── route.ts                # ゆとシート JSON プロキシ GET（新規）
├── component/
│   ├── atoms/
│   ├── molecules/
│   │   └── field/
│   │       └── TextInputField.tsx      # （admin 命名に準拠。なければ新規）
│   ├── organisms/
│   │   ├── login/
│   │   │   └── LoginForm.tsx           # ログインフォーム（新規）
│   │   └── mypage/
│   │       ├── RegulationSheetForm.tsx # ゆとシート URL・備考 編集（新規）
│   │       └── GrowthGuide.tsx         # 成長指示の表示（新規）
│   └── templates/
│       ├── LoginTemplate.tsx           # ログイン画面テンプレート（新規）
│       └── MyPageTemplate.tsx          # マイページテンプレート（新規）
├── const/
│   ├── common/
│   ├── font/
│   ├── pages/
│   │   ├── LOGIN.tsx                    # ログイン画面文言（新規）
│   │   └── MYPAGE.tsx                   # マイページ画面文言（新規）
│   ├── style/
│   ├── function/
│   │   ├── getLatestScheduledRegulation.ts  # 最新（日程登録あり）レギュレーション取得（新規）
│   │   ├── getUserRegulationSheet.ts        # ユーザーのゆとシート設定取得（新規）
│   │   ├── resolveCurrentLevelCap.ts        # 現在日付が属する level_cap 行の解決（新規）
│   │   └── calcGrowthGuide.ts               # 成長指示計算（新規）
│   └── type/
│       ├── auth/
│       │   ├── LoginFormType.ts        # （新規）
│       │   └── UserRoleType.ts         # "common" | "general" | "admin"（新規）
│       ├── mypage/
│       │   ├── UserRegulationSheetType.ts  # （新規）
│       │   ├── YutosheetJsonType.ts        # ゆとシート JSON（新規）
│       │   └── GrowthGuideType.ts          # 成長指示（新規）
│       └── levelCap/
│           └── LevelCapType.ts         # 既存。exp_diff 追加に伴い expDiff を追加
├── hooks/
│   └── useErrorHandler.ts              # 既存
└── lib/
    ├── supabase.ts                     # 既存（anon key）
    └── supabaseAdmin.ts                # 新規（Service Role Key・API Route 専用）
```

> **規約準拠メモ**:
> - 型は `const/type/<機能>/XxxType.ts` に配置（const 直下に型を置かない・1 機能 1 ディレクトリ）。
> - import は絶対パス `@/`。
> - 画面文言は `const/pages/XXX.tsx` に `{ TEXT: {...}, VALUE: {...} } as const` で定義。
> - 定数は 1 ファイル 1 定数・ファイル名 UPPER_CASE.tsx。
> - 非同期は async/await、Props は `type Props`、return 文は 1 つ、エラー処理は `useErrorHandler`、`any`/`unknown` 禁止。

---

## API Route 設計（概要）

DB 書き込み・外部 fetch はすべて API Route 経由とし、フロントに Service Role Key を露出させない。
エラーレスポンスは admin と同じ形式・HTTP ステータス規約に揃え、**`{ error, code }` 固定**で upstream 本文・スタックトレース・内部詳細を含めない。
外部プロキシ（`/api/yutosheet`）は **ホワイトリストフィールドのみ返却**する（生 JSON 全体の転送禁止）。詳細は「## セキュリティ要件」を参照。

```typescript
// 共通エラーレスポンス型（admin と同一）
type ErrorResponse = {
  error: string; // ユーザー表示用メッセージ
  code: string;  // フロントの条件分岐用
};
```

| HTTP | code | 用途 |
|------|------|------|
| 400 | `"BAD_REQUEST"` | パラメータ不正 |
| 401 | `"UNAUTHORIZED"` | 未認証 |
| 403 | `"FORBIDDEN"` | ロール権限不足（`general`/`admin` 以外） |
| 404 | `"NOT_FOUND"` | 対象レギュレーション・最新レギュレーションなし |
| 502 | `"UPSTREAM_ERROR"` | ゆとシート外部取得失敗 |
| 500 | `"INTERNAL_ERROR"` | サーバー内部エラー |

| エンドポイント | メソッド | 処理 |
|----------------|---------|------|
| `/api/auth`（action:"login"） | POST | user_id → email 解決 + signInWithPassword |
| `/api/mypage` | GET | ログインユーザーの `user_regulation_sheets` を取得 |
| `/api/mypage` | PUT | `user_regulation_sheets` を upsert（本人分のみ） |
| `/api/yutosheet` | GET | ゆとシート URL の JSONP（`&callback=ytsheetJsonp`）をサーバーサイドで取得しラッパー除去 → JSON.parse（CORS 回避プロキシ。詳細は [02_mypage.md](./02_mypage.md)） |

詳細は [01_auth.md](./01_auth.md) / [02_mypage.md](./02_mypage.md) を参照。

---

## マイグレーション実行順序

既存の番号体系（009 が最新）に続けて連番で追加する。

```
... 009_add_regulation_schedule.sql       → 既存（最新）
010_add_mypage.sql                        → level_cap に exp_diff カラム追加 + 既存行 UPDATE / user_regulation_sheets 新規作成 + RLS（exp_diff 追加 + user_regulation_sheets 作成 を1ファイルに統合・新規）
```

> 番号は必ず連番・依存順で実行する。詳細は [03_migration.md](./03_migration.md)。

---

## 実装順序（案）

1. 共通基盤: `lib/supabaseAdmin.ts` / `@supabase/ssr` 導入 / `middleware.ts`
2. DB 変更: migration 010_add_mypage.sql（exp_diff 追加 + user_regulation_sheets 作成 を1ファイルに統合）
3. ログイン機能（`/login`・`/api/auth`・ロール判定）
4. マイページ データ取得関数群（`const/function/`）と型
5. マイページ画面（ゆとシート URL/備考 編集 → 成長指示表示）
6. ゆとシート JSON プロキシ API（`/api/yutosheet`）

---

## セキュリティ要件（概要）

セキュリティレビュー結果を反映した要件の一覧。**詳細・擬似コードは各設計書の「## セキュリティ要件」を正本**とし、本節はサマリと参照のみとする。

| # | 項目 | 深刻度 | 正本 |
|---|------|--------|------|
| 1 | SSRF: ゆとシート URL 検証（https + `yutorize.2-d.jp` **完全一致**。`includes`/`startsWith`/`endsWith` 禁止・userinfo/非標準ポート拒否） | 最優先 | [02_mypage.md](./02_mypage.md) S-1 |
| 2 | プロキシ fetch: `redirect: "manual"`・内部IP帯拒否・タイムアウト/サイズ上限/GET固定/JavaScript・JSON 系限定・外部レスポンスをスクリプト実行しない（eval/Function/script 禁止・文字列処理でラッパー除去 → JSON.parse） | 最優先 | [02_mypage.md](./02_mypage.md) S-2 |
| 3 | 保存URLのスキーム/ドメイン検証（保存時400・表示時リンク化しない。`javascript:`/`data:` 排除） | High | [02_mypage.md](./02_mypage.md) S-1 / [03_migration.md](./03_migration.md) |
| 4 | 本人スコープ（GET/PUT とも user_id はセッションのみ）・role フェイルクローズ allowlist | High | [01_auth.md](./01_auth.md) S-1/S-2 |
| 5 | Cookie 属性（HttpOnly/Secure/SameSite）・CSRF（Origin/Referer 検証） | Medium | [01_auth.md](./01_auth.md) S-3 |
| 6 | ログイン総当たり対策（レート制限/バックオフ）・タイミング平準化 | Medium | [01_auth.md](./01_auth.md) S-4 |
| 7 | プロキシ応答最小化（ホワイトリスト返却）・エラー秘匿（`{ error, code }` 固定） | Medium | [02_mypage.md](./02_mypage.md) S-3 |
| 8 | 入力検証（`regulationId` 集合検証・`note`/`yutosheet_url` 最大長） | Medium | [02_mypage.md](./02_mypage.md) S-4 / [03_migration.md](./03_migration.md) |
| 9 | オープンリダイレクト予防（内部固定パスのリテラルのみ） | Medium | [01_auth.md](./01_auth.md) S-5 |
| 10 | シークレット/権限境界の明文化 | Info/Low | [01_auth.md](./01_auth.md) S-6 |

### 横断的な権限境界（明文化）

- `lib/supabaseAdmin.ts`（Service Role Key）は **API Route からのみ import**。`"use client"` コンポーネント・`middleware.ts` からは **絶対に import しない**。
- 権限境界は **`user_meta.role` のみ**であり、role の改変は **Supabase コンソール／Service Role 経由に限定**される。
- `updated_by` / `user_id` は常にセッション由来でセットし、リクエストボディ指定は無視する。

---

## 未確定・要確認事項

- ゆとシート JSON の `expTotal` / `historyGrowTotal` / `historyMoneyTotal` / `historyHonorTotal` の **フィールド存在・型は未確認**（公式ドキュメント一覧に記載なし）。詳細は [02_mypage.md](./02_mypage.md)。
- `level_cap` の差分カラム先頭行の扱いは **NULL に確定**（先頭レベルは差分が定義できないため null とし計算側で評価しない。詳細は [03_migration.md](./03_migration.md)）。
- 「最新レギュレーション」の具体判定条件（詳細は [02_mypage.md](./02_mypage.md)）。
