import Papa from "papaparse";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";

type SupplementCsvRow = {
  id: string;
  name: string;
  regulationPeriod: string;
};

export const parseSupplementItems = (
  csvText: string,
): SupplementItemType[] => {
  const result = Papa.parse<SupplementCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    name: row.name,
    regulationPeriod: row.regulationPeriod ?? "",
  }));
};
