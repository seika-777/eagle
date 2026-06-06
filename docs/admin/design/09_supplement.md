# サプリメント管理画面 設計

## 概要

`supplement_items` テーブルの一覧・追加・編集機能。  
ハウスルール管理画面の `supplement_id` セレクトボックスにも使用される。

---

## 対象テーブル

### supplement_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | サプリメントID（自動採番） |
| name | text | 名前 |
| is_always | boolean | 常時使用可能フラグ |
| notes | text | 備考 |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/supplement` | サプリメント一覧テーブル |
| 追加画面 | `/supplement/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/supplement/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/supplement/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── supplement/
│       ├── SupplementListTemplate.tsx
│       └── SupplementEditTemplate.tsx
└── organisms/
    └── supplement/
        ├── SupplementTable.tsx
        └── SupplementForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| name | 名前 |
| is_always | 常時 |
| notes | 備考 |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/supplement/new` へ遷移 |
| 編集ボタン | `/supplement/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| name | `TextInputField` | 必須 |
| is_always | `CheckboxField` | - |
| notes | `TextareaField` | - |

### アクション

| アクション | 処理 |
|-----------|------|
| 保存ボタン（新規） | INSERT supplement_items → 一覧へリダイレクト |
| 保存ボタン（編集） | UPDATE supplement_items → 一覧へリダイレクト |
| キャンセル | 一覧へ戻る |

---

## DB操作関数

```
const/function/
├── getSupplementItemsAdmin.ts  # 一覧取得（全件）
├── getSupplementItemAdmin.ts   # 1件取得（編集フォーム用）
├── createSupplementItem.ts     # INSERT supplement_items
├── updateSupplementItem.ts     # UPDATE supplement_items
└── deleteSupplementItem.ts     # DELETE supplement_items
```

---

## フォーム定数

```typescript
// const/form/SUPPLEMENT_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const SUPPLEMENT_FORM_ITEM: { [key: string]: FormItemType } = {
  NAME: {
    column: "name",
    label: "名前",
    type: "text",
    rule: { required: true },
  },
  IS_ALWAYS: {
    column: "isAlways",
    label: "常時使用可能",
    type: "checkbox",
  },
  NOTES: {
    column: "notes",
    label: "備考",
    type: "textarea",
  },
} as const;
```

---

## 型定義

```typescript
// const/type/supplement/SupplementFormType.ts
export type SupplementFormType = {
  name: string;
  isAlways: boolean;
  notes: string;
};
```

---

## 画面定数

```typescript
// const/pages/SUPPLEMENT_ADMIN.tsx
export const SUPPLEMENT_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "サプリメント管理",
    ADD: "サプリメントを追加",
    EDIT: "サプリメントを編集",
    DELETE_CONFIRM: "このサプリメントを削除しますか？",
  },
  VALUE: {},
} as const;
```
