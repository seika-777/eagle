import { supabase } from "@/lib/supabase";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

export async function getSchoolItems(type: "period", id: string): Promise<SchoolItemType[]>;
export async function getSchoolItems(type: "all"): Promise<SchoolItemType[]>;
export async function getSchoolItems(
  type: "period" | "all",
  id?: string
): Promise<SchoolItemType[]> {
  const { data, error } = await supabase
    .from("school_items")
    .select("id, name, url, is_always, notes");
  if (error) throw error;

  const items: SchoolItemType[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    url: row.url,
    isAlways: row.is_always,
    notes: row.notes,
  }));

  if (type === "period") {
    const allowedIds = await getItemRegulationIds("school", Number(id!));
    return items.filter((item) => item.isAlways || allowedIds.has(item.id));
  }
  return items;
}
