# レギュレーション管理画面 設計

## 概要

`regulation_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### regulation_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | レギュレーションID（自動採番） |
| name | text | 名前 |
| description | text | 説明 |
| recruitment | text | 募集内容 |
| stage | text | 舞台設定 |
| race | text | 種族に関する自由記述テキスト（`item_regulations` の `raceIds` による紐付けとは独立した補足説明欄） |
| supplement | text | サプリメントに関する自由記述テキスト（`item_regulations` の `supplementIds` による紐付けとは独立した補足説明欄） |
| notes | text | 備考 |
| level_cap_belt | text | レベルキャップ・ベルト情報（"B" = 標準キャップ / "C" = 上限解放キャップ。必須。CHECK制約あり） |
| publish_type | text | 公開状態（"public"=公開 / "draft"=下書き） |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

### item_regulations（関連テーブル）

| カラム | 型 | 説明 |
|--------|-----|------|
| item_type | text (PK) | アイテム種別（"god" / "school" / "race" / "supplement"） |
| item_id | integer (PK) | 対象アイテムのID |
| regulation_id | integer (PK, FK → regulation_items.id ON DELETE CASCADE) | レギュレーションID |

主キーは `(item_type, item_id, regulation_id)` の複合 PK。独立した `id` カラムは存在しない。

`is_always = false` の神格・流派・種族・サプリメントについて、レギュレーション編集フォームから紐付けを一元管理する。

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/regulation` | レギュレーション一覧テーブル |
| 追加画面 | `/regulation/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/regulation/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/regulation/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── regulation/
│       ├── RegulationListTemplate.tsx
│       └── RegulationEditTemplate.tsx
└── organisms/
    └── regulation/
        ├── RegulationTable.tsx
        └── RegulationForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| name | 名前 |
| stage | 舞台 |
| recruitment | 募集 |
| publish_type | 公開状態（公開 / 下書き） |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/regulation/new` へ遷移 |
| 編集ボタン | `/regulation/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| name | `TextInputField` | 必須 |
| description | `TextareaField` | - |
| recruitment | `TextareaField` | - |
| stage | `TextareaField` | - |
| race | `TextareaField` | - |
| supplement | `TextareaField` | - |
| notes | `TextareaField` | - |
| level_cap_belt | `SelectField` | 必須（B / C） |
| publish_type | `SelectField` | 必須（"public"=公開 / "draft"=下書き）デフォルト: "draft"。公開後も自由に変更可 |
| 使用可能神格 | `CheckboxGroupField` | `is_always = false` の god_items を選択肢に表示 |
| 使用可能流派 | `CheckboxGroupField` | `is_always = false` の school_items を選択肢に表示 |
| 使用可能種族 | `CheckboxGroupField` | `is_always = false` の race_items を選択肢に表示 |
| 使用可能サプリメント | `CheckboxGroupField` | `is_always = false` の supplement_items を選択肢に表示 |

### CheckboxGroupField の動作仕様

- **選択肢の取得**: フォーム表示時に各テーブルから `is_always = false` のレコードを全件取得し動的に構築
- **編集時の初期値**: `getRegulationItemAdmin` で `item_regulations` を合わせて取得し、`item_type` ごとに `item_id` の配列に変換してフォームの初期値として反映
- **新規時の初期値**: すべて空配列 `[]`

### アクション

| アクション | 処理 |
|-----------|------|
| 保存ボタン（新規） | INSERT regulation_items → item_regulations 同期（god/school/race/supplement） → 一覧へリダイレクト |
| 保存ボタン（編集） | UPDATE regulation_items → item_regulations 同期（god/school/race/supplement） → 一覧へリダイレクト |
| キャンセル | 一覧へ戻る |

> **注意（実装時）** item_regulations の同期は Supabase RPC `sync_item_regulations` を使いトランザクション内で実行すること。
> ```typescript
> await supabaseAdmin.rpc('sync_item_regulations', {
>   p_regulation_id: regulationId,
>   p_god_ids: godIds,
>   p_school_ids: schoolIds,
>   p_race_ids: raceIds,
>   p_supplement_ids: supplementIds,
> });
> ```
> 関数定義は `supabase/migrations/002_add_audit_and_publish.sql` を参照。

### API リクエストボディ

`RegulationFormType` をそのままボディとして送信する。`godIds` 等の仮想フィールドは API Route 内で分離し `item_regulations` に同期する。

```typescript
// POST /api/items?type=regulation（新規）
// PUT  /api/items?type=regulation&id={id}（編集）
body: RegulationFormType
```

---

## DB操作関数

```
const/function/
├── getRegulationItemsAdmin.ts   # 一覧取得（全件）
├── getRegulationItemAdmin.ts    # 1件取得（編集フォーム用）regulation_items + item_regulations を取得し godIds/schoolIds/raceIds/supplementIds に変換
├── createRegulationItem.ts      # INSERT regulation_items + item_regulations 同期（god/school/race/supplement）
├── updateRegulationItem.ts      # UPDATE regulation_items + item_regulations 同期（god/school/race/supplement）
└── deleteRegulationItem.ts      # DELETE regulation_items
```

---

## フォーム定数

```typescript
// const/form/REGULATION_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const REGULATION_FORM_ITEM: { [key: string]: FormItemType } = {
  NAME: {
    column: "name",
    label: "名前",
    type: "text",
    rule: { required: true },
  },
  DESCRIPTION: {
    column: "description",
    label: "説明",
    type: "textarea",
  },
  RECRUITMENT: {
    column: "recruitment",
    label: "募集内容",
    type: "textarea",
  },
  STAGE: {
    column: "stage",
    label: "舞台設定",
    type: "textarea",
  },
  RACE: {
    column: "race",
    label: "種族",
    type: "textarea",
  },
  SUPPLEMENT: {
    column: "supplement",
    label: "サプリメント",
    type: "textarea",
  },
  NOTES: {
    column: "notes",
    label: "備考",
    type: "textarea",
  },
  LEVEL_CAP_BELT: {
    column: "levelCapBelt",
    label: "レベルキャップ・ベルト",
    type: "select",
    rule: { required: true },
    option: [
      { label: "B", value: "B" },
      { label: "C", value: "C" },
    ],
  },
  PUBLISH_TYPE: {
    column: "publishType",
    label: "公開状態",
    type: "select",
    rule: { required: true },
    option: [
      { label: "下書き", value: "draft" },
      { label: "公開", value: "public" },
    ],
  },
  GOD_IDS: {
    column: "godIds",
    label: "使用可能神格",
    type: "checkbox-group",
    // option は is_always=false の god_items をDBから動的取得
  },
  SCHOOL_IDS: {
    column: "schoolIds",
    label: "使用可能流派",
    type: "checkbox-group",
    // option は is_always=false の school_items をDBから動的取得
  },
  RACE_IDS: {
    column: "raceIds",
    label: "使用可能種族",
    type: "checkbox-group",
    // option は is_always=false の race_items をDBから動的取得
  },
  SUPPLEMENT_IDS: {
    column: "supplementIds",
    label: "使用可能サプリメント",
    type: "checkbox-group",
    // option は is_always=false の supplement_items をDBから動的取得
  },
} as const;
```

---

## 型定義

```typescript
// const/type/regulation/RegulationFormType.ts
export type RegulationFormType = {
  name: string;
  description: string;
  recruitment: string;
  stage: string;
  race: string;
  supplement: string;
  notes: string;
  levelCapBelt: "B" | "C";
  publishType: "public" | "draft";
  godIds: number[];
  schoolIds: number[];
  raceIds: number[];
  supplementIds: number[];
};
```

---

## 画面定数

```typescript
// const/pages/REGULATION_ADMIN.tsx
export const REGULATION_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "レギュレーション管理",
    ADD: "レギュレーションを追加",
    EDIT: "レギュレーションを編集",
    DELETE_CONFIRM: "このレギュレーションを削除しますか？",
  },
  VALUE: {},
} as const;
```
