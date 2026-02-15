import Papa from "papaparse";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";

type SupplementCsvRow = {
  id: string;
  name: string;
};

export type SupplementRow = RegulationItemType["supplement"];

export const parseSupplementItems = (
  csvText: string
): SupplementRow[] => {
  const result = Papa.parse<SupplementCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    name: row.name,
  }));
};
