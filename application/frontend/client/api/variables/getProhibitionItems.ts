import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";
import { parseProhibitionItems } from "@/api/variables/csv/parseProhibitionItems";

export const getProhibitionItems = async (): Promise<ProhibitionItemType[]> => {
  const res = await fetch("/csv/prohibition-item.csv");
  const csvText = await res.text();
  return parseProhibitionItems(csvText);
};
