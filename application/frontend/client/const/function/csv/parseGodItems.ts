import Papa from "papaparse";
import type { GodItemType } from "@/const/type/god/GodItemType";

type GodCsvRow = {
  id: string;
  type: string;
  name: string;
  URL: string;
  isAlways: string;
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
    url: row.URL ?? "",
    isAlways: row.isAlways === "true",
  }));
};
