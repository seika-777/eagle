# 禁止事項管理画面 設計

## 概要

`prohibition_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### prohibition_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | 禁止事項ID（自動採番） |
| about | text | カテゴリ・概要 |
| name | text | 禁止事項名 |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/prohibition` | 禁止事項一覧テーブル |
| 追加画面 | `/prohibition/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/prohibition/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/prohibition/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── prohibition/
│       ├── ProhibitionListTemplate.tsx
│       └── ProhibitionEditTemplate.tsx
└── organisms/
    └── prohibition/
        ├── ProhibitionTable.tsx
        └── ProhibitionForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| about | カテゴリ |
| name | 禁止事項名 |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/prohibition/new` へ遷移 |
| 編集ボタン | `/prohibition/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| about | `TextInputField` | 必須 |
| name | `TextInputField` | 必須 |

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
├── getProhibitionItemsAdmin.ts  # 一覧取得（全件）
├── getProhibitionItemAdmin.ts   # 1件取得（編集フォーム用）
├── createProhibitionItem.ts     # INSERT
├── updateProhibitionItem.ts     # UPDATE
└── deleteProhibitionItem.ts     # DELETE
```

---

## フォーム定数

```typescript
// const/form/PROHIBITION_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const PROHIBITION_FORM_ITEM: { [key: string]: FormItemType } = {
  ABOUT: {
    column: "about",
    label: "カテゴリ",
    type: "text",
    rule: { required: true },
  },
  NAME: {
    column: "name",
    label: "禁止事項名",
    type: "text",
    rule: { required: true },
  },
} as const;
```

---

## 型定義

```typescript
// const/type/prohibition/ProhibitionFormType.ts
export type ProhibitionFormType = {
  about: string;
  name: string;
};
```

---

## 画面定数

```typescript
// const/pages/PROHIBITION_ADMIN.tsx
export const PROHIBITION_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "禁止事項管理",
    ADD: "禁止事項を追加",
    EDIT: "禁止事項を編集",
    DELETE_CONFIRM: "この禁止事項を削除しますか？",
  },
  VALUE: {},
} as const;
```
