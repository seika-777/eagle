import Papa from "papaparse";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";

type RegulationCsvRow = {
  id: string;
  name: string;
  description: string;
  recruitment: string;
  stage: string;
  race: string;
  supplement: string;
  notes: string;
  levelCapBelt: string;
};

export type RegulationRow = RegulationItemType["regulation"];

export const parseRegulationItems = (
  csvText: string
): RegulationRow[] => {
  const result = Papa.parse<RegulationCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    name: row.name,
    description: row.description,
    recruitment: row.recruitment,
    stage: row.stage,
    race: row.race,
    supplement: row.supplement,
    notes: row.notes,
    levelCapBelt: row.levelCapBelt,
  }));
};
