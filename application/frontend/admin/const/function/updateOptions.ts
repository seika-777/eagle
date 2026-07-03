export const updateOptions = async (options: Record<string, string>): Promise<void> => {
  const res = await fetch("/api/options", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) {
    const resBody = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(resBody.error || "更新に失敗しました");
  }
};
