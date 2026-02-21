import Papa from "papaparse";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { RaceListType } from "@/const/type/race/RaceListType";

type RaceItemCsvRow = {
  id: string;
  name: string;
  raceType: string;
  url: string;
  isOriginal: string;
  regulationPeriod: string;
};

type RaceTypeCsvRow = {
  id: string;
  name: string;
};

export const parseRaceTypes = (
  csvText: string
): { [key: number]: RaceListType } => {
  const result = Papa.parse<RaceTypeCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const map: { [key: number]: RaceListType } = {};
  result.data.forEach((row) => {
    map[Number(row.id)] = row.name as RaceListType;
  });
  return map;
};

export const parseRaceItems = (
  csvText: string,
  raceTypeMap: { [key: number]: RaceListType }
): RaceItemType[] => {
  const result = Papa.parse<RaceItemCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    name: row.name,
    raceType: row.raceType.split(",").map((idStr) => {
      const id = Number(idStr.trim());
      return {
        id,
        name: raceTypeMap[id],
      };
    }),
    url: row.url,
    isOriginal: row.isOriginal === "true",
    regulationPeriod: row.regulationPeriod,
  }));
};
