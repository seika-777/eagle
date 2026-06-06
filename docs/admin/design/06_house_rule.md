# ハウスルール管理画面 設計

## 概要

`house_rule_items` テーブルの一覧・追加・編集機能。

---

## 対象テーブル

### house_rule_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | integer (PK, SERIAL) | ハウスルールID（自動採番） |
| rule_type | text | ルール種別（固定値7種） |
| supplement_id | integer (nullable) | 関連サプリメントID（supplement_itemsへの参照） |
| about | text | 概要 |
| description | text | 詳細説明 |
| updated_by | uuid (nullable) | 最終更新者ID（auth.users.id） |
| updated_at | timestamptz (nullable) | 最終更新日時 |

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| 一覧画面 | `/house-rule` | ハウスルール一覧テーブル |
| 追加画面 | `/house-rule/new` | 新規追加フォーム（`[id]/page.tsx` で id="new" として処理） |
| 編集画面 | `/house-rule/[id]` | 既存レコード編集フォーム |

---

## ページ・コンポーネント構成

```
app/house-rule/
├── page.tsx
└── [id]/
    └── page.tsx    # id="new" で新規、数値で編集

component/
├── templates/
│   └── houseRule/
│       ├── HouseRuleListTemplate.tsx
│       └── HouseRuleEditTemplate.tsx
└── organisms/
    └── houseRule/
        ├── HouseRuleTable.tsx
        └── HouseRuleForm.tsx
```

---

## 一覧画面仕様

### 表示カラム

| カラム | 表示名 |
|--------|--------|
| id | ID |
| rule_type | ルール種別 |
| supplement_id | サプリメント名（supplement_items.name を結合表示。NULL の場合は「—」を表示） |
| about | 概要 |
| 操作 | 編集ボタン / 削除ボタン |

### アクション

| アクション | 処理 |
|-----------|------|
| 追加ボタン | `/house-rule/new` へ遷移 |
| 編集ボタン | `/house-rule/[id]` へ遷移 |
| 削除ボタン | 確認ダイアログ → DELETE処理 |

---

## 編集・追加フォーム仕様

### 入力フィールド

| フィールド名 | コンポーネント | バリデーション |
|-------------|--------------|--------------|
| id | 表示のみ（編集時）/ 非表示（新規時・自動採番） | - |
| rule_type | `SelectField` | 必須 |
| supplement_id | `SelectField` | nullable（「なし」選択肢あり） |
| about | `TextInputField` | 必須 |
| description | `TextareaField` | 必須 |

### rule_type 選択肢

`RuleType` に定義された7種類を固定選択肢として使用する。

| 値 | 表示ラベル |
|----|----------|
| common | 共通 |
| item | アイテム |
| race | 種族 |
| skill | スキル |
| battleSkill | バトルスキル |
| school | 流派 |
| supplement | サプリメント |

### supplement_id 選択肢

フォーム表示時に `supplement_items` 全件を取得してセレクトオプションとして表示する。  
先頭に「なし（null）」の選択肢を追加する。

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
├── getHouseRuleItemsAdmin.ts   # 一覧取得（全件、supplement_items JOIN）
├── getHouseRuleItemAdmin.ts    # 1件取得（編集フォーム用）
├── createHouseRuleItem.ts      # INSERT
├── updateHouseRuleItem.ts      # UPDATE
└── deleteHouseRuleItem.ts      # DELETE
```

---

## フォーム定数

```typescript
// const/form/HOUSE_RULE_FORM_ITEM.tsx
import type { FormItemType } from "@/const/type/form/FormItemType";

export const HOUSE_RULE_FORM_ITEM: { [key: string]: FormItemType } = {
  RULE_TYPE: {
    column: "ruleType",
    label: "ルール種別",
    type: "select",
    rule: { required: true },
    option: [
      { label: "共通", value: "common" },
      { label: "アイテム", value: "item" },
      { label: "種族", value: "race" },
      { label: "スキル", value: "skill" },
      { label: "バトルスキル", value: "battleSkill" },
      { label: "流派", value: "school" },
      { label: "サプリメント", value: "supplement" },
    ],
  },
  SUPPLEMENT_ID: {
    column: "supplementId",
    label: "サプリメント",
    type: "select",
    // option はDBから動的取得のため定義しない
  },
  ABOUT: {
    column: "about",
    label: "概要",
    type: "text",
    rule: { required: true },
  },
  DESCRIPTION: {
    column: "description",
    label: "詳細説明",
    type: "textarea",
    rule: { required: true },
  },
} as const;
```

---

## 型定義

```typescript
// const/type/houseRule/HouseRuleFormType.ts
import type { RuleType } from "@/const/type/common/RuleType";

export type HouseRuleFormType = {
  ruleType: RuleType;
  supplementId: number | null;
  about: string;
  description: string;
};
```

---

## 画面定数

```typescript
// const/pages/HOUSE_RULE_ADMIN.tsx
export const HOUSE_RULE_ADMIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "ハウスルール管理",
    ADD: "ハウスルールを追加",
    EDIT: "ハウスルールを編集",
    DELETE_CONFIRM: "このハウスルールを削除しますか？",
    SUPPLEMENT_NONE: "なし",
  },
  VALUE: {},
} as const;
```
