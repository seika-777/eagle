import Papa from "papaparse";
import type { OriginalItemType } from "@/const/type/original/OriginalItemType";

type OriginalCsvRow = {
  id: string;
  type: string;
  name: string;
  URL: string;
};

export const parseOriginalItems = (
  csvText: string,
): OriginalItemType[] => {
  const result = Papa.parse<OriginalCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    type: row.type,
    name: row.name,
    url: row.URL ?? "",
  }));
};
