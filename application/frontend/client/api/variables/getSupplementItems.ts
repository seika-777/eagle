import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";
import { parseSupplementItems } from "@/api/variables/csv/parseSupplementItems";

export const getSupplementItems = async (
  period?: string,
): Promise<SupplementItemType[]> => {
  const res = await fetch("/csv/supplement-item.csv");
  const csvText = await res.text();
  const items = parseSupplementItems(csvText);

  if (period) {
    return items.filter((item) => item.regulationPeriod.includes(period));
  }
  return items;
};
