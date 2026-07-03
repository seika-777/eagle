export const getOptions = async (): Promise<Record<string, string>> => {
  const res = await fetch("/api/options", { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "" })) as { error: string };
    throw new Error(body.error || "データ取得に失敗しました");
  }
  return res.json() as Promise<Record<string, string>>;
};
