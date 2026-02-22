import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import { parseSchoolItems } from "@/const/function/csv/parseSchoolItems";

export async function getSchoolItems(type: "period", id: string): Promise<SchoolItemType[]>;
export async function getSchoolItems(type: "all"): Promise<SchoolItemType[]>;
export async function getSchoolItems(
  type: "period" | "all",
  id?: string
): Promise<SchoolItemType[]> {
  const res = await fetch("/csv/school-item.csv");
  const csvText = await res.text();
  const items = parseSchoolItems(csvText);

  if (type === "period") {
    return items.filter((item) => item.regulationPeriod.includes(id!));
  }
  return items;
}
