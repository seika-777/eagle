import type { TableRow } from "@/const/type/table/TableColumnType";

export const getItem = async <T extends TableRow = TableRow>(
  type: string,
  id: string
): Promise<T> => {
  const res = await fetch(`/api/items?type=${type}&id=${id}`, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(body.error || "データ取得に失敗しました");
  }
  return res.json() as Promise<T>;
};
