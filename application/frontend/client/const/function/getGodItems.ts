import { supabase } from "@/lib/supabase";
import type { GodItemType } from "@/const/type/god/GodItemType";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";
import { isPublicRegulation } from "@/const/function/isPublicRegulation";

export async function getGodItems(type: "period", id: string): Promise<GodItemType[]>;
export async function getGodItems(type: "all"): Promise<GodItemType[]>;
export async function getGodItems(
  type: "period" | "all",
  id?: string
): Promise<GodItemType[]> {
  const { data, error } = await supabase
    .from("god_items")
    .select("id, type, name, url, is_always")
    .order("id", { ascending: true });
  if (error) throw error;

  const items: GodItemType[] = data.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    url: row.url,
    isAlways: row.is_always,
  }));

  if (type === "period") {
    const isPublic = await isPublicRegulation(Number(id!));
    if (!isPublic) return [];
    const allowedIds = await getItemRegulationIds("god", Number(id!));
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
