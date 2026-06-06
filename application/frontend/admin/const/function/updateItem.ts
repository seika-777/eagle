export const updateItem = async <T extends object>(
  type: string,
  id: string,
  body: T,
  updatedAt: string | null
): Promise<void> => {
  const res = await fetch(`/api/items?type=${type}&id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, updatedAt }),
  });
  if (res.status === 409) {
    throw new Error("他のユーザーにより更新されました。ページを再読み込みしてください。");
  }
  if (!res.ok) {
    const resBody = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(resBody.error || "更新に失敗しました");
  }
};
