import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import { parseSchoolItems } from "@/api/variables/csv/parseSchoolItems";

export const getSchoolItems = async (
  period?: string,
): Promise<SchoolItemType[]> => {
  const res = await fetch("/csv/school-item.csv");
  const csvText = await res.text();
  const items = parseSchoolItems(csvText);

  if (period) {
    return items.filter((item) => item.regulationPeriod.includes(period));
  }
  return items;
};
