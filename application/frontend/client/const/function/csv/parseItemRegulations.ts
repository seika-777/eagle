import Papa from "papaparse";
import type { ItemRegulationType, ItemRegulationItemType } from "@/const/type/itemRegulation/ItemRegulationType";

type ItemRegulationCsvRow = {
  itemType: string;
  itemId: string;
  regulationId: string;
};

export const parseItemRegulations = (csvText: string): ItemRegulationType[] => {
  const result = Papa.parse<ItemRegulationCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const validItemTypes: ItemRegulationItemType[] = ["race", "god", "school", "supplement"];

  return result.data
    .filter((row) => (validItemTypes as string[]).includes(row.itemType))
    .map((row) => ({
      itemType: row.itemType as ItemRegulationItemType,
      itemId: Number(row.itemId),
      regulationId: Number(row.regulationId),
    }));
};
