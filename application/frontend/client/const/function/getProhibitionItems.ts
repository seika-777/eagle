import { supabase } from "@/lib/supabase";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";

export const getProhibitionItems = async (): Promise<ProhibitionItemType[]> => {
  const { data, error } = await supabase
    .from("prohibition_items")
    .select("id, about, name")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    about: row.about,
    name: row.name,
  }));
};
