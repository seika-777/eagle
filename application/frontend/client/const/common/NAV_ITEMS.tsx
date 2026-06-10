import { PATH } from "@/const/common/PATH";

export const NAV_ITEMS = (period: string) =>
  [
    { label: "トップ", href: PATH.URL.HOME },
    { label: "レギュレーション一覧", href: "/period" },
    { label: "現在のレギュレーション", href: `/${period}` },
    { label: "ハウスルール", href: PATH.URL.HOUSE_RULE.ROOT },
    { label: "禁止事項", href: PATH.URL.HOUSE_RULE.PROHIBITION },
    { label: "オリジナルデータ", href: PATH.URL.ORIGINAL.ROOT },
    { label: "語録", href: PATH.URL.WORD },
    { label: "舞台/用語", href: PATH.URL.STAGE_TERM },
  ] as const;
