import { supabase } from "@/lib/supabase";
import type { ItemRegulationItemType } from "@/const/type/itemRegulation/ItemRegulationType";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";
import { isPublicRegulation } from "@/const/function/isPublicRegulation";

const TABLE_MAP: Record<string, string> = {
  race: "race_items",
  god: "god_items",
  school: "school_items",
  supplement: "supplement_items",
  word: "word_items",
  original: "original_items",
  "house-rule": "house_rule_items",
  prohibition: "prohibition_items",
  "stage-term": "stage_term_items",
};

const SELECT_MAP: Record<string, string> = {
  race: "id, name, race_type, url, is_always",
  god: "id, type, name, url, is_always",
  school: "id, name, url, is_always, notes",
  supplement: "id, name, is_always, notes",
  word: "id, title, description",
  original: "id, type, name, url",
  "house-rule": "id, rule_type, supplement_id, about, description",
  prohibition: "id, about, name",
};

const PERIOD_TYPES = new Set(["race", "god", "school", "supplement"]);

type DbValue = string | number | boolean | null | string[] | number[];
type RawRow = Record<string, DbValue>;

const mapRow = (type: string, row: RawRow): RawRow => {
  if (type === "race") return { id: row.id, name: row.name, raceType: row.race_type, url: row.url, isAlways: row.is_always };
  if (type === "god") return { id: row.id, type: row.type, name: row.name, url: row.url, isAlways: row.is_always };
  if (type === "school") return { id: row.id, name: row.name, url: row.url, isAlways: row.is_always, notes: row.notes };
  if (type === "supplement") return { id: row.id, name: row.name, isAlways: row.is_always, notes: row.notes };
  if (type === "word") return { id: row.id, title: row.title, description: row.description };
  if (type === "original") return { id: row.id, type: row.type, name: row.name, url: row.url };
  if (type === "house-rule") return { id: row.id, ruleType: row.rule_type, supplementId: row.supplement_id, about: row.about, description: row.description };
  if (type === "prohibition") return { id: row.id, about: row.about, name: row.name };
  return row;
};

const getStageTerm = async (): Promise<RawRow[]> => {
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
      .in("id", regulationIds)
      .eq("publish_type", "public");
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
};

export const getItems = async <T extends RawRow>(
  type: string,
  params?: { period?: string }
): Promise<T[]> => {
  if (type === "stage-term") {
    return getStageTerm() as Promise<T[]>;
  }

  const { data, error } = await supabase
    .from(TABLE_MAP[type])
    .select(SELECT_MAP[type])
    .order("id", { ascending: true })
    .returns<RawRow[]>();
  if (error) throw error;

  const items = (data ?? []).map((row) => mapRow(type, row));

  if (params?.period && PERIOD_TYPES.has(type)) {
    const isPublic = await isPublicRegulation(Number(params.period));
    if (!isPublic) return [];
    const allowedIds = await getItemRegulationIds(type as ItemRegulationItemType, Number(params.period));
    return items.filter((item) =>
      (item.isAlways as boolean) || allowedIds.has(item.id as number)
    ) as T[];
  }

  return items as T[];
};
