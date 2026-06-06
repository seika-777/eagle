import { supabase } from "@/lib/supabase";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

export async function getRaceItems(type: "period", id: string): Promise<RaceItemType[]>;
export async function getRaceItems(type: "all"): Promise<RaceItemType[]>;
export async function getRaceItems(
  type: "period" | "all",
  id?: string
): Promise<RaceItemType[]> {
  const { data, error } = await supabase
    .from("race_items")
    .select("id, name, race_type, url, is_always")
    .order("id", { ascending: true });
  if (error) throw error;

  const items: RaceItemType[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    raceType: row.race_type as string[],
    url: row.url,
    isAlways: row.is_always,
  }));

  if (type === "period") {
    const allowedIds = await getItemRegulationIds("race", Number(id!));
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
