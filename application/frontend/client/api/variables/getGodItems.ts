import type { GodItemType } from "@/const/type/god/GodItemType";
import { parseGodItems } from "@/api/variables/csv/parseGodItems";

export const getGodItems = async (
  period?: string,
): Promise<GodItemType[]> => {
  const res = await fetch("/csv/god-item.csv");
  const csvText = await res.text();
  const items = parseGodItems(csvText);

  if (period) {
    return items.filter((item) => item.regulationPeriod.includes(period));
  }
  return items;
};
