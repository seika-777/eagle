import type { GodItemType } from "@/const/type/god/GodItemType";
import { parseGodItems } from "@/const/function/csv/parseGodItems";

export async function getGodItems(type: "period", id: string): Promise<GodItemType[]>;
export async function getGodItems(type: "all"): Promise<GodItemType[]>;
export async function getGodItems(
  type: "period" | "all",
  id?: string
): Promise<GodItemType[]> {
  const res = await fetch("/csv/god-item.csv");
  const csvText = await res.text();
  const items = parseGodItems(csvText);

  if (type === "period") {
    return items.filter((item) => item.regulationPeriod.includes(id!));
  }
  return items;
}
