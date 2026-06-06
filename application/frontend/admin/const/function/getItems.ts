import type { TableRow } from "@/const/type/table/TableColumnType";

export const getItems = async <T extends TableRow = TableRow>(
  type: string,
  params?: Record<string, string>
): Promise<T[]> => {
  const query = new URLSearchParams({ type, ...params }).toString();
  const res = await fetch(`/api/items?${query}`, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(body.error || "データ取得に失敗しました");
  }
  return res.json() as Promise<T[]>;
};
