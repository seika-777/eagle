import type { OriginalItemType } from "@/const/type/original/OriginalItemType";
import { parseOriginalItems } from "@/const/function/csv/parseOriginalItems";

export const getOriginalItems = async (): Promise<OriginalItemType[]> => {
  const res = await fetch("/csv/original-item.csv");
  const csvText = await res.text();
  const items = parseOriginalItems(csvText);

  return items;
};
