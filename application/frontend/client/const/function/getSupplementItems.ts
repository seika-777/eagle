import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";
import { parseSupplementItems } from "@/const/function/csv/parseSupplementItems";

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
    return items.filter((item) => item.regulationPeriod.includes(id!));
  }
  return items;
}
