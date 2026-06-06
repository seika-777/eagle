# サインイン（新規登録）機能 設計

## 概要

管理者アカウントの新規登録機能。  
登録後、ユーザーロールは `"common"` として自動付与され、既存の管理者が手動で `"admin"` に変更するまで管理画面（`/` 以外）へはアクセスできない（ダッシュボードは閲覧可だが管理機能は非表示）。

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| サインイン画面 | `/signin` | 新規アカウント登録フォーム |

---

## ページ・コンポーネント構成

```
app/signin/
└── page.tsx                          # サインインページ

component/
├── templates/
│   └── SigninTemplate.tsx            # サインイン画面テンプレート
└── organisms/
    └── signin/
        └── SigninForm.tsx            # サインインフォーム
```

---

## サインインフォーム仕様

### 入力項目

| フィールド | コンポーネント | バリデーション |
|-----------|--------------|--------------|
| 登録コード | `TextInputField`（type=password） | 必須・環境変数 `SIGNUP_CODE` と一致 |
| ユーザーID | `TextInputField` | 必須・英数字とアンダースコアのみ・重複不可 |
| ユーザー名 | `TextInputField` | 必須 |
| パスワード | `TextInputField`（type=password） | 必須・8文字以上 |
| パスワード（確認） | `TextInputField`（type=password） | 必須・パスワードと一致 |

> **注意** ユーザーロールは登録画面では入力しない。登録時は `"common"` が自動付与され、管理者が手動で `"admin"` に変更する。

### アクション

| アクション | 処理 |
|-----------|------|
| 登録ボタン押下 | API Route `/api/auth` を呼び出し（action: "signup"） |
| 成功 | `/login` へリダイレクト（登録完了メッセージ表示） |
| 失敗（登録コード不一致） | エラーメッセージ表示（「登録コードが正しくありません」） |
| 失敗（ID重複） | エラーメッセージ表示（「このユーザーIDはすでに使用されています」） |
| 失敗（その他） | エラーメッセージ表示（「登録に失敗しました。もう一度お試しください」） |

### API Route: `/api/auth`（action: "signup"）

```
1. 登録コードの検証（環境変数 SIGNUP_CODE と一致しない → 403 エラー）
2. user_id の形式バリデーション（英数字・アンダースコアのみ）
3. user_meta テーブルで user_id の重複チェック
4. 重複あり → 409 エラー
5. Supabase Auth で email={userId}@eagle-admin.internal, password でユーザー作成
   （supabaseAdmin を使用）
6. user_meta テーブルに INSERT:
   - id: Supabase Authが発行したUUID
   - user_id: 入力されたユーザーID
   - display_name: 入力されたユーザー名
   - role: "common"
   - is_editable: false
7. 成功 → 201 レスポンス
```

---

## DB設計

### user_meta テーブル

```sql
CREATE TABLE user_meta (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id      text UNIQUE NOT NULL,
  display_name text NOT NULL,
  role         text NOT NULL DEFAULT 'common',
  is_editable  boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

### ロール付与（手動）

管理者がSupabaseコンソールから `user_meta.role` を更新する。

```sql
-- ロール付与
UPDATE user_meta SET role = 'admin' WHERE user_id = 'target_user';
```

ロールは `"common"`（デフォルト）と `"admin"` の2種類。`role === "admin"` のユーザーのみ全管理画面にアクセスできる。`role === "common"` はダッシュボード（`/`）のみアクセス可（管理機能カードは非表示）。`middleware.ts` でセッションの `role` を確認し、未認証は `/login` に、`"common"` が `/` 以外にアクセスした場合は `/` にリダイレクト。

### パスワードリセット（is_editable）

管理者が `is_editable = true` に設定することでそのユーザーのパスワードリセットを許可する。

```sql
-- リセット許可
UPDATE user_meta SET is_editable = true WHERE user_id = 'target_user';
```

- リセット完了後、システムが自動で `is_editable = false` に戻す
- `is_editable = false` のユーザーはリセットページ（`/reset-password`）にアクセスしても弾かれる

---

## フォーム定数

```typescript
// const/form/SIGNIN_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const SIGNIN_FORM_ITEM: { [key: string]: FormItemType } = {
  SIGNUP_CODE: {
    column: "signupCode",
    label: "登録コード",
    type: "password",
    rule: { required: true },
  },
  USER_ID: {
    column: "userId",
    label: "ユーザーID",
    type: "text",
    rule: { required: true, pattern: "^[a-zA-Z0-9_]+$" },
  },
  DISPLAY_NAME: {
    column: "displayName",
    label: "ユーザー名",
    type: "text",
    rule: { required: true },
  },
  PASSWORD: {
    column: "password",
    label: "パスワード",
    type: "password",
    rule: { required: true, minLength: 8 },
  },
  PASSWORD_CONFIRM: {
    column: "passwordConfirm",
    label: "パスワード（確認）",
    type: "password",
    rule: { required: true },
  },
} as const;
```

---

## 型定義

```typescript
// const/type/auth/SigninFormType.ts
export type SigninFormType = {
  signupCode: string;
  userId: string;
  displayName: string;
  password: string;
  passwordConfirm: string;
};

// const/type/auth/UserMetaType.ts
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

export type UserMetaType = {
  id: string;
  userId: string;
  displayName: string;
  role: UserRoleType;
  isEditable: boolean;
  createdAt: string;
};
```

---

## 画面定数

```typescript
// const/pages/SIGNIN.tsx
export const SIGNIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "アカウント登録",
    USER_ID_LABEL: "ユーザーID",
    USER_ID_HINT: "英数字とアンダースコア（_）のみ使用可能",
    DISPLAY_NAME_LABEL: "ユーザー名",
    PASSWORD_LABEL: "パスワード",
    PASSWORD_CONFIRM_LABEL: "パスワード（確認）",
    SUBMIT: "登録する",
    LINK_LOGIN: "すでにアカウントをお持ちの方はこちら",
    SUCCESS: "登録が完了しました。ログインしてください。",
    ERROR_DUPLICATE: "このユーザーIDはすでに使用されています",
    ERROR_PASSWORD_MISMATCH: "パスワードが一致しません",
    ERROR_DEFAULT: "登録に失敗しました。もう一度お試しください",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
    USER_ID_PATTERN: "^[a-zA-Z0-9_]+$",
  },
} as const;
```

---

## ディレクトリ追加分

`00_overview.md` のディレクトリ構成に以下を追加:

```
app/
└── signin/
    └── page.tsx

app/api/
├── auth/
│   └── route.ts    # 認証処理（action で login/signup/reset-password を切り替え）
└── items/
    └── route.ts    # CRUD処理（type + id? で全エンティティを統合）
```
