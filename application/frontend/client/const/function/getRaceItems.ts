import type { RaceItemType } from "@/const/type/race/RaceItemType";
import { parseRaceItems } from "@/const/function/csv/parseRaceItems";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

export async function getRaceItems(type: "period", id: string): Promise<RaceItemType[]>;
export async function getRaceItems(type: "all"): Promise<RaceItemType[]>;
export async function getRaceItems(
  type: "period" | "all",
  id?: string
): Promise<RaceItemType[]> {
  const res = await fetch("/csv/race-items.csv");
  const csvText = await res.text();
  const items = parseRaceItems(csvText);

  if (type === "period") {
    const allowedIds = await getItemRegulationIds("race", id!);
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
