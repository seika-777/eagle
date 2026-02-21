import { PATH } from "@/const/common/PATH";

export const NAV_ITEMS = (period: string) =>
  [
    { label: "現在のレギュレーション", href: `/${period}` },
    { label: "ハウスルール", href: PATH.URL.HOUSE_RULE.ROOT },
    { label: "禁止事項", href: PATH.URL.HOUSE_RULE.PROHIBITION },
    { label: "オリジナルデータ", href: "/original" },
  ] as const;
