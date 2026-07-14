import type { LevelCapUpdateItemType } from "@/const/type/levelCap/LevelCapUpdateItemType";

export const updateLevelCaps = async (body: { items: LevelCapUpdateItemType[] }): Promise<void> => {
  const res = await fetch("/api/level-cap", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const resBody = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(resBody.error || "更新に失敗しました");
  }
};
