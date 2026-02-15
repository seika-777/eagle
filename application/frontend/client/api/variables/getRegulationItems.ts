import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
import { parseRegulationItems } from "@/api/variables/csv/parseRegulationItems";
import { getRaceItems } from "@/api/variables/getRaceItems";
import { parseSupplementItems } from "@/api/variables/csv/parseSupplementItems";

const getRegulationCsvRows = async () => {
  const res = await fetch("/csv/regulation-item.csv");
  const csvText = await res.text();
  return parseRegulationItems(csvText);
};

const getSupplementItems = async () => {
  const res = await fetch("/csv/supplement-item.csv");
  const csvText = await res.text();
  return parseSupplementItems(csvText);
};

const buildRegulationItem = async (
  period: string
): Promise<RegulationItemType | null> => {
  const [regulationRows, allRaceItems, supplementItems] = await Promise.all([
    getRegulationCsvRows(),
    getRaceItems(),
    getSupplementItems(),
  ]);
  const regulation = regulationRows.find((row) => row.id === Number(period));
  if (!regulation) return null;
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
      raceType: item.raceType.map((rt) => rt.name).join(","),
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

export const getLatestRegulationItem = async (): Promise<RegulationItemType | null> => {
  const rows = await getRegulationCsvRows();
  if (rows.length === 0) return null;
  const latest = rows[rows.length - 1];
  return buildRegulationItem(String(latest.id));
};

export const getRegulationItemByPeriod = async (
  period: string
): Promise<RegulationItemType | null> => {
  return buildRegulationItem(period);
};
