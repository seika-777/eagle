# 流派管理画面 設計

## 概要

`school_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### school_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | 流派ID（自動採番） |
| name | text | 名前 |
| url | text | 参照URL |
| is_always | boolean | 常時使用可能フラグ |
| notes | text | 備考 |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/school` | 流派一覧テーブル |
| 追加画面 | `/school/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/school/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/school/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── school/
│       ├── SchoolListTemplate.tsx
│       └── SchoolEditTemplate.tsx
└── organisms/
    └── school/
        ├── SchoolTable.tsx
        └── SchoolForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| name | 名前 |
| url | URL |
| is_always | 常時 |
| notes | 備考 |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/school/new` へ遷移 |
| 編集ボタン | `/school/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| name | `TextInputField` | 必須 |
| url | `TextInputField` | - |
| is_always | `CheckboxField` | - |
| notes | `TextareaField` | - |

### アクション

| アクション | 処理 |
|-----------|------|
| 保存ボタン（新規） | INSERT school_items → 一覧へリダイレクト |
| 保存ボタン（編集） | UPDATE school_items → 一覧へリダイレクト |
| キャンセル | 一覧へ戻る |

---

## DB操作関数

```
const/function/
├── getSchoolItemsAdmin.ts      # 一覧取得（全件）
├── getSchoolItemAdmin.ts       # 1件取得（編集フォーム用）
├── createSchoolItem.ts         # INSERT school_items
├── updateSchoolItem.ts         # UPDATE school_items
└── deleteSchoolItem.ts         # DELETE school_items
```

---

## フォーム定数

```typescript
// const/form/SCHOOL_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const SCHOOL_FORM_ITEM: { [key: string]: FormItemType } = {
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
// const/type/school/SchoolFormType.ts
export type SchoolFormType = {
  name: string;
  url: string;
  isAlways: boolean;
  notes: string;
};
```

---

## 画面定数

```typescript
// const/pages/SCHOOL_ADMIN.tsx
export const SCHOOL_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "流派管理",
    ADD: "流派を追加",
    EDIT: "流派を編集",
    DELETE_CONFIRM: "この流派を削除しますか？",
  },
  VALUE: {},
} as const;
```
