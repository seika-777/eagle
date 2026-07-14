export const DASHBOARD: {
  TEXT: { [key: string]: string };
} = {
  TEXT: {
    TITLE: "ダッシュボード",
    WELCOME: "管理画面へようこそ",
    COMMON_MESSAGE: "むしずまでご連絡ください。",
  },
} as const;

export const DASHBOARD_CARDS = [
  { label: "レギュレーション管理", href: "/regulation", description: "レギュレーションの追加・編集・削除" },
  { label: "神格管理", href: "/god", description: "神格の追加・編集・削除" },
  { label: "流派管理", href: "/school", description: "流派の追加・編集・削除" },
  { label: "種族管理", href: "/race", description: "種族の追加・編集・削除" },
  { label: "ハウスルール管理", href: "/house-rule", description: "ハウスルールの追加・編集・削除" },
  { label: "サプリメント管理", href: "/supplement", description: "サプリメントの追加・編集・削除" },
  { label: "オリジナルアイテム管理", href: "/original", description: "オリジナルアイテムの追加・編集・削除" },
  { label: "語録管理", href: "/word", description: "語録の追加・編集・削除" },
] as const;
