---
paths:
  - "application/frontend/client/component/**/*.{ts,tsx}"
  - "application/frontend/client/app/**/*.{ts,tsx}"
  - "application/frontend/client/const/**/*.{ts,tsx}"
---

# コーディング規約

このドキュメントでは、Eagle プロジェクトにおけるコーディング規約を定義します。

> **Note**: 定数ファイルに関するルールは `CONSTANTS_RULES.md` を参照してください。

---

## 1. 型ファイルのルール

### 1.1 型ファイルの配置場所

型ファイルは `application/frontend/client/const/` 直下に **関連ディレクトリ** を作成し、その中に格納してください。

#### ディレクトリ命名規則

- ディレクトリ名は **機能や画面に対応** させる
- 型ファイル名は `types.ts` を基本とする
- 共通型は `types/` ディレクトリにまとめる

#### ディレクトリ構造

```
application/frontend/client/const/
├── common/           # 共通定数
├── pages/            # 画面別定数
├── types/            # 共通型定義
│   └── common.ts
├── user/             # ユーザー関連
│   └── types.ts
└── product/          # 商品関連
    └── types.ts
```

#### 良い例

```typescript
// application/frontend/client/const/user/types.ts
export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserRole = "admin" | "member" | "guest";
```

```typescript
// application/frontend/client/const/product/types.ts
export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
};

export type ProductCategory = "electronics" | "clothing" | "food";
```

```typescript
// application/frontend/client/const/types/common.ts
// 共通で使用する汎用型
export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};
```

#### 悪い例

```typescript
// ❌ コンポーネントファイル内に型を直接定義
// application/frontend/client/component/organisms/UserList.tsx
type User = {
  id: string;
  name: string;
};

const UserList = () => {
  /* ... */
};
```

```typescript
// ❌ const直下に型ファイルを直接配置
// application/frontend/client/const/userTypes.ts
export type User = {
  /* ... */
};
```

```typescript
// ❌ 関係のない型を1つのファイルにまとめる
// application/frontend/client/const/types/all.ts
export type User = {
  /* ... */
};
export type Product = {
  /* ... */
};
export type Order = {
  /* ... */
};
```

### 1.2 利点

- **再利用性**: 型を複数のコンポーネントで共有可能
- **保守性**: 型の変更が1箇所で完結
- **可読性**: 型定義とロジックの分離
- **検索性**: 機能別にディレクトリが分かれているため型の検索が容易

---

## 2. 現状のディレクトリ構造

```
application/
├── frontend/
│   └── client/
│       ├── app/                    # ページコンポーネント
│       ├── component/
│       │   ├── organisms/          # 複合コンポーネント
│       │   └── templates/          # テンプレートコンポーネント
│       └── const/
│           └── common/             # 共通定数
│               ├── METADATA.tsx
│               └── PATH.tsx
```

---

## 3. import ルール

### 3.1 絶対パスの使用

import文は **絶対パス（エイリアス）** を使用してください。相対パスは使用しないでください。

#### 良い例

```typescript
// ✅ 絶対パス（エイリアス）を使用
import type { RaceType } from "@/const/type/race/RaceType";
import { RACE } from "@/const/common/RACE";
```

#### 悪い例

```typescript
// ❌ 相対パスを使用
import type { RaceType } from "./RaceType";
import { RACE } from "../../common/RACE";
```

### 3.2 利点

- **可読性**: ファイルの場所が明確
- **リファクタリング**: ファイル移動時にimportパスの修正が不要
- **一貫性**: プロジェクト全体で統一されたimport形式

---

## 4. その場しのぎの解決の禁止

問題が発生した際は **根本的な解決** を行い、その場しのぎの対応をしないでください。

### 4.1 禁止される対応

以下のような対応は原則禁止です。

```typescript
// ❌ フォーマッターの無視
// prettier-ignore
export type SomeType = "a" | "b" | "c";

// ❌ TypeScriptエラーの無視
// @ts-ignore
const value = someFunction();

// ❌ ESLintエラーの無視
// eslint-disable-next-line
console.log(debugValue);
```

### 4.2 根本的な解決の例

| 問題 | その場しのぎ | 根本的な解決 |
|------|-------------|-------------|
| フォーマッターで改行される | `// prettier-ignore` | `.prettierrc`でprintWidthを調整 |
| 型エラーが発生 | `// @ts-ignore` | 正しい型定義を行う |
| ESLintエラー | `// eslint-disable` | コードを修正するか、ルール自体を見直す |

### 4.3 例外

以下の場合のみ、コメントによる無視が許可されます。

- 外部ライブラリの型定義が不完全な場合（理由をコメントで明記）
- 一時的なデバッグ目的（PRマージ前に必ず削除）

---

## 5. 非同期処理

非同期処理は **`async/await`** で記述してください。`.then()` チェーンは使用しないでください。

### 良い例

```typescript
// ✅ async/await を使用
const fetchData = async () => {
  const response = await fetch("/api/data");
  const data = await response.json();
  return data;
};
```

### 悪い例

```typescript
// ❌ .then() チェーンを使用
const fetchData = () => {
  return fetch("/api/data")
    .then((response) => response.json())
    .then((data) => data);
};
```

---

## 6. コンポーネントの Props 定義

コンポーネントへ渡す引数は、コンポーネント内で **`type Props`** として定義してください。

### 良い例

```typescript
// ✅ コンポーネント内で type Props を定義
type Props = {
  title: string;
  count: number;
};

const MyComponent = ({ title, count }: Props) => {
  return <div>{title}: {count}</div>;
};
```

### 悪い例

```typescript
// ❌ interface を使用
interface MyComponentProps {
  title: string;
  count: number;
}

// ❌ インラインで型を記述
const MyComponent = ({ title, count }: { title: string; count: number }) => {
  return <div>{title}: {count}</div>;
};

// ❌ Props以外の名前を使用
type MyComponentProps = {
  title: string;
  count: number;
};
```

---

## 7. サブコンポーネントの定義

1つのファイル内で使用するサブコンポーネントは、親コンポーネントの **外に `function` で分離せず**、親コンポーネント内で **`const` で定義** してください。

### 良い例

```typescript
// ✅ 親コンポーネント内に const で定義
export default function RaceList({ period }: { period?: string }) {
  const [items, setItems] = useState<RaceItemType[]>([]);

  const RaceItem = ({ item }: { item: RaceItemType }) => {
    return (
      <Box as="li" py={1}>
        <Text>{item.name}</Text>
      </Box>
    );
  };

  return (
    <Box>
      {items.map((item) => (
        <RaceItem key={item.id} item={item} />
      ))}
    </Box>
  );
}
```

### 悪い例

```typescript
// ❌ コンポーネントの外に function で分離
export default function RaceList({ period }: { period?: string }) {
  return (
    <Box>
      {items.map((item) => (
        <RaceItem key={item.id} item={item} />
      ))}
    </Box>
  );
}

function RaceItem({ item }: { item: RaceItemType }) {
  return (
    <Box as="li" py={1}>
      <Text>{item.name}</Text>
    </Box>
  );
}
```

---

## 8. コンポーネントファイルの構成

コンポーネントファイルにおいて、`function` の外に記述してよいのは **`import` 文と `type Props` のみ** です。ヘルパー関数やユーティリティはすべてコンポーネント関数の内部に定義してください。

### 良い例

```typescript
// ✅ import と type Props のみが function の外
import { useState } from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  period?: string;
};

export default function MyComponent({ period }: Props) {
  const formatData = (data: string[]) => {
    return data.map((d) => d.toUpperCase());
  };

  return <Box>{/* ... */}</Box>;
}
```

### 悪い例

```typescript
// ❌ ヘルパー関数を function の外に定義
import { useState } from "react";
import { Box } from "@chakra-ui/react";

const formatData = (data: string[]) => {
  return data.map((d) => d.toUpperCase());
};

type Props = {
  period?: string;
};

export default function MyComponent({ period }: Props) {
  return <Box>{/* ... */}</Box>;
}
```

---

## 9. コンポーネントの return 文

コンポーネントの JSX を返す `return` 文は **1つだけ** にしてください。`if (loading) return ...` のような早期リターンで JSX を複数箇所に分散させないでください。

### 良い例

```typescript
// ✅ return 文は1つだけ。条件分岐は JSX 内で行う
export default function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Box>
      {loading && <Spinner />}
      {error && <Text>エラーが発生しました</Text>}
      {!loading && !error && (
        <Box>
          {/* メインコンテンツ */}
        </Box>
      )}
    </Box>
  );
}
```

### 悪い例

```typescript
// ❌ 早期リターンで JSX を複数箇所に分散
export default function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>エラーが発生しました</Text>;
  }

  return (
    <Box>
      {/* メインコンテンツ */}
    </Box>
  );
}
```

---

## 10. エラー処理

コンポーネント内のエラー処理は **`useErrorHandler` カスタムフック** を使用してください。`let ignore = false` のようなフラグ変数によるその場しのぎのエラー制御は禁止です。

### 10.1 useErrorHandler の使用

非同期処理のエラーハンドリングやクリーンアップ処理は、`useErrorHandler` に集約してください。

#### 良い例

```typescript
// ✅ useErrorHandler を使用
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function MyComponent() {
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setItems(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchData();
  }, []);
}
```

#### 悪い例

```typescript
// ❌ ignore フラグによるその場しのぎの制御
useEffect(() => {
  let ignore = false;

  const fetchData = async () => {
    try {
      const data = await getData();
      if (ignore) return;
      setItems(data);
    } catch {
      if (!ignore) {
        setError(true);
      }
    }
  };

  fetchData();

  return () => {
    ignore = true;
  };
}, []);
```

### 10.2 ルール

- エラー処理は `useErrorHandler` フックに委譲する
- `let ignore = false` / `ignore = true` パターンは使用しない
- `catch` ブロック内で直接 `setState` せず、`handleError` を経由する

---

## 11. チェックリスト

新しいコードを書く際は、以下を確認してください。

- [ ] 型ファイルは機能別ディレクトリに配置したか
- [ ] コンポーネント内に型を直接定義していないか
- [ ] 関係のない型を1つのファイルにまとめていないか
- [ ] importは絶対パス（@/）を使用しているか
- [ ] その場しのぎの解決（ignore系コメント）を使用していないか
- [ ] 非同期処理は `async/await` で記述しているか
- [ ] コンポーネントの Props は `type Props` として定義しているか
- [ ] サブコンポーネントは親コンポーネント内に `const` で定義しているか
- [ ] function の外に import 文と type Props 以外を書いていないか
- [ ] コンポーネントの return 文は1つだけか
- [ ] エラー処理は `useErrorHandler` を使用しているか
- [ ] `let ignore` パターンを使用していないか
