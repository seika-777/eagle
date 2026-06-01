import Papa from "papaparse";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";

type SchoolCsvRow = {
  id: string;
  name: string;
  URL: string;
  isAlways: string;
  notes: string;
};

export const parseSchoolItems = (
  csvText: string,
): SchoolItemType[] => {
  const result = Papa.parse<SchoolCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    id: Number(row.id),
    name: row.name,
    url: row.URL ?? "",
    isAlways: row.isAlways === "true",
    notes: row.notes ?? "",
  }));
};
