import { parseRegulationItems } from "@/const/function/csv/parseRegulationItems";
import type { RegulationListItemType } from "@/const/type/regulation/RegulationListItemType";

export const getRegulationListItems = async (): Promise<
  RegulationListItemType[]
> => {
  const res = await fetch("/csv/regulation-item.csv");
  const csvText = await res.text();
  const rows = parseRegulationItems(csvText);
  return rows
    .map((row) => ({ id: row.id, name: row.name }))
    .sort((a, b) => a.id - b.id);
};
