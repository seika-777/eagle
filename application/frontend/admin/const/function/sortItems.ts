export const sortItems = async (type: string, orderedIds: number[]): Promise<void> => {
  const res = await fetch("/api/items/sort", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, orderedIds }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(body.error || "並び替えの保存に失敗しました");
  }
};
