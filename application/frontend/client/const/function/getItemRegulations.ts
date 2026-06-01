import type { ItemRegulationItemType } from "@/const/type/itemRegulation/ItemRegulationType";
import { parseItemRegulations } from "@/const/function/csv/parseItemRegulations";

export async function getItemRegulationIds(
  itemType: ItemRegulationItemType,
  regulationId: number
): Promise<Set<number>> {
  const res = await fetch("/csv/item-regulation.csv");
  if (!res.ok) throw new Error(`Failed to fetch item-regulation.csv: ${res.status}`);
  const csvText = await res.text();
  const items = parseItemRegulations(csvText);

  return new Set(
    items
      .filter((item) => item.itemType === itemType && item.regulationId === regulationId)
      .map((item) => item.itemId)
  );
}
