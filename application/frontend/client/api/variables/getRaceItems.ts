import type { RaceItemType } from "@/const/type/race/RaceItemType";
import {
  parseRaceItems,
  parseRaceTypes,
} from "@/api/variables/csv/parseRaceItems";

export const getRaceItems = async (
  period?: string,
): Promise<RaceItemType[]> => {
  const [raceItemsRes, raceTypesRes] = await Promise.all([
    fetch("/csv/race-items.csv"),
    fetch("/csv/race-types.csv"),
  ]);

  const raceItemsCsv = await raceItemsRes.text();
  const raceTypesCsv = await raceTypesRes.text();

  const raceTypeMap = parseRaceTypes(raceTypesCsv);
  const items = parseRaceItems(raceItemsCsv, raceTypeMap);

  if (period) {
    return items.filter((item) => item.regulationPeriod.includes(period));
  }
  return items.filter((item) => item.isOriginal);
};
