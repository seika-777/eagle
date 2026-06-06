export const deleteItem = async (type: string, id: number): Promise<void> => {
  const res = await fetch(`/api/items?type=${type}&id=${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(body.error || "削除に失敗しました");
  }
};
