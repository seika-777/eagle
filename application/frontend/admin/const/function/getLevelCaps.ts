import type { LevelCapRowType } from "@/const/type/levelCap/LevelCapRowType";

export const getLevelCaps = async (belt: string): Promise<LevelCapRowType[]> => {
  const res = await fetch(`/api/level-cap?belt=${belt}`, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(body.error || "データ取得に失敗しました");
  }
  return res.json() as Promise<LevelCapRowType[]>;
};
