import Papa from "papaparse";
import type { GodItemType } from "@/const/type/god/GodItemType";

type GodCsvRow = {
  id: string;
  type: string;
  name: string;
  regulationPeriod: string;
  URL: string;
  isOriginal: string;
};

export const parseGodItems = (
  csvText: string,
): GodItemType[] => {
  const result = Papa.parse<GodCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    type: Number(row.type),
    name: row.name,
    regulationPeriod: row.regulationPeriod ?? "",
    url: row.URL ?? "",
    isOriginal: row.isOriginal === "true",
  }));
};
