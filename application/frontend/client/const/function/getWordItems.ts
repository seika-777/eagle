import { supabase } from "@/lib/supabase";
import type { WordItemType } from "@/const/type/word/WordItemType";

export async function getWordItems(): Promise<WordItemType[]> {
  const { data, error } = await supabase
    .from("word_items")
    .select("id, title, description")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
  }));
}
