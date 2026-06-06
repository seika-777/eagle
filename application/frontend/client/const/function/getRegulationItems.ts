import { supabase } from "@/lib/supabase";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
import { getRaceItems } from "@/const/function/getRaceItems";
import { getSupplementItems } from "@/const/function/getSupplementItems";
import { getItemRegulationIds } from "@/const/function/getItemRegulations";

export type RegulationRow = RegulationItemType["regulation"];

const fetchRegulationRows = async (): Promise<RegulationRow[]> => {
  const { data, error } = await supabase
    .from("regulation_items")
    .select("id, name, description, recruitment, stage, race, supplement, notes, level_cap_belt")
    .eq("publish_type", "public")
    .order("id", { ascending: true });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    recruitment: row.recruitment,
    stage: row.stage,
    race: row.race,
    supplement: row.supplement,
    notes: row.notes,
    levelCapBelt: row.level_cap_belt,
  }));
};

const buildRegulationItem = async (
  period: number,
  rows: RegulationRow[]
): Promise<RegulationItemType | null> => {
  const regulation = rows.find((row) => row.id === period);
  if (!regulation) return null;

  const [allRaceItems, allowedRaceIds, supplementItems] = await Promise.all([
    getRaceItems("all"),
    getItemRegulationIds("race", period),
    getSupplementItems("all"),
  ]);

  const raceItems = allRaceItems
    .filter((item) => allowedRaceIds.has(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      raceType: item.raceType.join(","),
    }));

  const supplement = supplementItems.find(
    (s) => s.id === Number(regulation.supplement)
  ) ?? { id: 0, name: "" };

  return {
    regulation,
    race: raceItems,
    supplement,
  };
};

export async function getRegulationItems(type: "list"): Promise<RegulationRow[]>;
export async function getRegulationItems(type: "latest"): Promise<RegulationItemType | null>;
export async function getRegulationItems(type: "detail", id: string): Promise<RegulationItemType | null>;
export async function getRegulationItems(
  type: "list" | "latest" | "detail",
  id?: string
): Promise<RegulationRow[] | RegulationItemType | null> {
  const rows = await fetchRegulationRows();

  if (type === "list") {
    return rows.sort((a, b) => a.id - b.id);
  }

  if (rows.length === 0) return null;

  const period = type === "latest"
    ? rows[rows.length - 1].id
    : Number(id!);

  return buildRegulationItem(period, rows);
}
