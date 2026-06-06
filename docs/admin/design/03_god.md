# 神格管理画面 設計

## 概要

`god_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### god_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | 神格ID（自動採番） |
| type | integer | 神格タイプ（1=第一, 2=第二, 3=第三） |
| name | text | 名前 |
| url | text | 参照URL |
| is_always | boolean | 常時使用可能フラグ |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/god` | 神格一覧テーブル |
| 追加画面 | `/god/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/god/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/god/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── god/
│       ├── GodListTemplate.tsx
│       └── GodEditTemplate.tsx
└── organisms/
    └── god/
        ├── GodTable.tsx
        └── GodForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| type | タイプ（第一 / 第二 / 第三） |
| name | 名前 |
| url | URL |
| is_always | 常時 |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/god/new` へ遷移（`[id]` に "new" が入る） |
| 編集ボタン | `/god/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| type | `SelectField` | 必須（第一=1 / 第二=2 / 第三=3） |
| name | `TextInputField` | 必須 |
| url | `TextInputField` | - |
| is_always | `CheckboxField` | - |

### アクション

| アクション | 処理 |
|-----------|------|
| 保存ボタン（新規） | INSERT god_items → 一覧へリダイレクト |
| 保存ボタン（編集） | UPDATE god_items → 一覧へリダイレクト |
| キャンセル | 一覧へ戻る |

---

## DB操作関数

```
const/function/
├── getGodItemsAdmin.ts         # 一覧取得（全件）
├── getGodItemAdmin.ts          # 1件取得（編集フォーム用）
├── createGodItem.ts            # INSERT god_items
├── updateGodItem.ts            # UPDATE god_items
└── deleteGodItem.ts            # DELETE god_items
```

---

## フォーム定数

```typescript
// const/form/GOD_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";
import type { GodType } from "@/const/type/god/GodType";

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

---

## 型定義

```typescript
// const/type/god/GodFormType.ts
import type { GodType } from "@/const/type/god/GodType";

export type GodFormType = {
  type: GodType;
  name: string;
  url: string;
  isAlways: boolean;
};
```

---

## 画面定数

```typescript
// const/pages/GOD_ADMIN.tsx
export const GOD_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "神格管理",
    ADD: "神格を追加",
    EDIT: "神格を編集",
    DELETE_CONFIRM: "この神格を削除しますか？",
  },
  VALUE: {},
} as const;
```
