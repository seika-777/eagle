import { supabase } from "@/lib/supabase";
import type { StageTermItemType } from "@/const/type/stageTerm/StageTermItemType";

export async function getStageTermItems(): Promise<StageTermItemType[]> {
  const [stageTermResult, relationsResult] = await Promise.all([
    supabase
      .from("stage_term_items")
      .select("id, title, continent, category, description")
      .order("id", { ascending: true }),
    supabase
      .from("item_regulations")
      .select("item_id, regulation_id")
      .eq("item_type", "stage-term"),
  ]);
  if (stageTermResult.error) throw stageTermResult.error;
  if (relationsResult.error) throw relationsResult.error;

  const regulationIds = [...new Set(relationsResult.data.map((r) => r.regulation_id))];

  const regulationNames: Record<number, string> = {};
  if (regulationIds.length > 0) {
    const { data: regulations, error } = await supabase
      .from("regulation_items")
      .select("id, name")
      .in("id", regulationIds);
    if (error) throw error;
    regulations.forEach((r) => {
      regulationNames[r.id] = r.name;
    });
  }

  const itemRegulationMap: Record<number, string[]> = {};
  relationsResult.data.forEach((r) => {
    if (!itemRegulationMap[r.item_id]) itemRegulationMap[r.item_id] = [];
    const name = regulationNames[r.regulation_id];
    if (name) itemRegulationMap[r.item_id].push(name);
  });

  return stageTermResult.data.map((row) => ({
    id: row.id,
    title: row.title,
    continent: row.continent,
    itemType: row.category ?? "",
    description: row.description ?? null,
    regulationNames: itemRegulationMap[row.id] ?? [],
  }));
}
