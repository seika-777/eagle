# ログイン機能 設計

## 概要

管理者がadmin画面にアクセスするための認証機能。  
**ユーザーID + パスワード** でログインする。  
未認証ユーザーは全ページで `/login` にリダイレクトされる。

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| ログイン画面 | `/login` | ユーザーID・パスワード入力フォーム |

---

## ページ・コンポーネント構成

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
| ユーザーID | `TextInputField` | 必須 |
| パスワード | `TextInputField`（type=password） | 必須・8文字以上 |

### アクション

| アクション | 処理 |
|-----------|------|
| ログインボタン押下 | API Route `/api/auth` を呼び出し（action: "login"） |
| 成功（role = "admin" / "common"） | `/` へリダイレクト |
| 失敗 | エラーメッセージ表示（「ユーザーIDまたはパスワードが正しくありません」） |

### API Route: `/api/auth`（action: "login"）

```
1. user_meta テーブルから user_id に対応するレコードを取得
2. 存在しない場合 → 401 エラー（「ユーザーIDまたはパスワードが正しくありません」で統一し、user_id 存在有無は漏洩させない）
3. email（{userId}@eagle-admin.internal）を組み立て
4. Supabase Auth signInWithPassword({ email, password }) を呼び出し
5. 成功 → user_meta.role を確認。"admin" / "common" いずれの場合もセッション情報を返す（role をレスポンスに含める）
6. 失敗 → 401 エラー（ステップ2と同一メッセージ）
```

> **設計メモ（セキュリティ）**: user_id が存在しない場合もパスワードが誤っている場合も、同一の 401 エラーメッセージ（`LOGIN.TEXT.ERROR_INVALID`）を返すこと。レスポンス内容・タイミングを揃えることでユーザー列挙攻撃を防止する。

---

## 認証ガード（middleware.ts）

`middleware.ts` でセッションを検証し、未認証ユーザーおよびアクセス権限外ページへのアクセスをリダイレクト。

### ロール確認方法

リクエストごとに `user_meta` テーブルをクエリしてロールを確認する。  
（admin 画面はユーザー数・リクエスト数ともに少ないため、DBアクセスのオーバーヘッドは許容範囲とする）

### ロール別アクセス制御

| role | アクセス可能ページ | それ以外へのアクセス時 |
|------|-----------------|-------------------|
| 未認証 | `/login`, `/signin`, `/reset-password` | `/login` にリダイレクト |
| `"common"` | `/`（ダッシュボードのみ） | `/` にリダイレクト |
| `"admin"` | 全ページ | - |

```typescript
// middleware.ts（イメージ）
export async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const pathname = request.nextUrl.pathname;
  const publicPaths = ["/login", "/signin", "/reset-password"];

  // 1. Supabase Auth のセッション確認
  //    セッションなし かつ APIルート → 401 を返す
  //    セッションなし かつ ページルート（public以外） → /login にリダイレクト
  // 2. セッションあり → user_meta テーブルから role を取得（anon key 経由）
  //    role === "common" かつ pathname !== "/" → / にリダイレクト
  //    role === "common" かつ APIルート → 403 を返す
  // 3. /login, /signin, /reset-password アクセス時にセッションあり → / にリダイレクト
}
```

> **Edge Runtime 注意**: middleware.ts は Next.js Edge Runtime で動作するため、`@supabase/ssr` の `createServerClient` を使用すること。`lib/supabaseAdmin.ts`（Service Role Key）は **API Route 専用**。middleware での role チェックは Service Role Key を使わず、anon key 経由での user_meta クエリを使用する。

```typescript
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

## ログアウト

共通レイアウト（`AdminLayoutTemplate`）のヘッダーにログアウトボタンを配置。

- フロントエンドから `supabase.auth.signOut()`（anon key クライアント）を直接呼び出す
- 成功後 `/login` にリダイレクト
- API Route 経由は不要（`/api/auth` の action 一覧には含めない）

---

## パスワードリセット

### 画面

| 画面 | パス | 説明 |
|------|------|------|
| パスワードリセット画面 | `/reset-password` | 新しいパスワードを設定する画面 |

### 前提条件

管理者が事前に `user_meta.is_editable = true` に設定していること。

### フォーム入力項目

| フィールド | コンポーネント | バリデーション |
|-----------|--------------|--------------|
| ユーザーID | `TextInputField` | 必須 |
| 新しいパスワード | `TextInputField`（type=password） | 必須・8文字以上 |
| 新しいパスワード（確認） | `TextInputField`（type=password） | 必須・一致 |

### アクション

| アクション | 処理 |
|-----------|------|
| リセットボタン押下 | API Route `/api/auth` を呼び出し（action: "reset-password"） |
| 成功 | `/login` へリダイレクト |
| 失敗（is_editable = false） | 「パスワードのリセットが許可されていません」 |
| 失敗（user_id 不存在 / is_editable = false 以外の失敗） | 「リセットに失敗しました。もう一度お試しください」 |

### API Route: `/api/auth`（action: "reset-password"）

```
1. user_meta テーブルで user_id を検索
2. 存在しない → 401 エラー（「ユーザーIDが見つかりません」は表示せず、汎用エラー「ユーザーIDまたはパスワードが正しくありません」を返すこと。ユーザー列挙攻撃防止のため。）
3. is_editable = false → 403 エラー
4. supabaseAdmin.auth.admin.updateUserById(id, { password }) でパスワード更新
5. user_meta の is_editable を false に更新
6. 成功 → 200 レスポンス
```

### ログイン画面からのリンク

`/login` 画面に「パスワードをリセットする」リンクを配置し `/reset-password` へ遷移。

---

## フォーム定数

```typescript
// const/form/LOGIN_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const LOGIN_FORM_ITEM: { [key: string]: FormItemType } = {
  USER_ID: {
    column: "userId",
    label: "ユーザーID",
    type: "text",
    rule: { required: true },
  },
  PASSWORD: {
    column: "password",
    label: "パスワード",
    type: "password",
    rule: { required: true, minLength: 8 },
  },
} as const;
```

---

## パスワードリセット フォーム定数

```typescript
// const/form/RESET_PASSWORD_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const RESET_PASSWORD_FORM_ITEM: { [key: string]: FormItemType } = {
  USER_ID: {
    column: "userId",
    label: "ユーザーID",
    type: "text",
    rule: { required: true },
  },
  PASSWORD: {
    column: "password",
    label: "新しいパスワード",
    type: "password",
    rule: { required: true, minLength: 8 },
  },
  PASSWORD_CONFIRM: {
    column: "passwordConfirm",
    label: "新しいパスワード（確認）",
    type: "password",
    rule: { required: true },
  },
} as const;
```

---

## 型定義

```typescript
// const/type/auth/LoginFormType.ts
export type LoginFormType = {
  userId: string;
  password: string;
};
```

---

## 画面定数

```typescript
// const/pages/LOGIN.tsx
export const LOGIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "管理者ログイン",
    USER_ID_LABEL: "ユーザーID",
    PASSWORD_LABEL: "パスワード",
    SUBMIT: "ログイン",
    LINK_SIGNIN: "アカウントをお持ちでない方はこちら",
    ERROR_INVALID: "ユーザーIDまたはパスワードが正しくありません",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
  },
} as const;
```

---

## Supabaseクライアント初期化

```typescript
// lib/supabase.ts（フロントエンド用・anon key）
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// lib/supabaseAdmin.ts（API Route専用・Edge Runtime では使用不可）
import { createClient } from "@supabase/supabase-js";
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```
