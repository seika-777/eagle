export const createItem = async <T extends object>(
  type: string,
  body: T
): Promise<void> => {
  const res = await fetch(`/api/items?type=${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const resBody = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(resBody.error || "作成に失敗しました");
  }
};
