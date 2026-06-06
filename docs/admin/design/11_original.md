# オリジナルアイテム管理画面 設計

## 概要

`original_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### original_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | オリジナルアイテムID（自動採番） |
| type | text | アイテム種別（自由入力。例: 騎獣 / 装飾品 / 冒険道具類） |
| name | text | アイテム名 |
| url | text | 参照URL |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/original` | オリジナルアイテム一覧テーブル |
| 追加画面 | `/original/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/original/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/original/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── original/
│       ├── OriginalListTemplate.tsx
│       └── OriginalEditTemplate.tsx
└── organisms/
    └── original/
        ├── OriginalTable.tsx
        └── OriginalForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| type | 種別 |
| name | アイテム名 |
| url | URL |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/original/new` へ遷移 |
| 編集ボタン | `/original/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| type | `TextInputField` | 必須 |
| name | `TextInputField` | 必須 |
| url | `TextInputField` | - |

### アクション

| アクション | 処理 |
|-----------|------|
| 保存ボタン（新規） | INSERT → 一覧へリダイレクト |
| 保存ボタン（編集） | UPDATE → 一覧へリダイレクト |
| キャンセル | 一覧へ戻る |

---

## DB操作関数

```
const/function/
├── getOriginalItemsAdmin.ts   # 一覧取得（全件）
├── getOriginalItemAdmin.ts    # 1件取得（編集フォーム用）
├── createOriginalItem.ts      # INSERT
├── updateOriginalItem.ts      # UPDATE
└── deleteOriginalItem.ts      # DELETE
```

---

## フォーム定数

```typescript
// const/form/ORIGINAL_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const ORIGINAL_FORM_ITEM: { [key: string]: FormItemType } = {
  TYPE: {
    column: "type",
    label: "種別",
    type: "text",
    rule: { required: true },
  },
  NAME: {
    column: "name",
    label: "アイテム名",
    type: "text",
    rule: { required: true },
  },
  URL: {
    column: "url",
    label: "URL",
    type: "text",
  },
} as const;
```

---

## 型定義

```typescript
// const/type/original/OriginalFormType.ts
export type OriginalFormType = {
  type: string;
  name: string;
  url: string;
};
```

---

## 画面定数

```typescript
// const/pages/ORIGINAL_ADMIN.tsx
export const ORIGINAL_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "オリジナルアイテム管理",
    ADD: "オリジナルアイテムを追加",
    EDIT: "オリジナルアイテムを編集",
    DELETE_CONFIRM: "このオリジナルアイテムを削除しますか？",
  },
  VALUE: {},
} as const;
```
