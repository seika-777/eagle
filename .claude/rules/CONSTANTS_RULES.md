---
paths:
  - "application/frontend/client/const/**/*.{ts,tsx}"
---

# 定数ファイル規約

このドキュメントでは、Eagle プロジェクトにおける定数ファイルのコーディング規約を定義します。

---

## 1. 定数ファイルのルール

### 1.1 1ファイル1定数の原則

定数ファイルには **1つの定数（エクスポート）のみ** を配置してください。

#### ファイル命名規則

- ファイル名は `UPPER_CASE.tsx` 形式を使用
- ファイル名と定数名は一致させる

#### 良い例

```typescript
// application/frontend/client/const/common/SITE_NAME.tsx
export const SITE_NAME = "Eagle";
```

```typescript
// application/frontend/client/const/common/API_BASE_URL.tsx
export const API_BASE_URL = "https://api.example.com";
```

#### 悪い例

```typescript
// application/frontend/client/const/common/CONFIG.tsx
// ❌ 複数の定数を1ファイルに配置している
export const SITE_NAME = "Eagle";
export const API_BASE_URL = "https://api.example.com";
export const DEFAULT_TIMEOUT = 5000;
```

---

## 2. 画面文言のルール

### 2.1 べた書き禁止

コンポーネント内に文言を **直接記述しない** でください。

#### 悪い例

```tsx
// ❌ コンポーネント内に文言をべた書き
const HomePage = () => {
  return (
    <div>
      <h1>ようこそ Eagle へ</h1>
      <p>このサービスは高速なデータ分析を提供します。</p>
      <button>今すぐ始める</button>
    </div>
  );
};
```

### 2.2 1画面1定数ファイルの原則

各画面（ページ）ごとに **専用の定数ファイル** を作成し、文言を管理してください。

#### ディレクトリ構造

```
application/frontend/client/const/
├── common/           # 共通定数
│   ├── SITE_NAME.tsx
│   └── METADATA.tsx
└── pages/            # 画面別定数
    ├── HOME.tsx
    ├── ABOUT.tsx
    └── CONTACT.tsx
```

#### 良い例

**定数ファイル**

```typescript
// application/frontend/client/const/pages/HOME.tsx
export const HOME = {
  title: "ようこそ Eagle へ",
  description: "このサービスは高速なデータ分析を提供します。",
  ctaButton: "今すぐ始める",
} as const;
```

**コンポーネント**

```tsx
// application/frontend/client/app/page.tsx
import { HOME } from "@/const/pages/HOME";

const HomePage = () => {
  return (
    <div>
      <h1>{HOME.title}</h1>
      <p>{HOME.description}</p>
      <button>{HOME.ctaButton}</button>
    </div>
  );
};
```

### 2.3 利点

- **保守性**: 文言の修正が1箇所で完結
- **一貫性**: 同じ文言の重複を防止
- **可読性**: コンポーネントのロジックに集中できる
- **多言語対応**: 将来的な国際化への対応が容易

---

## 3. `/const/pages`直下の定数の型ルール

### 3.1 標準型定義

`/const/pages`直下に配置する画面別定数は、以下の型構造に従ってください。

#### 型定義

```typescript
export const CONST: {
  TEXT: { [key: string]: string },
  VALUE: { [key: string]: string },
} = {
  TEXT: {
    title: string,
    description: string,
    // ...その他のテキスト
  },
  VALUE: {
    // ...値
  }
} as const
```

#### 実装例

```typescript
// application/frontend/client/const/pages/HOME.tsx
export const HOME: {
  TEXT: { [key: string]: string },
  VALUE: { [key: string]: string },
} = {
  TEXT: {
    title: "ようこそ Eagle へ",
    description: "このサービスは高速なデータ分析を提供します。",
    ctaButton: "今すぐ始める",
    footerText: "Copyright 2024 Eagle",
  },
  VALUE: {
    pageId: "home",
    analyticsKey: "home_page",
  }
} as const;
```

### 3.2 TEXT と VALUE の使い分け

| プロパティ | 用途 | 例 |
|-----------|------|-----|
| `TEXT` | 画面に表示される文言 | タイトル、説明、ボタンラベル |
| `VALUE` | ロジックで使用する値 | ID、キー、設定値 |

### 3.3 利点

- **一貫性**: すべての画面定数が同じ構造を持つ
- **予測可能性**: 開発者が定数の構造を事前に把握できる
- **型安全性**: TypeScriptによる型チェックが可能

---

## 4. チェックリスト

定数ファイルを作成・修正する際は、以下を確認してください。

- [ ] 定数ファイルに複数の定数を入れていないか
- [ ] コンポーネント内に文言をべた書きしていないか
- [ ] 画面ごとに専用の定数ファイルを作成したか
- [ ] ファイル名が `UPPER_CASE.tsx` 形式になっているか
- [ ] `/const/pages`の定数は`TEXT`と`VALUE`の構造に従っているか
