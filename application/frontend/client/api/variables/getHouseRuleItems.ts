import type { HouseRuleItemType } from "@/const/type/houseRule/HouseRuleItemType";
import { parseHouseRuleItems } from "@/api/variables/csv/parseHouseRuleItems";

export const getHouseRuleItems = async (): Promise<HouseRuleItemType[]> => {
  const res = await fetch("/csv/house-rule-item.csv");
  const csvText = await res.text();
  return parseHouseRuleItems(csvText);
};
