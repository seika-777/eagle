# Admin画面 全体設計

## 概要

Issue: https://github.com/seika-777/eagle/issues/22

`application/frontend/admin/` にある Next.js プロジェクトに管理者向けCRUD画面を実装する。
clientと同じSupabaseデータベースを使用し、管理・編集を行う。

---

## 実装機能一覧

| # | 機能 | 設計ファイル |
|---|------|------------|
| 0 | ダッシュボード | [10_dashboard.md](./10_dashboard.md) |
| 1 | ログイン機能 | [01_login.md](./01_login.md) |
| 2 | サインイン（新規登録）機能 | [08_signin.md](./08_signin.md) |
| 3 | レギュレーション管理 | [02_regulation.md](./02_regulation.md) |
| 4 | 神格管理 | [03_god.md](./03_god.md) |
| 5 | 流派管理 | [04_school.md](./04_school.md) |
| 6 | 種族管理 | [05_race.md](./05_race.md) |
| 7 | ハウスルール管理 | [06_house_rule.md](./06_house_rule.md) |
| 8 | 禁止事項管理 | [07_prohibition.md](./07_prohibition.md) |
| 9 | サプリメント管理 | [09_supplement.md](./09_supplement.md) |
| 10 | オリジナルアイテム管理 | [11_original.md](./11_original.md) |

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16.x (App Router) |
| 言語 | TypeScript 5 |
| UI | Chakra UI 3.33.0 + Emotion 11 |
| スタイル | Sass 1.90.0 |
| DB | Supabase (PostgreSQL) |
| 認証 | Supabase Auth（ユーザーID/パスワード）+ user_meta テーブル |
| 状態管理 | React Context（追加ライブラリなし） |

---

## ユーザー情報の状態管理

ログイン中のユーザー情報（`userId`, `displayName`, `role`）は **React Context** で管理する。

- `AdminLayoutTemplate` の初回レンダリング時に `user_meta` テーブルから取得
- Context 経由で全画面に配布（ヘッダーの表示名、ロール別 UI 制御に使用）
- ページ更新時は再フェッチする（localStorage への永続化は行わない）

```
app/
└── AppWrapper.tsx    # UserContext の Provider を配置
```

```typescript
// const/type/auth/UserMetaType.ts
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

## ディレクトリ構成（実装後）

アトミックデザインを採用し、clientと同じ構成を踏襲する。

```
application/frontend/admin/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # ログインリダイレクト or ダッシュボード
│   ├── AppWrapper.tsx
│   ├── globals.scss
│   ├── login/
│   │   └── page.tsx
│   ├── signin/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts               # 認証処理（action で login/signup/reset-password を切り替え）
│   │   └── items/
│   │       └── route.ts               # CRUD処理（type + id? で全エンティティを統合）
│   └── [type]/
│       ├── page.tsx                # 一覧（type で振り分け）
│       └── edit/
│           └── [id]/
│               └── page.tsx        # 編集・新規（id=new で新規）
├── component/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── const/
│   ├── common/
│   ├── font/
│   ├── form/                       # フォーム項目定数（1画面1ファイル）
│   ├── function/                   # DB操作関数（CRUD）
│   ├── pages/                      # 画面別定数（TEXT/VALUE）
│   ├── style/
│   └── type/                       # 型定義
├── hooks/
│   └── useErrorHandler.ts
├── lib/
│   ├── supabase.ts                 # フロントエンド用（anon key）
│   └── supabaseAdmin.ts            # API Route用（Service Role Key）
└── middleware.ts                   # 認証ガード
```

---

## 認証・権限方針

### 採用方針: Supabase Auth（ユーザーID/パスワード）+ Next.js API Route

- ユーザーはメールアドレスではなく **ユーザーID** でログインする
- Supabase Authの内部メールは `{userId}@eagle-admin.internal` として自動生成し、ユーザーには見せない
- プロフィール情報（ユーザーID・ユーザー名・ロール）は別途 `user_meta` テーブルで管理
- DB操作（SELECT/INSERT/UPDATE/DELETE）はNext.js API Route（`app/api/`）経由で実行
- 保守性を考慮し、API Routeは2ファイルに統合する（`/api/auth`・`/api/items`）
- API Route内でSupabase Service Role Keyを使用（フロントに秘密鍵を露出させない）
- `middleware.ts` でセッション検証を行い、未認証ユーザーを `/login` にリダイレクト。`role = "common"` のユーザーはログイン可能だがダッシュボード（`/`）のみアクセス可。`/` 以外のページ（管理画面）へのアクセスは `/` にリダイレクト（middleware.ts では `@supabase/ssr` の `createServerClient` を使用。Edge Runtime 対応）
- API Route では `supabaseAdmin`（Service Role Key）を使用
- `/login`・`/signin`・`/reset-password` は認証ガードから除外（未ログインでもアクセス可）
- 登録時は `"common"` が自動付与され、管理者が手動で `"admin"` に変更する（`user_meta.role` カラムを更新）

### user_meta テーブル設計

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK, FK → auth.users) | Supabase AuthのユーザーID |
| user_id | text (unique) | ユーザーが決めるログインID |
| display_name | text | 表示名（ユーザー名） |
| role | text | ユーザーロール（"common" または "admin"） |
| is_editable | boolean (DEFAULT false) | trueのときパスワードリセットを許可 |
| created_at | timestamp | 登録日時 |

### サインアップフロー

1. ユーザーがサインイン画面（`/signin`）でユーザーID・ユーザー名・パスワードを入力
2. Next.js API Route経由で以下を実行:
   a. `user_id` の重複チェック（`user_meta` テーブル）
   b. `{userId}@eagle-admin.internal` で Supabase Auth にユーザー作成
   c. `user_meta` テーブルにレコード挿入（`role` は `"common"`）
3. 登録完了後 `/login` へリダイレクト

### 初期管理者の作成手順

システム初期セットアップ時は、最初の `admin` ユーザーを以下の手順で作成する。

1. `/signin` 画面から通常どおりアカウントを作成（role は `"common"` で登録される）
2. Supabase コンソール（Table Editor）で `user_meta` テーブルを開く
3. 対象ユーザーの `role` を `"common"` → `"admin"` に手動更新する
4. 以降の管理者追加は、既存の `admin` ユーザーが同様の手順で昇格させる

> **注意**: Supabase コンソールへのアクセス権を持つ者のみが admin 昇格を行えるため、コンソールアクセス権限の管理が重要。

### ログインフロー

1. ユーザーが `/login` でユーザーID・パスワードを入力
2. フロントエンドが `/api/auth`（action: "login"）に POST
3. API Route 内で user_meta 検索 → email 組み立て → signInWithPassword → role 確認を一括処理
4. role にかかわらずセッション情報を返す（role をレスポンスに含める）。ロール別アクセス制御は middleware で実施する（詳細は `01_login.md` 参照）
5. フロントはレスポンスに応じて `/` へリダイレクト、またはエラーメッセージを表示
6. middleware.ts でセッションの有無を検証し、未認証ユーザーを `/login` にリダイレクト

---

## API Route 設計

保守性・シンプルさを考慮し、全DB操作を2ファイルに集約する。

### `/api/auth` — 認証処理

リクエストボディの `action` フィールドで処理を切り替える。

| action | メソッド | 処理 |
|--------|---------|------|
| `"login"` | POST | user_id → email 解決 + signInWithPassword |
| `"signup"` | POST | 重複チェック + Auth作成 + user_meta INSERT（role="common"） |
| `"reset-password"` | POST | is_editable 確認 + パスワード更新 |

```typescript
{ action: "login", userId: string, password: string }
{ action: "signup", userId: string, displayName: string, password: string }
{ action: "reset-password", userId: string, password: string }
```

### `/api/items` — CRUD処理

> **認証確認**: すべてのメソッドで、リクエストヘッダーの Cookie からセッションを検証すること。未認証または role !== "admin" の場合は 401 を返す（middleware の二重保護）。

クエリパラメータの `type`（必須）と `id`（オプショナル）で対象エンティティと操作を切り替える。

`type` の値: `"regulation"` / `"god"` / `"school"` / `"race"` / `"house-rule"` / `"prohibition"` / `"supplement"` / `"original"`

| メソッド | クエリ | 処理 |
|---------|--------|------|
| GET | `type=xxx` | 一覧取得 |
| GET | `type=xxx&is_always=false` | 一覧取得（`is_always=false` のレコードのみ。god / school / race / supplement に対応）※クエリパラメータは文字列で受信されるため、API Route 内で `searchParams.get("is_always") === "false"` のように文字列比較すること |
| GET | `type=xxx&id=1` | 1件取得（regulation の場合は item_regulations も含む） |
| POST | `type=xxx` | 新規作成（item_regulations 同期が必要な場合は同時実行） |
| PUT | `type=xxx&id=1` | 更新（item_regulations 同期が必要な場合は同時実行） |
| DELETE | `type=xxx&id=1` | 削除 |

#### regulation の POST/PUT ボディ構造

`godIds` / `schoolIds` / `raceIds` / `supplementIds` はフォームの仮想フィールドであり `regulation_items` には存在しないカラム。  
フォームの型（`RegulationFormType`）をそのままボディとして送信し、API Route 内で分離処理する。

```typescript
// POST /api/items?type=regulation
// PUT  /api/items?type=regulation&id=1
{
  name: string;
  description: string;
  recruitment: string;
  stage: string;
  race: string;
  supplement: string;
  notes: string;
  levelCapBelt: "B" | "C";
  godIds: number[];       // → item_regulations に同期
  schoolIds: number[];    // → item_regulations に同期
  raceIds: number[];      // → item_regulations に同期
  supplementIds: number[];// → item_regulations に同期
}
```

API Route 内の処理順：
1. `godIds` / `schoolIds` / `raceIds` / `supplementIds` をボディから分離
2. 各 ID 配列に含まれる ID が実際に DB に存在するかを確認（存在しない ID は 400 エラー）
3. 残りのフィールドで `regulation_items` を INSERT / UPDATE
4. `item_regulations` を regulation_id 軸に DELETE → INSERT（Supabase RPC でトランザクション実行）

### エラーレスポンス統一形式

全 API Route のエラーレスポンスは以下の JSON 形式に統一する。

```typescript
// エラーレスポンス型
type ErrorResponse = {
  error: string; // エラーメッセージ（ユーザー表示用）
  code: string;  // エラーコード（フロントエンドでの条件分岐用）
};
```

| HTTP ステータス | code 値 | 用途 |
|---------------|---------|------|
| 400 | `"BAD_REQUEST"` | リクエストパラメータ不正・IDが存在しない等 |
| 401 | `"UNAUTHORIZED"` | 未認証（セッションなし） |
| 403 | `"FORBIDDEN"` | ロール権限不足（is_editable = false 含む） |
| 409 | `"CONFLICT"` | 楽観的ロック競合（後述） |
| 500 | `"INTERNAL_ERROR"` | サーバー内部エラー |

---

## 共通監査カラム

全アイテムテーブル（`race_items` / `god_items` / `school_items` / `supplement_items` / `house_rule_items` / `prohibition_items` / `original_items` / `regulation_items`）に以下の監査カラムを共通で持つ。

| カラム | 型 | 説明 |
|--------|-----|------|
| updated_by | uuid (nullable, FK → auth.users.id) | 最終更新者のユーザーID |
| updated_at | timestamptz (nullable) | 最終更新日時 |

- API Route（INSERT / UPDATE）実行時に、リクエスト元のログインユーザーIDを `updated_by`、現在時刻を `updated_at` にセットする
- シードデータなど管理画面外で投入されたレコードは `NULL` となる
- フォームには表示しない（システム側で自動セット）

### 楽観的ロック方針

複数管理者による同時編集の競合を `updated_at` の比較で検出する。

#### PUT（更新）リクエストのボディ

更新リクエストのボディには、フォーム読み込み時点の `updatedAt` を含めて送信する。

```typescript
// PUT /api/items?type=xxx&id=1 の共通フィールド
// updatedAt は FormType には含まない。フォームコンポーネントが状態として保持し、
// PUT リクエスト送信時に FormType とは別途付加する。
{
  ...FormType,              // 各エンティティのフォームデータ
  updatedAt: string | null; // 編集開始時点の updated_at（ISO 8601形式。新規時は null）
}
```

#### API Route 内の検証ロジック

```typescript
// PUT 処理内
const current = await supabaseAdmin.from('xxx_items').select('updated_at').eq('id', id).single();
if (current.data.updated_at !== body.updatedAt) {
  return NextResponse.json(
    { error: '他のユーザーにより更新されました。ページを再読み込みしてください。', code: 'CONFLICT' },
    { status: 409 }
  );
}
```

- `updatedAt` が一致する場合のみ UPDATE を実行する
- 不一致の場合は 409 を返す
- フロントエンドは 409 受信時に「他のユーザーにより更新されました。ページを再読み込みしてください。」を表示する

---

## DB書き込み権限

現在のRLSは全テーブルで `SELECT` のみ許可（Public read）。  
管理者の書き込みを許可するためにSupabaseマイグレーションの追加が必要。

書き込み操作はAPI Route（Service Role Key使用）経由で行うため、RLSポリシーの追加は不要。  
ただし `user_meta` テーブルは以下のRLSポリシーが必要:

```sql
-- user_meta: 本人のみ参照可
CREATE POLICY "user_meta_select" ON user_meta
  FOR SELECT USING (auth.uid() = id);

-- user_meta: Service Role のみ INSERT/UPDATE（API Route経由のみ操作可）
-- Service Role Key使用時はRLSをバイパスするため追加不要
```

### 削除時の連動削除

| 削除対象 | 連動して削除されるレコード | 実装方式 |
|---------|--------------------------|---------|
| `regulation_items` | `item_regulations.regulation_id` が一致する全レコード | FK ON DELETE CASCADE（`002` マイグレーション実装済み） |
| `god_items` / `school_items` / `race_items` / `supplement_items` | `item_regulations.item_id` が一致する全レコード | DB トリガー（`trg_xxx_items_delete`）で実装済み（ポリモーフィック FK のため CASCADE 制約は使用不可） |

> **注意**: 神格・流派・種族・サプリメントを削除すると、紐づく `item_regulations` レコードが削除される。削除確認ダイアログは「このアイテムを削除しますか？」の単純表示とする（使用中レギュレーション数の表示は将来の拡張として検討）。

> **注意**: `regulation_items` の RLS は `publish_type = 'public'` のみ許可しているため、管理画面での全件取得（下書き含む）は Service Role Key 経由（RLS バイパス）が必須。

> **is_always フラグ変更時の自動クリーンアップ**: god / school / race / supplement で `is_always` を `false → true` に変更すると、対象アイテムが紐づく `item_regulations` レコードが DB トリガーにより自動削除される（`trg_xxx_items_is_always` トリガー）。
>
> **is_always を `true → false` に戻した場合**: `item_regulations` は自動復元されない。変更後は該当アイテムを使用したいレギュレーションの編集画面から手動で紐付けし直すこと。

---

## 共通コンポーネント設計

### フォームコンポーネント命名規則

Issue指定: `XXXField`（例: `TextareaField`, `TextInputField`）

```
component/molecules/field/
├── TextInputField.tsx      # テキスト入力（type=text / password）
├── TextareaField.tsx       # テキストエリア
├── SelectField.tsx         # セレクトボックス
├── CheckboxField.tsx       # チェックボックス
├── CheckboxGroupField.tsx  # チェックボックスグループ（複数選択）
└── NumberInputField.tsx    # 数値入力
```

---

### 共通organisms・templates設計方針

エンティティごとにコンポーネントを作らず、**共通コンポーネント + エンティティ設定定数**で全画面を統一する。

#### 共通organisms

```
component/organisms/
├── ItemTable.tsx     # 全エンティティ共通テーブル（列定義を外から受け取る）
└── ItemForm.tsx      # 全エンティティ共通フォーム（フォーム定義を外から受け取る）
```

#### 共通templates

```
component/templates/
├── AdminLayoutTemplate.tsx   # 共通レイアウト（サイドバー + ヘッダー）
├── ItemListTemplate.tsx      # 一覧画面共通テンプレート（ItemTable使用）
└── ItemEditTemplate.tsx      # 編集・追加画面共通テンプレート（ItemForm使用）
```

#### エンティティ設定定数

各エンティティの列定義・フォーム定義・ラベル等を `const/config/` に集約する。

```
const/config/
├── index.ts          # type文字列 → EntityConfig のマップ（configMap）
├── regulation.ts
├── god.ts
├── school.ts
├── race.ts
├── houseRule.ts
├── prohibition.ts
├── supplement.ts
└── original.ts
```

#### 型定義

```typescript
// const/type/table/TableColumnType.ts
import type { ReactNode } from "react";
export type TableColumnType = {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
};

// const/type/config/EntityConfigType.ts
import type { TableColumnType } from "@/const/type/table/TableColumnType";
import type { FormItemType } from "@/const/type/form/FormItemType";
export type EntityConfigType = {
  apiType: string;
  listTitle: string;
  addLabel: string;
  editTitle: string;
  deleteConfirm: string;
  columns: TableColumnType[];
  formItems: FormItemType[];
  initialForm: Record<string, unknown>;
  toForm: (data: Record<string, unknown>) => Record<string, unknown>;
  toBody: (form: Record<string, unknown>) => Record<string, unknown>;
};
```

#### ページの構成（2ファイルで全エンティティ対応）

```typescript
// app/[type]/page.tsx      → configMap[type] を引いて ItemListTemplate を描画
// app/[type]/[id]/page.tsx → configMap[type] を引いて ItemEditTemplate を描画
//                            id="new" で新規、数値で編集
```

---

### フォーム定数の設計方針（認証画面のみ）

認証画面（ログイン・サインイン・パスワードリセット）のフォーム項目は `const/form/` で管理する。  
エンティティ管理画面の定義は `const/config/` に集約する。

```
const/form/
├── LOGIN_FORM_ITEM.tsx
├── SIGNIN_FORM_ITEM.tsx
└── RESET_PASSWORD_FORM_ITEM.tsx
```

#### FormItemType の型定義

```typescript
// const/type/form/FormItemType.ts
export type FormItemType = {
  column: string;
  label: string;
  type: "text" | "textarea" | "password" | "number" | "checkbox" | "checkbox-group" | "select";
  rule?: {
    required?: boolean;
    minLength?: number;
    pattern?: string;
  };
  option?: readonly { label: string; value: string | number }[];
};
```

#### 定数ファイルの例

```typescript
// const/form/GOD_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const GOD_FORM_ITEM: { [key: string]: FormItemType } = {
  TYPE: {
    column: "type",
    label: "タイプ",
    type: "select",
    rule: { required: true },
    option: [
      { label: "第一", value: 1 },
      { label: "第二", value: 2 },
      { label: "第三", value: 3 },
    ],
  },
  NAME: {
    column: "name",
    label: "名前",
    type: "text",
    rule: { required: true },
  },
  URL: {
    column: "url",
    label: "URL",
    type: "text",
  },
  IS_ALWAYS: {
    column: "isAlways",
    label: "常時使用可能",
    type: "checkbox",
  },
} as const;
```

### ドメイン型定義

admin は client と独立した Next.js プロジェクトのため、client で定義済みの union type を admin の `const/type/` 配下にも同名で定義する。

```
const/type/
├── common/
│   └── RuleType.ts           # "common" | "item" | "race" | "skill" | "battleSkill" | "school" | "supplement"
├── race/
│   └── RaceListType.ts       # "human" | "barbaros" | "demon" | "maginery" | "mysthicalBeast"
├── god/
│   └── GodType.ts            # 1 | 2 | 3
├── itemRegulation/
│   └── ItemRegulationType.ts # "race" | "god" | "school" | "supplement"
├── auth/
│   └── UserRoleType.ts       # "common" | "admin"
└── form/
    └── FormItemType.ts       # フォーム項目の共通型
```

```typescript
// const/type/common/RuleType.ts
export type RuleType = "common" | "item" | "race" | "skill" | "battleSkill" | "school" | "supplement";

// const/type/race/RaceListType.ts
export type RaceListType = "human" | "barbaros" | "demon" | "maginery" | "mysthicalBeast";

// const/type/god/GodType.ts
export type GodType = 1 | 2 | 3;

// const/type/itemRegulation/ItemRegulationType.ts
export type ItemRegulationItemType = "race" | "god" | "school" | "supplement";

// const/type/auth/UserRoleType.ts
export type UserRoleType = "common" | "admin";
```

---

### レイアウト共通コンポーネント

```
component/templates/
├── AdminLayoutTemplate.tsx   # 共通レイアウト（サイドバー + ヘッダー）
├── ListTemplate.tsx          # 一覧画面共通テンプレート
└── EditTemplate.tsx          # 編集・追加画面共通テンプレート
```

- `ListTemplate.tsx` は各エンティティの `XXXListTemplate` が内部で使用する共通ベースコンポーネント
- `EditTemplate.tsx` は各エンティティの `XXXEditTemplate` が内部で使用する共通ベースコンポーネント

---

## PC/SP対応方針

- Chakra UIのレスポンシブProps（`base`, `md`, `lg`）を使用
- テーブル一覧: PCはTable、SPはカード形式 or 横スクロール対応

### ナビゲーション設計

#### PC版（`md` ブレークポイント以上）

- 画面左に **サイドバーメニュー**を固定表示
- 常時展開状態で各管理画面へのリンクを一覧表示
- メインコンテンツ領域はサイドバーの右側に配置

```
┌──────────┬───────────────────────────┐
│          │  ヘッダー（ログアウト等） │
│ サイドバー│───────────────────────────│
│          │                           │
│ メニュー │  メインコンテンツ         │
│ リンク   │                           │
│ ...      │                           │
└──────────┴───────────────────────────┘
```

#### SP版（`base` ブレークポイント）

- 画面上部に **ハンバーガーメニューボタン**を表示
- ボタン押下でサイドバーが **ドロワー（オーバーレイ）** として画面左からスライドイン
- ドロワー外タップまたはリンク選択で閉じる

```
┌─────────────────────┐
│ ☰  ページタイトル  │  ← ハンバーガーボタン
├─────────────────────┤
│                     │
│  メインコンテンツ   │
│                     │
└─────────────────────┘

（ドロワー展開時）
┌──────────┬──────────┐
│          │          │
│ サイドバー│ （暗転）  │
│ メニュー │          │
│ ...      │          │
└──────────┴──────────┘
```

### 実装コンポーネント

```
component/
├── organisms/
│   └── layout/
│       ├── Sidebar.tsx          # サイドバーメニュー本体（PC・SP共通の中身）
│       ├── SidebarDrawer.tsx    # SP用ドロワーラッパー（Chakra UI Drawer使用）
│       └── Header.tsx           # ヘッダー（SP時: ハンバーガーボタン + ページタイトル）
└── templates/
    └── AdminLayoutTemplate.tsx  # PC/SP切り替えロジックを含むレイアウトテンプレート
```

### サイドバーメニュー項目

| 表示名 | リンク先 |
|--------|---------|
| ダッシュボード | `/` |
| レギュレーション管理 | `/regulation` |
| 神格管理 | `/god` |
| 流派管理 | `/school` |
| 種族管理 | `/race` |
| ハウスルール管理 | `/house-rule` |
| 禁止事項管理 | `/prohibition` |
| サプリメント管理 | `/supplement` |
| オリジナルアイテム管理 | `/original` |

---

## マイグレーション実行順序

Supabase Local Dev では以下の順序で自動実行される。

```
001_create_tables.sql          → テーブル作成・RLS基本設定
002_add_audit_and_publish.sql  → シーケンス・user_meta・FK・トリガー・監査カラム・RLS更新・インデックス・CHECK制約追加
seed.sql                       → テストデータ投入
```

> **注意**: マイグレーションは必ず番号順に実行すること。002 が 001 に依存しているため、順序を変えるとエラーになる。

---

## 環境変数

```
# application/frontend/admin/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...   # API Route（全DB操作）で使用
SIGNUP_CODE=xxxx                     # サインイン画面の登録コード（合言葉）
```

> **SIGNUP_CODE 運用注意**: コードが漏洩した場合は `.env.local` の値を変更し、Vercel の環境変数を更新して再デプロイすること。コードは1つのみで失効機能はないため、定期的な変更を推奨。

---

## 実装順序（案）

1. 共通基盤（Supabase接続・認証・レイアウト・フォームコンポーネント）
2. ログイン機能
3. 各管理画面（一覧 → 編集/追加の順）
   - レギュレーション → 神格 → 流派 → 種族 → ハウスルール → 禁止事項 → サプリメント → オリジナルアイテム管理
