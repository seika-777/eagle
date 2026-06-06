# 種族管理画面 設計

## 概要

`race_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### race_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | 種族ID（自動採番） |
| name | text | 名前 |
| race_type | text[] | 種族タイプ（配列） |
| url | text | 参照URL |
| is_always | boolean | 常時使用可能フラグ |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/race` | 種族一覧テーブル |
| 追加画面 | `/race/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/race/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/race/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── race/
│       ├── RaceListTemplate.tsx
│       └── RaceEditTemplate.tsx
└── organisms/
    └── race/
        ├── RaceTable.tsx
        └── RaceForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| name | 名前 |
| race_type | タイプ（カンマ区切り表示） |
| url | URL |
| is_always | 常時 |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/race/new` へ遷移 |
| 編集ボタン | `/race/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| name | `TextInputField` | 必須 |
| race_type | `CheckboxGroupField` | - |
| url | `TextInputField` | - |
| is_always | `CheckboxField` | - |

### race_type 選択肢

`RaceListType` に定義された5種類を固定選択肢として使用する。

| 値 | 表示ラベル |
|----|----------|
| human | ヒューマン |
| barbaros | バルバロス |
| demon | デーモン |
| maginery | マジナリー |
| mysthicalBeast | ミスティカルビースト |

### アクション

| アクション | 処理 |
|-----------|------|
| 保存ボタン（新規） | INSERT race_items → 一覧へリダイレクト |
| 保存ボタン（編集） | UPDATE race_items → 一覧へリダイレクト |
| キャンセル | 一覧へ戻る |

---

## DB操作関数

```
const/function/
├── getRaceItemsAdmin.ts        # 一覧取得（全件）
├── getRaceItemAdmin.ts         # 1件取得（編集フォーム用）
├── createRaceItem.ts           # INSERT race_items
├── updateRaceItem.ts           # UPDATE race_items
└── deleteRaceItem.ts           # DELETE race_items
```

---

## フォーム定数

```typescript
// const/form/RACE_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const RACE_FORM_ITEM: { [key: string]: FormItemType } = {
  NAME: {
    column: "name",
    label: "名前",
    type: "text",
    rule: { required: true },
  },
  RACE_TYPE: {
    column: "raceType",
    label: "種族タイプ",
    type: "checkbox-group",
    option: [
      { label: "ヒューマン", value: "human" },
      { label: "バルバロス", value: "barbaros" },
      { label: "デーモン", value: "demon" },
      { label: "マジナリー", value: "maginery" },
      { label: "ミスティカルビースト", value: "mysthicalBeast" },
    ],
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
// const/type/race/RaceFormType.ts
import type { RaceListType } from "@/const/type/race/RaceListType";

export type RaceFormType = {
  name: string;
  raceType: RaceListType[];
  url: string;
  isAlways: boolean;
};
```

---

## 画面定数

```typescript
// const/pages/RACE_ADMIN.tsx
export const RACE_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "種族管理",
    ADD: "種族を追加",
    EDIT: "種族を編集",
    DELETE_CONFIRM: "この種族を削除しますか？",
  },
  VALUE: {},
} as const;
```
