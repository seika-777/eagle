import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
import { parseRegulationItems, type RegulationRow } from "@/const/function/csv/parseRegulationItems";
import { getRaceItems } from "@/const/function/getRaceItems";
import { getSupplementItems } from "@/const/function/getSupplementItems";

const fetchRegulationRows = async (): Promise<RegulationRow[]> => {
  const res = await fetch("/csv/regulation-item.csv");
  const csvText = await res.text();
  return parseRegulationItems(csvText);
};

const buildRegulationItem = async (
  period: string,
  rows: RegulationRow[]
): Promise<RegulationItemType | null> => {
  const regulation = rows.find((row) => row.id === Number(period));
  if (!regulation) return null;

  const [allRaceItems, supplementItems] = await Promise.all([
    getRaceItems("all"),
    getSupplementItems("all"),
  ]);

  const raceItems = allRaceItems
    .filter((item) =>
      item.regulationPeriod
        .split(",")
        .map((p) => p.trim())
        .includes(period)
    )
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

  const period = type === "latest"
    ? String(rows[rows.length - 1]?.id)
    : id!;

  return buildRegulationItem(period, rows);
}
