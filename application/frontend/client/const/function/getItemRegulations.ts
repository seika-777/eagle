import { supabase } from "@/lib/supabase";
import type { ItemRegulationItemType } from "@/const/type/itemRegulation/ItemRegulationType";

export async function getItemRegulationIds(
  itemType: ItemRegulationItemType,
  regulationId: number
): Promise<Set<number>> {
  const { data, error } = await supabase
    .from("item_regulations")
    .select("item_id")
    .eq("item_type", itemType)
    .eq("regulation_id", regulationId);
  if (error) throw error;

  return new Set(data.map((row) => row.item_id));
}
