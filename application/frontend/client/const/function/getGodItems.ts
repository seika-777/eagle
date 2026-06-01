import type { GodItemType } from "@/const/type/god/GodItemType";
import { parseGodItems } from "@/const/function/csv/parseGodItems";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

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
    const allowedIds = await getItemRegulationIds("god", Number(id!));
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
