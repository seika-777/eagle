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
  "stage-term": "stage_term_items",
};

const SELECT_MAP: Record<string, string> = {
  race: "id, name, race_type, url, is_always",
  god: "id, type, name, url, is_always",
  school: "id, name, url, is_always, notes",
  supplement: "id, name, is_always, notes",
  word: "id, title, description",
  original: "id, type, name, url",
  "house-rule": "id, rule_type, supplement_id, about, description, is_prohibition, sort_order",
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
  if (type === "house-rule") return { id: row.id, ruleType: row.rule_type, supplementId: row.supplement_id, about: row.about, description: row.description, isProhibition: row.is_prohibition, sortOrder: row.sort_order };
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
      .select("item_id, regulation_items!inner(name)")
      .eq("item_type", "stage-term")
      .eq("regulation_items.publish_type", "public"),
  ]);
  if (stageTermResult.error) throw stageTermResult.error;
  if (relationsResult.error) throw relationsResult.error;

  const itemRegulationMap: Record<number, string[]> = {};
  relationsResult.data.forEach((r) => {
    if (!itemRegulationMap[r.item_id]) itemRegulationMap[r.item_id] = [];
    const name = (r.regulation_items as { name: string }[] | null)?.[0]?.name;
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

  if (params?.period && PERIOD_TYPES.has(type)) {
    const [result, isPublic, allowedIds] = await Promise.all([
      supabase
        .from(TABLE_MAP[type])
        .select(SELECT_MAP[type])
        .order("id", { ascending: true })
        .returns<RawRow[]>(),
      isPublicRegulation(Number(params.period)),
      getItemRegulationIds(type as ItemRegulationItemType, Number(params.period)),
    ]);
    if (result.error) throw result.error;
    if (!isPublic) return [];
    return (result.data ?? [])
      .map((row) => mapRow(type, row))
      .filter((item) => (item.isAlways as boolean) || allowedIds.has(item.id as number)) as T[];
  }

  const query = supabase.from(TABLE_MAP[type]).select(SELECT_MAP[type]);
  const orderedQuery =
    type === "house-rule"
      ? query.order("sort_order", { ascending: true, nullsFirst: false }).order("id", { ascending: true })
      : query.order("id", { ascending: true });
  const { data, error } = await orderedQuery.returns<RawRow[]>();
  if (error) throw error;

  return (data ?? []).map((row) => mapRow(type, row)) as T[];
};
