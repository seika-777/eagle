# ダッシュボード画面 設計

## 概要

ログイン後のトップページ。各管理画面へのリンクカードを一覧表示する。

---

## 画面構成

| 画面 | パス | 説明 |
|------|------|------|
| ダッシュボード | `/` | 各管理画面へのリンクカード一覧 |

---

## ページ・コンポーネント構成

```
app/
└── page.tsx                          # ダッシュボードページ（認証済みのみアクセス可）

component/
├── templates/
│   └── DashboardTemplate.tsx         # ダッシュボードテンプレート
└── organisms/
    └── dashboard/
        └── DashboardCardGrid.tsx     # 管理画面リンクカードグリッド
```

---

## 表示仕様

### ロール別表示

| role | 表示内容 |
|------|---------|
| `"admin"` | 管理画面リンクカード一覧を表示 |
| `"common"` | 「むしずまでご連絡ください。」のメッセージのみ表示（カード一覧は非表示） |

### カード一覧（admin のみ表示）

| カード名 | リンク先 | 説明テキスト |
|---------|---------|------------|
| レギュレーション管理 | `/regulation` | レギュレーションの追加・編集・削除 |
| 神格管理 | `/god` | 神格の追加・編集・削除 |
| 流派管理 | `/school` | 流派の追加・編集・削除 |
| 種族管理 | `/race` | 種族の追加・編集・削除 |
| ハウスルール管理 | `/house-rule` | ハウスルールの追加・編集・削除 |
| 禁止事項管理 | `/prohibition` | 禁止事項の追加・編集・削除 |
| サプリメント管理 | `/supplement` | サプリメントの追加・編集・削除 |
| オリジナルアイテム管理 | `/original` | オリジナルアイテムの追加・編集・削除 |

### レイアウト

- PCはグリッドレイアウト（3列）、SPは1列表示
- 各カードはアイコン・タイトル・説明テキストで構成

---

## 画面定数

```typescript
// const/pages/DASHBOARD.tsx
export const DASHBOARD: {
  TEXT: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "ダッシュボード",
    WELCOME: "管理画面へようこそ",
  },
} as const;

export const DASHBOARD_CARDS = [
  { label: "レギュレーション管理", href: "/regulation", description: "レギュレーションの追加・編集・削除" },
  { label: "神格管理", href: "/god", description: "神格の追加・編集・削除" },
  { label: "流派管理", href: "/school", description: "流派の追加・編集・削除" },
  { label: "種族管理", href: "/race", description: "種族の追加・編集・削除" },
  { label: "ハウスルール管理", href: "/house-rule", description: "ハウスルールの追加・編集・削除" },
  { label: "禁止事項管理", href: "/prohibition", description: "禁止事項の追加・編集・削除" },
  { label: "サプリメント管理", href: "/supplement", description: "サプリメントの追加・編集・削除" },
  { label: "オリジナルアイテム管理", href: "/original", description: "オリジナルアイテムの追加・編集・削除" },
] as const;
```
