import { supabase } from "@/lib/supabase";

export async function isPublicRegulation(id: number): Promise<boolean> {
  const { data } = await supabase
    .from("regulation_items")
    .select("id")
    .eq("id", id)
    .eq("publish_type", "public")
    .maybeSingle();
  return data !== null;
}
