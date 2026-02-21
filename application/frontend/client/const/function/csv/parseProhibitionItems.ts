import Papa from "papaparse";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";

type ProhibitionCsvRow = {
  id: string;
  about: string;
  name: string;
};

export const parseProhibitionItems = (
  csvText: string,
): ProhibitionItemType[] => {
  const result = Papa.parse<ProhibitionCsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data
    .filter((row) => row.about)
    .map((row, index) => ({
      id: row.id ? Number(row.id) : index + 1,
      about: row.about ?? "",
      name: row.name ?? "",
    }));
};
