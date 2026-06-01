import Papa from "papaparse";
import type { RaceItemType } from "@/const/type/race/RaceItemType";

type RaceItemCsvRow = {
  id: string;
  name: string;
  raceType: string;
  url: string;
  isAlways: string;
};

export const parseRaceItems = (csvText: string): RaceItemType[] => {
  const result = Papa.parse<RaceItemCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    name: row.name,
    raceType: row.raceType.split(",").map((name) => name.trim()),
    url: row.url,
    isAlways: row.isAlways === "true",
  }));
};
