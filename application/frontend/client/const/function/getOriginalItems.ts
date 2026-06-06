import { supabase } from "@/lib/supabase";
import type { OriginalItemType } from "@/const/type/original/OriginalItemType";

export const getOriginalItems = async (): Promise<OriginalItemType[]> => {
  const { data, error } = await supabase
    .from("original_items")
    .select("id, type, name, url")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    url: row.url,
  }));
};
