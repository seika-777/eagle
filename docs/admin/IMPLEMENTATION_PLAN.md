# Admin画面 実装計画

> Issue: https://github.com/seika-777/eagle/issues/22  
> 設計概要: [00_overview.md](./design/00_overview.md)  
> マイグレーション状況: `001_create_tables.sql` 実行済み / `002_add_audit_and_publish.sql` 未実行

---

## フェーズ0: 事前準備

### 0-1. マイグレーション実行
- [x] `002_add_audit_and_publish.sql` をSupabaseに適用する
  - シーケンス（SERIAL相当）追加
  - `user_meta` テーブル作成
  - `item_regulations` FK制約・CHECK制約追加
  - 監査カラム（`updated_by`, `updated_at`）追加
  - `regulation_items` の `publish_type` カラム追加
  - `sync_item_regulations` RPC関数作成
  - `is_always` 変更時クリーンアップトリガー作成
  - インデックス追加
  - `level_cap_belt` CHECK制約追加

### 0-2. 環境変数設定
- [ ] `application/frontend/admin/.env.local` に以下を設定する
  - [x] `NEXT_PUBLIC_SUPABASE_URL`（設定済み）
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`（設定済み）
  - [x] `SUPABASE_SERVICE_ROLE_KEY`（設定済み）
  - [x] `SIGNUP_CODE`（設定済み）

---

## フェーズ1: 共通基盤

### 1-1. パッケージ追加
- [x] `@supabase/supabase-js` インストール（インストール済み）
- [x] `@supabase/ssr` インストール（インストール済み）

### 1-2. Supabaseクライアント
- [x] `lib/supabase.ts` 作成（フロントエンド用・anon key）
- [x] `lib/supabaseAdmin.ts` 作成（API Route専用・Service Role Key）

### 1-3. 型定義
- [x] `const/type/auth/UserRoleType.ts` 作成（`"common" | "admin"`）
- [x] `const/type/auth/UserMetaType.ts` 作成
- [x] `const/type/auth/LoginFormType.ts` 作成
- [x] `const/type/auth/SigninFormType.ts` 作成
- [x] `const/type/form/FormItemType.ts` 作成
- [x] `const/type/common/RuleType.ts` 作成
- [x] `const/type/god/GodType.ts` 作成（`1 | 2 | 3`）
- [x] `const/type/race/RaceListType.ts` 作成
- [x] `const/type/itemRegulation/ItemRegulationType.ts` 作成
- [x] `const/type/regulation/RegulationFormType.ts` 作成
- [x] `const/type/god/GodFormType.ts` 作成
- [x] `const/type/school/SchoolFormType.ts` 作成
- [x] `const/type/race/RaceFormType.ts` 作成
- [x] `const/type/houseRule/HouseRuleFormType.ts` 作成
- [x] `const/type/prohibition/ProhibitionFormType.ts` 作成
- [x] `const/type/supplement/SupplementFormType.ts` 作成
- [x] `const/type/original/OriginalFormType.ts` 作成

### 1-4. React Context（ユーザー状態管理）
- [x] `app/AppWrapper.tsx` 更新（UserContext Provider を追加）
  - `UserMetaType` の状態を管理
  - `AdminLayoutTemplate` の初回レンダリング時に `user_meta` から取得

### 1-5. hooks
- [x] `hooks/useErrorHandler.ts` 作成

### 1-6. middleware（認証ガード）
- [x] `middleware.ts` 作成
  - `@supabase/ssr` の `createServerClient` を使用（Edge Runtime対応）
  - 未認証 → `/login` リダイレクト
  - `role = "common"` かつ `/` 以外 → `/` リダイレクト
  - ログイン済みで `/login`/`/signin`/`/reset-password` → `/` リダイレクト
  - APIルートの未認証 → 401返却
  - APIルートの `role = "common"` → 403返却
  - matcher設定（`_next/static`, `_next/image`, `favicon.ico` 除外）

### 1-7. フォームコンポーネント（atoms/molecules）
- [x] `component/molecules/field/TextInputField.tsx` 作成（type=text / password）
- [x] `component/molecules/field/TextareaField.tsx` 作成
- [x] `component/molecules/field/SelectField.tsx` 作成
- [x] `component/molecules/field/CheckboxField.tsx` 作成
- [x] `component/molecules/field/CheckboxGroupField.tsx` 作成
- [x] `component/molecules/field/NumberInputField.tsx` 作成

### 1-8. レイアウトコンポーネント
- [x] `component/organisms/layout/Sidebar.tsx` 作成（サイドバーメニュー本体）
  - サイドバーメニュー項目を全て含む（ダッシュボード〜オリジナルアイテム管理）
- [x] `component/organisms/layout/SidebarDrawer.tsx` 作成（SP用ドロワーラッパー）
- [x] `component/organisms/layout/Header.tsx` 作成（SP時ハンバーガー + ページタイトル、ログアウトボタン）
- [x] `component/templates/AdminLayoutTemplate.tsx` 作成
  - PC: サイドバー固定表示
  - SP: ハンバーガーメニュー + ドロワー
  - ログアウト処理（`supabase.auth.signOut()` → `/login` リダイレクト）

### 1-9. 共通テンプレート（暫定・フェーズ5で ItemListTemplate / ItemEditTemplate に置き換え）
- [x] `component/templates/ListTemplate.tsx` 作成（暫定ベース）
- [x] `component/templates/EditTemplate.tsx` 作成（暫定ベース）

---

## フェーズ2: 認証機能

### 2-1. API Route（認証）
- [x] `app/api/auth/route.ts` 作成
  - `action: "login"` 処理
    - `user_meta` から `user_id` でレコード取得
    - email組み立て（`{userId}@eagle-admin.internal`）
    - `signInWithPassword` 呼び出し
    - 成功時 `role` をレスポンスに含める
    - 失敗時 401（ユーザー列挙攻撃防止のため同一メッセージ）
  - `action: "signup"` 処理
    - 登録コード検証（環境変数 `SIGNUP_CODE` と比較）
    - `user_id` 形式バリデーション（英数字・アンダースコアのみ）
    - `user_meta` で重複チェック（重複時 409）
    - Supabase Auth でユーザー作成（`supabaseAdmin` 使用）
    - `user_meta` INSERT（`role: "common"`, `is_editable: false`）
  - `action: "reset-password"` 処理
    - `user_meta` で `user_id` 検索（不存在時 401）
    - `is_editable` 確認（false時 403）
    - `supabaseAdmin.auth.admin.updateUserById` でパスワード更新
    - `user_meta.is_editable` を false に更新

### 2-2. ログイン画面
- [x] `const/form/LOGIN_FORM_ITEM.tsx` 作成
- [x] `const/pages/LOGIN.tsx` 作成
- [x] `component/organisms/login/LoginForm.tsx` 作成
- [x] `component/templates/LoginTemplate.tsx` 作成
- [x] `app/login/page.tsx` 作成

### 2-3. サインイン（新規登録）画面
- [x] `const/form/SIGNIN_FORM_ITEM.tsx` 作成
- [x] `const/pages/SIGNIN.tsx` 作成
- [x] `component/organisms/signin/SigninForm.tsx` 作成
- [x] `component/templates/SigninTemplate.tsx` 作成
- [x] `app/signin/page.tsx` 作成

### 2-4. パスワードリセット画面
- [x] `const/form/RESET_PASSWORD_FORM_ITEM.tsx` 作成
- [x] `component/organisms/resetPassword/ResetPasswordForm.tsx` 作成
- [x] `component/templates/ResetPasswordTemplate.tsx` 作成
- [x] `app/reset-password/page.tsx` 作成

---

## フェーズ3: ダッシュボード

### 3-1. ダッシュボード
- [x] `const/pages/DASHBOARD.tsx` 作成（`DASHBOARD_CARDS` 含む）
- [x] `component/organisms/dashboard/DashboardCardGrid.tsx` 作成
  - `role = "admin"`: 管理画面リンクカード一覧（3列グリッド）
  - `role = "common"`: 「むしずまでご連絡ください。」メッセージのみ
- [x] `component/templates/DashboardTemplate.tsx` 作成
- [x] `app/page.tsx` 更新（ダッシュボードページ）

---

## フェーズ4: API Route（CRUD統合）

- [x] `app/api/items/route.ts` 作成
  - 全メソッドで Cookie からセッション検証（未認証: 401、`role !== "admin"`: 403）
  - **GET** `?type=xxx` → 一覧取得（全件）
  - **GET** `?type=xxx&is_always=false` → `is_always=false` のみ取得（god/school/race/supplement）
  - **GET** `?type=xxx&id=1` → 1件取得（regulationは `item_regulations` も含む）
  - **POST** `?type=xxx` → 新規作成（regulation は `item_regulations` 同期含む）
  - **PUT** `?type=xxx&id=1` → 更新（楽観的ロック検証 + regulation は `item_regulations` 同期含む）
  - **DELETE** `?type=xxx&id=1` → 削除
  - エラーレスポンス統一形式（`{ error: string, code: string }`）
  - `type` 対応: `regulation` / `god` / `school` / `race` / `house-rule` / `prohibition` / `supplement` / `original`
  - regulation の POST/PUT: `godIds`/`schoolIds`/`raceIds`/`supplementIds` を分離して `sync_item_regulations` RPC呼び出し

---

## ルーティング設計（全管理画面共通）

| 画面 | パス |
|------|------|
| 一覧 | `/[type]` （例: `/regulation`） |
| 新規追加 | `/[type]/new`（`[id]` が "new"） |
| 編集 | `/[type]/[id]` |

ページファイルは `app/[type]/` 配下の2ファイル構成。`page.tsx` と organisms コンポーネントは `type` パラメータで振り分ける。`new` は別ディレクトリではなく `[id]/page.tsx` で `id="new"` として処理する。

```
app/[type]/
├── page.tsx      # 一覧（type で ListTemplate を切り替え）
└── [id]/
    └── page.tsx  # 編集・新規（type で EditTemplate を切り替え、id="new" で新規）
```

---

## フェーズ5: 共通型・共通コンポーネント（共通化基盤）

- [x] `const/type/table/TableColumnType.ts` 作成
- [x] `const/type/config/EntityConfigType.ts` 作成
- [x] `component/organisms/ItemTable.tsx` 作成（列定義 + データを受け取る共通テーブル）
- [x] `component/organisms/ItemForm.tsx` 作成（フォーム定義 + state を受け取る共通フォーム）
- [x] `component/templates/ItemListTemplate.tsx` 作成（ItemTable を使う共通一覧テンプレート）
- [x] `component/templates/ItemEditTemplate.tsx` 作成（ItemForm を使う共通編集テンプレート）

---

## フェーズ6: エンティティ設定定数

各エンティティの列定義・フォーム定義・ラベル等をすべて `const/config/` に定義する。

- [x] `const/config/regulation.ts` 作成（`item_regulations` の checkbox-group 対応含む）
- [x] `const/config/god.ts` 作成
- [x] `const/config/school.ts` 作成
- [x] `const/config/race.ts` 作成（`race_type` の checkbox-group 対応含む）
- [x] `const/config/houseRule.ts` 作成（`supplement_id` の動的選択肢対応含む）
- [x] `const/config/prohibition.ts` 作成
- [x] `const/config/supplement.ts` 作成
- [x] `const/config/original.ts` 作成
- [x] `const/config/index.ts` 作成（`configMap: Record<string, EntityConfigType>`）

---

## フェーズ7: 統一ページ（2ファイルで全エンティティ対応）

- [x] `app/[type]/page.tsx` 作成（`configMap[type]` を引いて `ItemListTemplate` を描画）
- [x] `app/[type]/[id]/page.tsx` 作成（`configMap[type]` を引いて `ItemEditTemplate` を描画、id="new" で新規）

---

## 実装全体の注意事項

- すべてのファイルは `application/frontend/admin/` 配下に作成
- import は絶対パス（`@/`）を使用
- Props は `type Props` として定義
- サブコンポーネントは親コンポーネント内に `const` で定義
- `return` 文は1つのみ（早期リターンでJSX返却禁止）
- エラー処理は `useErrorHandler` フックを使用
- 非同期処理は `async/await` を使用
- API Route の全操作で `updated_by`（ログインユーザーID）と `updated_at`（現在時刻）をセット
- PUT 操作では楽観的ロック（`updatedAt` 比較）を実施
- DB 操作関数（`const/function/`）はフロントからの呼び出し用（`/api/items` Route を経由）
