# ログイン／認証・ロール制御 設計

## 概要

client のマイページ機能にアクセスするための認証機能。
**ユーザー ID + パスワード** でログインする。
マイページ（`/mypage`）は role が `"general"` または `"admin"` のユーザーのみアクセスできる。

admin 側（`docs/admin/design/01_login.md` / `00_overview.md`）の認証方式を踏襲する。
Supabase Auth の内部メールは `{userId}@eagle-admin.internal` 形式（admin と共通の `user_meta` を使用するため、admin と同じドメインを用いる）。

---

## ベータ版に関する方針（重要・再掲）

- **ログイン画面（`/login`）への遷移ボタンはナビゲーション等に設置しない。**
  ユーザーは `/login` を **直接 URL でアクセス** する想定。
- マイページ（`/mypage`）も直接 URL アクセスを想定し、未認証・権限外は `middleware.ts` で `/login` へリダイレクトする。
- ログイン画面・認証・ロール判定の実装そのものは本 Issue で行う（導線のみ設けない）。

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| ログイン画面 | `/login` | ユーザー ID・パスワード入力フォーム |

> サインアップ・パスワードリセットは本 Issue のスコープ外（admin 側で運用済み。client では `/login` のみ）。

### ページ・コンポーネント構成

```
app/login/
└── page.tsx                          # ログインページ

component/
├── templates/
│   └── LoginTemplate.tsx             # ログイン画面テンプレート
└── organisms/
    └── login/
        └── LoginForm.tsx             # ログインフォーム
```

---

## ログインフォーム仕様

### 入力項目

| フィールド | コンポーネント | バリデーション |
|-----------|--------------|--------------|
| ユーザー ID | `TextInputField` | 必須 |
| パスワード | `TextInputField`（type=password） | 必須・8 文字以上 |

### アクション

| アクション | 処理 |
|-----------|------|
| ログインボタン押下 | API Route `/api/auth`（action: "login"）を呼び出し |
| 成功（role = `"general"` / `"admin"`） | `/mypage` へリダイレクト |
| 成功（role = `"common"`） | `/login` に留まりエラー表示（マイページ権限なし）。`LOGIN.TEXT.ERROR_NO_PERMISSION` |
| 失敗 | エラーメッセージ表示（`LOGIN.TEXT.ERROR_INVALID`） |

### API Route: `/api/auth`（action: "login"）

```
1. user_meta テーブルから user_id に対応するレコードを取得
2. 存在しない場合 → 401 エラー（"ユーザーIDまたはパスワードが正しくありません" で統一し、user_id 存在有無を漏洩させない）
3. email（{userId}@eagle-admin.internal）を組み立て
4. Supabase Auth signInWithPassword({ email, password }) を呼び出し
5. 成功 → user_meta.role を確認し、role をレスポンスに含めて返す
6. 失敗 → 401 エラー（ステップ2と同一メッセージ）
```

> **設計メモ（セキュリティ）**: user_id 不存在・パスワード誤りのいずれも同一の 401 メッセージ（`LOGIN.TEXT.ERROR_INVALID`）を返し、ユーザー列挙攻撃を防止する（admin 同様）。
> role が `"common"` でも 200 + role を返し、ロール別アクセス制御は **middleware と画面遷移先** で行う（API はセッションを発行する）。
> **総当たり対策・タイミング平準化・Cookie 属性・Origin 検証・オープンリダイレクト予防は後述「## セキュリティ要件」を参照**。

リクエスト/レスポンス例:

```typescript
// POST /api/auth
{ action: "login", userId: string, password: string }

// 200 レスポンス
{ role: "general" | "admin" | "common" }
```

---

## 認証ガード（middleware.ts）

`middleware.ts` でセッションを検証し、未認証・権限外のアクセスをリダイレクトする。
admin 同様、Edge Runtime で動作するため **`@supabase/ssr` の `createServerClient`** を使用する（`lib/supabaseAdmin.ts` は API Route 専用で middleware では使用しない）。

### ロール確認方法

リクエストごとに `user_meta` テーブルを anon key 経由でクエリして role を確認する
（client のマイページ利用者数・リクエスト数は少ないため DB アクセスのオーバーヘッドは許容範囲）。

### ロール別アクセス制御

| role | アクセス可能ページ | それ以外へのアクセス時 |
|------|-----------------|-------------------|
| 未認証 | `/login`（と既存の公開ページ） | `/mypage` 等の保護ページ → `/login` にリダイレクト |
| `"common"` | 公開ページ（既存）。`/mypage` は不可 | `/mypage` → `/login` にリダイレクト |
| `"general"` | 公開ページ + `/mypage` | - |
| `"admin"` | 公開ページ + `/mypage` | - |

> **既存公開ページ（`/[period]` 等）への影響**: client は元々ログイン不要の公開サイトであり、`middleware.ts` の保護対象は **`/mypage` と client 用 API（`/api/mypage`・`/api/yutosheet`）に限定** する。既存の公開ページ・既存 API はガード対象外とし、ベータ版での挙動変更を避ける。

```typescript
// middleware.ts（イメージ・擬似コード。実装コードではない）
// 保護対象パス: ["/mypage", "/api/mypage", "/api/yutosheet"]
//
// 1. パスが保護対象でなければ何もしない（公開ページはそのまま）
// 2. @supabase/ssr の createServerClient でセッション確認
//    - セッションなし かつ API ルート → 401 { error, code: "UNAUTHORIZED" }
//    - セッションなし かつ /mypage     → /login にリダイレクト
// 3. セッションあり → user_meta から role を取得（anon key 経由）
//    - allowlist（"general" | "admin" 厳密一致）以外（"common"/null/未知/取得失敗/例外）は
//      フェイルクローズで拒否（「## セキュリティ要件」S-2）
//    - 拒否 かつ API ルート → 403 { error, code: "FORBIDDEN" }
//    - 拒否 かつ /mypage    → /login にリダイレクト
// 4. /login アクセス時にセッションあり かつ role が general/admin → /mypage にリダイレクト（任意）

export const config = {
  matcher: ["/mypage/:path*", "/api/mypage/:path*", "/api/yutosheet/:path*", "/login"],
};
```

> **Edge Runtime 注意**: middleware での role チェックは Service Role Key を使わず anon key 経由の `user_meta` クエリで行う。`lib/supabaseAdmin.ts`（Service Role Key）は API Route 専用。

---

## API Route 共通の認証確認（多重防御）

`/api/mypage`・`/api/yutosheet` は middleware で保護されるが、各 Route ハンドラ内でも Cookie のセッションを再検証する（middleware の二重保護）。

```
1. リクエスト Cookie からセッションを取得（@supabase/ssr）
2. セッションなし → 401 { error, code: "UNAUTHORIZED" }
3. user_meta.role を取得し、allowlist（"general" または "admin" に厳密一致）以外は
   すべて 403 { error, code: "FORBIDDEN" }（フェイルクローズ。詳細は「## セキュリティ要件」S-2）
4. 以降の処理では auth.uid()（= user_regulation_sheets.user_id）を「本人」として扱う
```

> **本人スコープの担保**: `/api/mypage` は **GET / PUT のいずれも**、入力（クエリ／ボディ）から user_id を一切受け取らず、**セッションから取得した user_id のみ** で `.eq("user_id", sessionUserId)` する（リクエスト由来の user_id は無視）。あわせて DB 側で RLS（`auth.uid() = user_id`）でも本人に限定する（[03_migration.md](./03_migration.md)）。詳細は「## セキュリティ要件」S-1 を参照。

---

## ログアウト

マイページのヘッダー等にログアウトボタンを配置する（ベータ版でもログアウト導線は許可。「ログイン導線を設けない」制約はログイン画面への遷移ボタンのみが対象）。

- フロントから `supabase.auth.signOut()`（anon key クライアント）を直接呼び出す
- 成功後 `/login` にリダイレクト

---

## 型定義

```typescript
// const/type/auth/UserRoleType.ts
// client 側のロール union（migration 004 の CHECK に合わせる）
export type UserRoleType = "common" | "general" | "admin";
```

```typescript
// const/type/auth/LoginFormType.ts
export type LoginFormType = {
  userId: string;
  password: string;
};
```

---

## 画面定数（ログイン）

```typescript
// const/pages/LOGIN.tsx
export const LOGIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "ログイン",
    USER_ID_LABEL: "ユーザーID",
    PASSWORD_LABEL: "パスワード",
    SUBMIT: "ログイン",
    ERROR_INVALID: "ユーザーIDまたはパスワードが正しくありません",
    ERROR_NO_PERMISSION: "このアカウントではマイページを利用できません",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
  },
} as const;
```

---

## Supabase クライアント初期化

```typescript
// lib/supabase.ts（既存・フロントエンド用 anon key）
import { supabase } from "@/lib/supabase";

// lib/supabaseAdmin.ts（新規・API Route 専用・Edge Runtime では使用不可）
import { createClient } from "@supabase/supabase-js";
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### 環境変数（追記）

```
# application/frontend/client/.env.local
NEXT_PUBLIC_SUPABASE_URL=...       # 既存
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # 既存
SUPABASE_SERVICE_ROLE_KEY=...      # 新規（API Route の DB 書き込みで使用）
```

---

## DB 操作関数の責務一覧（認証関連）

| 関数 / 配置 | 責務 |
|-------------|------|
| `/api/auth` route | login（user_id→email 解決・signInWithPassword・role 返却） |
| `middleware.ts` | セッション検証・role による `/mypage`・client API のガード |
| 各 client API route | セッション再検証・本人スコープ確定 |

---

## セキュリティ要件

> 認証・認可・セッションに関するセキュリティ設計。URL 検証・SSRF・プロキシ応答最小化は [02_mypage.md](./02_mypage.md)「## セキュリティ要件」を正本とする。
> 以下の擬似コードはすべて **設計上のイメージであり実装コードではない**。

### S-1. 本人スコープ（user_id はセッションのみ）【High】

`/api/mypage` の **GET / PUT のいずれも**、入力（クエリ／ボディ）から user_id を一切受け取らない。常にセッション user_id のみで `.eq("user_id", sessionUserId)` する。`updated_by` / `user_id` は常にセッション由来でセットし、リクエストボディ指定は無視する。

### S-2. フェイルクローズ認可（role allowlist）【High】

role 判定は **全経路（middleware・各 API Route）** で allowlist 方式に統一する。

- `role === "general"` または `role === "admin"` に **厳密一致した場合のみ許可**。
- それ以外（`null` / `"common"` / 未知文字列 / `user_meta` 取得失敗 / 例外）は **すべて拒否**（フェイルクローズ）。
  - API ルート → 403 `{ error, code: "FORBIDDEN" }`
  - `/mypage` → `/login` にリダイレクト

```
// 擬似コード（実装コードではない）
const ALLOWED_ROLES = ["general", "admin"] as const;
// role 取得に失敗・例外・null・未知文字列 → 拒否（deny by default）
const allowed =
  typeof role === "string" &&
  (ALLOWED_ROLES as readonly string[]).includes(role);
if (!allowed) { /* 403 または /login リダイレクト */ }
```

### S-3. Cookie セッション属性・CSRF 対策【Medium】

- セッション Cookie は **`HttpOnly` / `Secure` / `SameSite=Lax`（または `Strict`）** を設定する（`@supabase/ssr` の Cookie 設定で指定）。
- 状態変更系 API（`/api/mypage` PUT）は **Origin / Referer による同一オリジン検証** を行う。許可オリジンと一致しない場合は 403。

### S-4. 総当たり対策・タイミング平準化【Medium】

- `/api/auth` に **IP 単位・ユーザー単位のレート制限**と**連続失敗時のバックオフ**を設ける（ベータでも最低限）。
- user_id 不在時も **Auth 呼び出し相当の処理を通す**等で **応答時間を平準化**し、タイミング攻撃によるユーザー存在推測を防ぐ（既存の同一 401 メッセージ方針と併用）。

### S-5. オープンリダイレクト予防【Medium】

- リダイレクト先は **許可済み内部固定パスのリテラルのみ**（`/login` / `/mypage`）。
- `next` / `redirect` 等の **ユーザー入力由来の遷移先・外部 URL は使用禁止**。クエリ等から遷移先を組み立てない。

### S-6. シークレット／権限境界【Info/Low】

- `lib/supabaseAdmin.ts`（Service Role Key）は **API Route からのみ import** する。`"use client"` コンポーネント・`middleware.ts` からは **絶対に import しない**（middleware は anon key 経由で role を確認する）。
- 権限境界は **`user_meta.role` のみ**。role の改変は **Supabase コンソール／Service Role 経由に限定**され、一般ユーザー操作では変更不可。
- `updated_by` / `user_id` は常にセッション由来でセットし、リクエストボディ指定は無視（S-1 再掲）。

---

## 未確定・要確認事項

- 内部メールドメイン（`@eagle-admin.internal`）を client でもそのまま用いるか（admin/client で `user_meta` を共有する前提では同一が自然）。実装前に admin 側の運用と整合を確認。
- `middleware.ts` の matcher 範囲（`/mypage` と client API のみに限定する方針）で既存公開ページへの副作用がないか、実装時に E2E で確認。
