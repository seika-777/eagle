import { supabase } from "@/lib/supabase";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";
import { isPublicRegulation } from "@/const/function/isPublicRegulation";

export async function getSupplementItems(type: "period", id: string): Promise<SupplementItemType[]>;
export async function getSupplementItems(type: "all"): Promise<SupplementItemType[]>;
export async function getSupplementItems(
  type: "period" | "all",
  id?: string
): Promise<SupplementItemType[]> {
  const { data, error } = await supabase
    .from("supplement_items")
    .select("id, name, is_always, notes")
    .order("id", { ascending: true });
  if (error) throw error;

  const items: SupplementItemType[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    isAlways: row.is_always,
    notes: row.notes,
  }));

  if (type === "period") {
    const isPublic = await isPublicRegulation(Number(id!));
    if (!isPublic) return [];
    const allowedIds = await getItemRegulationIds("supplement", Number(id!));
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
