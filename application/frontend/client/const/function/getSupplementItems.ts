import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";
import { parseSupplementItems } from "@/const/function/csv/parseSupplementItems";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

export async function getSupplementItems(type: "period", id: string): Promise<SupplementItemType[]>;
export async function getSupplementItems(type: "all"): Promise<SupplementItemType[]>;
export async function getSupplementItems(
  type: "period" | "all",
  id?: string
): Promise<SupplementItemType[]> {
  const res = await fetch("/csv/supplement-item.csv");
  const csvText = await res.text();
  const items = parseSupplementItems(csvText);

  if (type === "period") {
    const allowedIds = await getItemRegulationIds("supplement", id!);
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
