import Papa from "papaparse";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";

type SupplementCsvRow = {
  id: string;
  name: string;
  isAlways: string;
  notes: string;
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
    isAlways: row.isAlways === "true",
    notes: row.notes ?? "",
  }));
};
