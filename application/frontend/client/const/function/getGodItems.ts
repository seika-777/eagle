import { supabase } from "@/lib/supabase";
import type { GodItemType } from "@/const/type/god/GodItemType";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

export async function getGodItems(type: "period", id: string): Promise<GodItemType[]>;
export async function getGodItems(type: "all"): Promise<GodItemType[]>;
export async function getGodItems(
  type: "period" | "all",
  id?: string
): Promise<GodItemType[]> {
  const { data, error } = await supabase
    .from("god_items")
    .select("id, type, name, url, is_always");
  if (error) throw error;

  const items: GodItemType[] = data.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    url: row.url,
    isAlways: row.is_always,
  }));

  if (type === "period") {
    const allowedIds = await getItemRegulationIds("god", Number(id!));
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
